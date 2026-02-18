import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { bearer } from '@elysiajs/bearer';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { UserProfile, Friendship, UserBlock, AuthUser } from './models';

// Token format: access_<userId>_<timestamp>
function extractUserId(bearer: string): string | null {
  const match = bearer?.match(/^access_(.+)_\d+$/);
  return match ? match[1] : null;
}

const PORT = parseInt(process.env.USER_SERVICE_PORT || '3002');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:discord_admin_pass@localhost:27017/discord?authSource=admin';

// Connect MongoDB
await mongoose.connect(MONGODB_URI);
console.log('✅ MongoDB connected');

// Connect Redis
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || 'discord_redis_pass',
});
console.log('✅ Redis connected');

const app = new Elysia()
  .use(cors())
  .use(bearer())
  .use(
    swagger({
      documentation: {
        info: { title: 'User Service API', version: '1.0.0' },
        tags: [
          { name: 'users', description: 'User profile management' },
          { name: 'friends', description: 'Friend management' },
          { name: 'blocks', description: 'User blocking' },
          { name: 'presence', description: 'User presence' },
        ],
      },
    })
  )
  .get('/health', () => ({ status: 'ok', service: 'user-service' }))
  
  // Get current user profile
  .get('/users/@me', async ({ bearer }) => {
    if (!bearer) {
      return { 
        success: false,
        error: 'Unauthorized' 
      };
    }
    
    try {
      const userId = extractUserId(bearer);
      if (!userId) return { success: false, error: 'Invalid token format' };

      // Auth service ile aynı MongoDB — users koleksiyonundan gerçek kullanıcı bilgisi
      const authUser = await AuthUser.findById(userId).lean();
      if (!authUser) return { success: false, error: 'User not found' };

      return {
        success: true,
        data: {
          id: userId,
          email: (authUser as any).email ?? '',
          username: (authUser as any).username ?? '',
          emailVerified: (authUser as any).emailVerified ?? false,
          twoFactorEnabled: (authUser as any).twoFactorEnabled ?? false,
          createdAt: (authUser as any).createdAt?.toISOString() ?? new Date().toISOString(),
          updatedAt: (authUser as any).updatedAt?.toISOString() ?? new Date().toISOString(),
        },
      };
    } catch (error) {
      return { success: false, error: 'Failed to get user profile' };
    }
  }, { detail: { tags: ['users'] } })
  
  // Get user profile by ID
  .get('/users/:userId', async ({ params: { userId } }) => {
    const profile = await UserProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    return profile || { error: 'Profile not found' };
  }, { detail: { tags: ['users'] } })
  
  // Update own profile
  .patch('/users/@me', async ({ body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };
    const profile = await UserProfile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      body,
      { new: true, upsert: true }
    );
    return profile;
  }, {
    body: t.Object({
      displayName: t.Optional(t.String()),
      avatarUrl: t.Optional(t.String()),
      bannerUrl: t.Optional(t.String()),
      bio: t.Optional(t.String()),
      customStatus: t.Optional(t.String()),
    }),
    detail: { tags: ['users'] },
  })
  
  // Get friends
  .get('/users/@me/friends', async ({ bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };

    // Her iki yönden arkadaşları getir (gönderen de alıcı da)
    const friends = await Friendship.find({
      $or: [
        { userId: new mongoose.Types.ObjectId(userId), status: 'accepted' },
        { friendId: new mongoose.Types.ObjectId(userId), status: 'accepted' },
      ],
    }).lean();

    // Diğer tarafın kullanıcı adını AuthUser'dan çek
    const enriched = await Promise.all(friends.map(async (f: any) => {
      const otherUserId = f.userId.toString() === userId ? f.friendId : f.userId;
      const authUser = await AuthUser.findById(otherUserId).lean();
      return {
        ...f,
        friendId: otherUserId,
        username: (authUser as any)?.username ?? '',
        displayName: (authUser as any)?.username ?? '',
      };
    }));

    return { success: true, data: enriched };
  }, { detail: { tags: ['friends'] } })

  // Get pending friend requests
  .get('/users/@me/friend-requests', async ({ bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };
    const requests = await Friendship.find({
      $or: [
        { userId: new mongoose.Types.ObjectId(userId), status: 'pending' },
        { friendId: new mongoose.Types.ObjectId(userId), status: 'pending' },
      ],
    }).lean();
    const enriched = await Promise.all(requests.map(async (r: any) => {
      const isIncoming = r.friendId.toString() === userId;
      const otherUserId = isIncoming ? r.userId : r.friendId;
      const authUser = await AuthUser.findById(otherUserId).lean();
      return {
        ...r,
        direction: isIncoming ? 'incoming' : 'outgoing',
        username: (authUser as any)?.username ?? '',
      };
    }));
    return { success: true, data: enriched };
  }, { detail: { tags: ['friends'] } })
  
  // Arkadaş isteği gönder (username veya email ile)
  .post('/users/friend-request', async ({ body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const currentUserId = extractUserId(bearer);
    if (!currentUserId) return { error: 'Invalid token' };

    const identifier = (body as any).identifier?.trim();
    if (!identifier) return { error: 'identifier gerekli' };

    // Username veya email ile hedef kullanıcıyı bul
    const targetUser = await AuthUser.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    }).lean();

    if (!targetUser) return { success: false, error: `"${identifier}" adlı kullanıcı bulunamadı.` };

    const targetId = (targetUser as any)._id.toString();
    if (targetId === currentUserId) return { success: false, error: 'Kendinize arkadaşlık isteği gönderemezsiniz.' };

    // Zaten arkadaş mı / bekleyen istek var mı?
    const existing = await Friendship.findOne({
      $or: [
        { userId: new mongoose.Types.ObjectId(currentUserId), friendId: new mongoose.Types.ObjectId(targetId) },
        { userId: new mongoose.Types.ObjectId(targetId), friendId: new mongoose.Types.ObjectId(currentUserId) },
      ],
    }).lean();
    if (existing) return { success: false, error: 'Bu kullanıcıyla zaten arkadaş isteğiniz var.' };

    const friendship = await Friendship.create({
      userId: new mongoose.Types.ObjectId(currentUserId),
      friendId: new mongoose.Types.ObjectId(targetId),
      status: 'pending',
    });
    return { success: true, data: friendship };
  }, {
    body: t.Object({ identifier: t.String() }),
    detail: { tags: ['friends'] },
  })

  // Accept friend request
  .put('/users/@me/friend-requests/:requestId', async ({ params: { requestId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const friendship = await Friendship.findByIdAndUpdate(
      requestId,
      { status: 'accepted' },
      { new: true }
    );
    return friendship;
  }, { detail: { tags: ['friends'] } })
  
  // Remove friend
  .delete('/users/@me/friends/:userId', async ({ params: { userId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const currentUserId = extractUserId(bearer);
    if (!currentUserId) return { error: 'Invalid token' };
    await Friendship.deleteOne({
      userId: new mongoose.Types.ObjectId(currentUserId),
      friendId: new mongoose.Types.ObjectId(userId),
    });
    return { success: true };
  }, { detail: { tags: ['friends'] } })
  
  // Block user
  .post('/users/:userId/block', async ({ params: { userId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const currentUserId = extractUserId(bearer);
    if (!currentUserId) return { error: 'Invalid token' };
    const block = await UserBlock.create({
      userId: new mongoose.Types.ObjectId(currentUserId),
      blockedUserId: new mongoose.Types.ObjectId(userId),
    });
    return block;
  }, { detail: { tags: ['blocks'] } })
  
  // Unblock user
  .delete('/users/:userId/block', async ({ params: { userId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const currentUserId = extractUserId(bearer);
    if (!currentUserId) return { error: 'Invalid token' };
    await UserBlock.deleteOne({
      userId: new mongoose.Types.ObjectId(currentUserId),
      blockedUserId: new mongoose.Types.ObjectId(userId),
    });
    return { success: true };
  }, { detail: { tags: ['blocks'] } })
  
  // Update presence
  .patch('/users/@me/presence', async ({ body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };
    await redis.hset(`presence:${userId}`, body);
    await redis.zadd('online_users', Date.now(), userId);
    return { success: true };
  }, {
    body: t.Object({
      status: t.Union([t.Literal('online'), t.Literal('offline'), t.Literal('away'), t.Literal('dnd')]),
      customStatus: t.Optional(t.String()),
    }),
    detail: { tags: ['presence'] },
  })
  
  .listen(PORT);

console.log(`🦊 User Service running at http://${app.server?.hostname}:${app.server?.port}`);
