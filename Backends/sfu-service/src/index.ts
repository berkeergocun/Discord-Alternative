import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { bearer } from '@elysiajs/bearer';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { VoiceSession, VoiceParticipant } from './models';

const PORT = parseInt(process.env.SFU_SERVICE_PORT || '3007');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:discord_admin_pass@localhost:27017/discord?authSource=admin';

await mongoose.connect(MONGODB_URI);
console.log('✅ MongoDB connected');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || 'discord_redis_pass',
});

console.log('✅ Redis connected');

const app = new Elysia()
  .use(cors())
  .use(bearer())
  .use(swagger({ documentation: { info: { title: 'SFU Service API', version: '1.0.0' } } }))
  
  .get('/health', () => ({ 
    status: 'ok', 
    service: 'sfu-service'
  }))
  
  .post('/channels/:channelId/voice/join', async ({ params: { channelId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'user_from_token';
    
    let session = await VoiceSession.findOne({ channelId: new mongoose.Types.ObjectId(channelId) });
    if (!session) {
      session = await VoiceSession.create({
        channelId: new mongoose.Types.ObjectId(channelId),
        guildId: new mongoose.Types.ObjectId('guild_id'),
        routerId: `router_${Date.now()}`,
      });
    }
    
    await VoiceParticipant.findOneAndUpdate(
      { sessionId: session._id, userId: new mongoose.Types.ObjectId(userId) },
      { sessionId: session._id, userId: new mongoose.Types.ObjectId(userId) },
      { upsert: true, new: true }
    );
    
    return { 
      sessionId: session._id,
      success: true 
    };
  })
  
  .patch('/channels/:channelId/voice/@me', async ({ params: { channelId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'user_from_token';
    
    const session = await VoiceSession.findOne({ channelId: new mongoose.Types.ObjectId(channelId) });
    if (!session) return { error: 'Session not found' };
    
    await VoiceParticipant.findOneAndUpdate(
      { sessionId: session._id, userId: new mongoose.Types.ObjectId(userId) },
      body,
      { new: true }
    );
    
    return { success: true };
  }, { 
    body: t.Object({ 
      muted: t.Optional(t.Boolean()), 
      deafened: t.Optional(t.Boolean()),
      video: t.Optional(t.Boolean()),
      screenshare: t.Optional(t.Boolean())
    }) 
  })
  
  .delete('/channels/:channelId/voice/@me', async ({ params: { channelId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'user_from_token';
    
    const session = await VoiceSession.findOne({ channelId: new mongoose.Types.ObjectId(channelId) });
    if (session) {
      await VoiceParticipant.deleteOne({ 
        sessionId: session._id, 
        userId: new mongoose.Types.ObjectId(userId) 
      });
    }
    
    return { success: true };
  })
  
  .get('/channels/:channelId/voice/participants', async ({ params: { channelId } }) => {
    const session = await VoiceSession.findOne({ channelId: new mongoose.Types.ObjectId(channelId) });
    if (!session) return [];
    
    return await VoiceParticipant.find({ sessionId: session._id }).populate('userId', 'username avatarUrl');
  })
  
  .listen(PORT);

console.log(`🦊 SFU Service running at http://${app.server?.hostname}:${app.server?.port}`);
