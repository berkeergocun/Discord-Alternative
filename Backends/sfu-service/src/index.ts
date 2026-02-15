import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { bearer } from '@elysiajs/bearer';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import * as mediasoup from 'mediasoup';
import { VoiceSession, VoiceParticipant } from './models';

const PORT = parseInt(process.env.SFU_SERVICE_PORT || '3006');
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:discord_admin_pass@localhost:27017/discord?authSource=admin');
console.log('✅ MongoDB connected');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || 'discord_redis_pass',
});

// Mediasoup workers and routers
let workers: mediasoup.types.Worker[] = [];
const routers = new Map<string, mediasoup.types.Router>();
const transports = new Map<string, mediasoup.types.WebRtcTransport>();
const producers = new Map<string, mediasoup.types.Producer>();
const consumers = new Map<string, mediasoup.types.Consumer>();

// Initialize Mediasoup workers
async function initMediasoup() {
  const numWorkers = 2; // Adjust based on CPU cores
  
  for (let i = 0; i < numWorkers; i++) {
    const worker = await mediasoup.createWorker({
      logLevel: 'warn',
      rtcMinPort: 10000 + (i * 1000),
      rtcMaxPort: 10000 + (i * 1000) + 999,
    });
    
    worker.on('died', () => {
      console.error('Mediasoup worker died, exiting...');
      process.exit(1);
    });
    
    workers.push(worker);
  }
  
  console.log(`✅ Mediasoup initialized with ${numWorkers} workers`);
}

// Get or create router for a channel
async function getOrCreateRouter(channelId: string): Promise<mediasoup.types.Router> {
  if (routers.has(channelId)) {
    return routers.get(channelId)!;
  }
  
  // Round-robin worker selection
  const worker = workers[routers.size % workers.length];
  
  const router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
    ],
  });
  
  routers.set(channelId, router);
  return router;
}

const app = new Elysia()
  .use(cors())
  .use(bearer())
  .use(swagger({ documentation: { info: { title: 'SFU Service API', version: '1.0.0' } } }))
  .get('/health', () => ({ 
    status: 'ok', 
    service: 'sfu-service',
    workers: workers.length,
    routers: routers.size,
  }))
  
  // Get RTP capabilities for a channel
  .get('/channels/:channelId/voice/capabilities', async ({ params: { channelId } }) => {
    const router = await getOrCreateRouter(channelId);
    return { rtpCapabilities: router.rtpCapabilities };
  })
  
  // Join voice channel
  .post('/channels/:channelId/voice/join', async ({ params: { channelId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'from_token';
    
    const router = await getOrCreateRouter(channelId);
    
    // Create or get session
    let session = await VoiceSession.findOne({ channelId: new mongoose.Types.ObjectId(channelId) });
    if (!session) {
      session = await VoiceSession.create({
        channelId: new mongoose.Types.ObjectId(channelId),
        guildId: new mongoose.Types.ObjectId('guild_from_channel'),
        routerId: router.id,
      });
    }
    
    return { 
      sessionId: session._id,
      rtpCapabilities: router.rtpCapabilities 
    };
  })
  
  // Create WebRTC transport
  .post('/channels/:channelId/voice/transport', async ({ params: { channelId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'from_token';
    
    const router = await getOrCreateRouter(channelId);
    
    const transport = await router.createWebRtcTransport({
      listenIps: [{ ip: '0.0.0.0', announcedIp: process.env.ANNOUNCED_IP || '127.0.0.1' }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });
    
    transports.set(transport.id, transport);
    
    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
  }, { body: t.Object({ producing: t.Boolean(), consuming: t.Boolean() }) })
  
  // Connect transport
  .post('/transports/:transportId/connect', async ({ params: { transportId }, body }) => {
    const transport = transports.get(transportId);
    if (!transport) return { error: 'Transport not found' };
    
    await transport.connect({ dtlsParameters: body.dtlsParameters });
    return { success: true };
  }, { body: t.Object({ dtlsParameters: t.Any() }) })
  
  // Produce media (audio/video)
  .post('/transports/:transportId/produce', async ({ params: { transportId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'from_token';
    
    const transport = transports.get(transportId);
    if (!transport) return { error: 'Transport not found' };
    
    const producer = await transport.produce({
      kind: body.kind,
      rtpParameters: body.rtpParameters,
    });
    
    producers.set(producer.id, producer);
    
    return { id: producer.id };
  }, { body: t.Object({ kind: t.Union([t.Literal('audio'), t.Literal('video')]), rtpParameters: t.Any() }) })
  
  // Consume media from another user
  .post('/channels/:channelId/voice/consume', async ({ params: { channelId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    
    const router = await getOrCreateRouter(channelId);
    const transport = transports.get(body.transportId);
    const producer = producers.get(body.producerId);
    
    if (!transport || !producer) return { error: 'Transport or producer not found' };
    
    if (!router.canConsume({ producerId: producer.id, rtpCapabilities: body.rtpCapabilities })) {
      return { error: 'Cannot consume' };
    }
    
    const consumer = await transport.consume({
      producerId: producer.id,
      rtpCapabilities: body.rtpCapabilities,
      paused: false,
    });
    
    consumers.set(consumer.id, consumer);
    
    return {
      id: consumer.id,
      producerId: producer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
    };
  }, { body: t.Object({ transportId: t.String(), producerId: t.String(), rtpCapabilities: t.Any() }) })
  
  // Update voice state (mute, video, etc)
  .patch('/channels/:channelId/voice/@me', async ({ params: { channelId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'from_token';
    
    const session = await VoiceSession.findOne({ channelId: new mongoose.Types.ObjectId(channelId) });
    if (!session) return { error: 'Session not found' };
    
    await VoiceParticipant.findOneAndUpdate(
      { sessionId: session._id, userId: new mongoose.Types.ObjectId(userId) },
      body,
      { new: true }
    );
    
    return { success: true };
  }, { body: t.Object({ 
    muted: t.Optional(t.Boolean()), 
    deafened: t.Optional(t.Boolean()),
    video: t.Optional(t.Boolean()),
    screenshare: t.Optional(t.Boolean())
  }) })
  
  // Leave voice channel
  .delete('/channels/:channelId/voice/@me', async ({ params: { channelId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'from_token';
    
    const session = await VoiceSession.findOne({ channelId: new mongoose.Types.ObjectId(channelId) });
    if (session) {
      await VoiceParticipant.deleteOne({ 
        sessionId: session._id, 
        userId: new mongoose.Types.ObjectId(userId) 
      });
    }
    
    return { success: true };
  })
  
  // Get voice participants
  .get('/channels/:channelId/voice/participants', async ({ params: { channelId } }) => {
    const session = await VoiceSession.findOne({ channelId: new mongoose.Types.ObjectId(channelId) });
    if (!session) return [];
    
    return await VoiceParticipant.find({ sessionId: session._id }).populate('userId', 'username avatarUrl');
  })
  
  .listen(PORT);

console.log(`🦊 SFU Service running at http://${app.server?.hostname}:${app.server?.port}`);

initMediasoup().catch(err => {
  console.error('Failed to initialize Mediasoup:', err);
  process.exit(1);
});
