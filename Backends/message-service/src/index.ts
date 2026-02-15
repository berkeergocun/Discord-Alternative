import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { bearer } from '@elysiajs/bearer';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import amqp from 'amqplib';
import { Message, MessageAttachment, MessageReaction, DMChannel, DMChannelRecipient } from './models';

const PORT = parseInt(process.env.MESSAGE_SERVICE_PORT || '3004');
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:discord_admin_pass@localhost:27017/discord?authSource=admin');
console.log('✅ MongoDB connected');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || 'discord_redis_pass',
});

let rabbitChannel: amqp.Channel;
try {
  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://discord_user:discord_pass@localhost:5672');
  rabbitChannel = await conn.createChannel();
  await rabbitChannel.assertExchange('discord_events', 'topic', { durable: true });
  console.log('✅ RabbitMQ connected');
} catch (err) {
  console.error('⚠️ RabbitMQ connection failed:', err);
}

async function publishEvent(event: string, data: any) {
  if (rabbitChannel) {
    rabbitChannel.publish('discord_events', event, Buffer.from(JSON.stringify(data)));
  }
}

const app = new Elysia()
  .use(cors())
  .use(bearer())
  .use(swagger({ documentation: { info: { title: 'Message Service API', version: '1.0.0' } } }))
  .get('/health', () => ({ status: 'ok', service: 'message-service' }))
  
  // Messages
  .get('/channels/:channelId/messages', async ({ params: { channelId }, query }) => {
    const limit = parseInt(query.limit as string || '50');
    const before = query.before ? new mongoose.Types.ObjectId(query.before as string) : null;
    const filter: any = { channelId: new mongoose.Types.ObjectId(channelId) };
    if (before) filter._id = { $lt: before };
    
    return await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('authorId', 'username avatarUrl');
  })
  
  .post('/channels/:channelId/messages', async ({ params: { channelId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'from_token';
    
    const message = await Message.create({
      channelId: new mongoose.Types.ObjectId(channelId),
      authorId: new mongoose.Types.ObjectId(userId),
      content: body.content,
      replyToId: body.replyToId ? new mongoose.Types.ObjectId(body.replyToId) : undefined,
    });
    
    await publishEvent('message.create', { channelId, message });
    return message;
  }, { body: t.Object({ content: t.String(), replyToId: t.Optional(t.String()) }) })
  
  .patch('/channels/:channelId/messages/:messageId', async ({ params: { messageId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    
    const message = await Message.findByIdAndUpdate(
      messageId,
      { content: body.content, edited: true },
      { new: true }
    );
    
    await publishEvent('message.update', { message });
    return message;
  }, { body: t.Object({ content: t.String() }) })
  
  .delete('/channels/:channelId/messages/:messageId', async ({ params: { messageId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    
    await Message.findByIdAndDelete(messageId);
    await publishEvent('message.delete', { messageId });
    return { success: true };
  })
  
  // Reactions
  .put('/channels/:channelId/messages/:messageId/reactions/:emoji/@me', async ({ params: { messageId, emoji }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'from_token';
    
    await MessageReaction.create({
      messageId: new mongoose.Types.ObjectId(messageId),
      userId: new mongoose.Types.ObjectId(userId),
      emoji: decodeURIComponent(emoji),
    });
    
    return { success: true };
  })
  
  .delete('/channels/:channelId/messages/:messageId/reactions/:emoji/@me', async ({ params: { messageId, emoji }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'from_token';
    
    await MessageReaction.deleteOne({
      messageId: new mongoose.Types.ObjectId(messageId),
      userId: new mongoose.Types.ObjectId(userId),
      emoji: decodeURIComponent(emoji),
    });
    
    return { success: true };
  })
  
  // Typing indicator
  .post('/channels/:channelId/typing', async ({ params: { channelId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'from_token';
    
    await redis.setex(`typing:${channelId}:${userId}`, 10, '1');
    await publishEvent('typing.start', { channelId, userId });
    
    return { success: true };
  })
  
  // DM Channels
  .get('/users/@me/channels', async ({ bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'from_token';
    
    const recipients = await DMChannelRecipient.find({ userId: new mongoose.Types.ObjectId(userId) });
    const channelIds = recipients.map(r => r.channelId);
    
    return await DMChannel.find({ _id: { $in: channelIds } });
  })
  
  .post('/users/@me/channels', async ({ body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'from_token';
    
    const channel = await DMChannel.create({ type: 'dm' });
    await DMChannelRecipient.insertMany([
      { channelId: channel._id, userId: new mongoose.Types.ObjectId(userId) },
      { channelId: channel._id, userId: new mongoose.Types.ObjectId(body.recipientId) },
    ]);
    
    return channel;
  }, { body: t.Object({ recipientId: t.String() }) })
  
  // Search (basic - Elasticsearch integration recommended for production)
  .get('/channels/:channelId/messages/search', async ({ params: { channelId }, query }) => {
    const searchQuery = query.q as string;
    return await Message.find({
      channelId: new mongoose.Types.ObjectId(channelId),
      content: { $regex: searchQuery, $options: 'i' }
    }).limit(25);
  })
  
  .listen(PORT);

console.log(`🦊 Message Service running at http://${app.server?.hostname}:${app.server?.port}`);
