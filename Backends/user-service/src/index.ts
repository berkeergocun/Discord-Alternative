import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { bearer } from '@elysiajs/bearer';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { UserProfile, Friendship, UserBlock } from './models';

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
      // Extract userId from token (format: access_<userId>_<timestamp>)
      const tokenParts = bearer.split('_');
      if (tokenParts.length >= 2) {
        const userId = tokenParts[1];
        
        // Get user from auth database (mock for now)
        // In production, this should call auth service or decode JWT
        return {
          success: true,
          data: {
            id: userId,
            email: 'user@example.com', // Mock data
            username: 'testuser999', // Mock data
            emailVerified: false,
            twoFactorEnabled: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        };
      }
      
      return { 
        success: false,
        error: 'Invalid token format' 
      };
    } catch (error) {
      return { 
        success: false,
        error: 'Failed to get user profile' 
      };
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
    const userId = 'extracted_from_token'; // TODO: Extract from JWT
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
    const userId = 'extracted_from_token';
    const friends = await Friendship.find({
      userId: new mongoose.Types.ObjectId(userId),
      status: 'accepted',
    }).populate('friendId');
    return friends;
  }, { detail: { tags: ['friends'] } })
  
  // Send friend request
  .post('/users/:userId/friend-request', async ({ params: { userId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const currentUserId = 'extracted_from_token';
    const friendship = await Friendship.create({
      userId: new mongoose.Types.ObjectId(currentUserId),
      friendId: new mongoose.Types.ObjectId(userId),
      status: 'pending',
    });
    return friendship;
  }, { detail: { tags: ['friends'] } })
  
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
    const currentUserId = 'extracted_from_token';
    await Friendship.deleteOne({
      userId: new mongoose.Types.ObjectId(currentUserId),
      friendId: new mongoose.Types.ObjectId(userId),
    });
    return { success: true };
  }, { detail: { tags: ['friends'] } })
  
  // Block user
  .post('/users/:userId/block', async ({ params: { userId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const currentUserId = 'extracted_from_token';
    const block = await UserBlock.create({
      userId: new mongoose.Types.ObjectId(currentUserId),
      blockedUserId: new mongoose.Types.ObjectId(userId),
    });
    return block;
  }, { detail: { tags: ['blocks'] } })
  
  // Unblock user
  .delete('/users/:userId/block', async ({ params: { userId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const currentUserId = 'extracted_from_token';
    await UserBlock.deleteOne({
      userId: new mongoose.Types.ObjectId(currentUserId),
      blockedUserId: new mongoose.Types.ObjectId(userId),
    });
    return { success: true };
  }, { detail: { tags: ['blocks'] } })
  
  // Update presence
  .patch('/users/@me/presence', async ({ body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'extracted_from_token';
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
