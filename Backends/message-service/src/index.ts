import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { bearer } from '@elysiajs/bearer';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import amqp from 'amqplib';
import * as Minio from 'minio';
import { Message, MessageAttachment, MessageReaction, DMChannel, DMChannelRecipient, AuthUser } from './models';

// ─── MinIO client ────────────────────────────────────────────────────────────
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'localhost';
const MINIO_PORT    = parseInt(process.env.MINIO_PORT   || '9000');
const MINIO_ACCESS  = process.env.MINIO_ACCESS_KEY || 'discord_minio_user';
const MINIO_SECRET  = process.env.MINIO_SECRET_KEY || 'discord_minio_pass';
const MINIO_BUCKET  = 'discord-attachments';

const minioClient = new Minio.Client({
  endPoint:        MINIO_ENDPOINT,
  port:            MINIO_PORT,
  useSSL:          false,
  accessKey:       MINIO_ACCESS,
  secretKey:       MINIO_SECRET,
});

// Bucket yoksa oluştur
try {
  const exists = await minioClient.bucketExists(MINIO_BUCKET);
  if (!exists) {
    await minioClient.makeBucket(MINIO_BUCKET, 'us-east-1');
    console.log(`✅ MinIO bucket '${MINIO_BUCKET}' oluşturuldu`);
  } else {
    console.log(`✅ MinIO bağlandı (bucket: ${MINIO_BUCKET})`);
  }
} catch (err) {
  console.error('⚠️ MinIO bağlantı hatası:', err);
}

// ─── WebSocket istemci takibi (channelId → Set<ws>) ─────────────────────────
const wsClients = new Map<string, Set<any>>()
const wsConnData = new WeakMap<any, { userId: string | null; subscribed: Set<string> }>()

function broadcastToChannel(channelId: string, event: string, data: any) {
  const clients = wsClients.get(channelId.toString())
  if (!clients || clients.size === 0) return
  const payload = JSON.stringify({ event, data })
  for (const client of clients) {
    try { client.send(payload) } catch { /* bağlantı kapandıysa yoksay */ }
  }
}

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

// Mongoose dökümanlarını düz JSON'a çevir
function toJSON(doc: any): any {
  if (!doc) return doc;
  const obj = doc?.toObject ? doc.toObject({ versionKey: false }) : doc;
  return JSON.parse(JSON.stringify(obj));
}
function toJSONList(docs: any[]): any[] {
  return docs.map(toJSON);
}

// Extract userId from bearer token (format: access_{userId}_{timestamp})
function extractUserId(bearer: string): string | null {
  const match = bearer?.match(/^access_(.+)_\d+$/);
  return match ? match[1] : null;
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

    const msgs = await Message.find(filter).sort({ createdAt: -1 }).limit(limit).lean();

    // populate yerine AuthUser ile manuel zenginleştirme
    const authorIds = [...new Set(msgs.map(m => m.authorId.toString()))];
    const authors = await AuthUser.find({ _id: { $in: authorIds } }).lean();
    const authorMap = new Map((authors as any[]).map(a => [a._id.toString(), a]));

    return msgs.map(m => {
      const author = authorMap.get(m.authorId.toString()) as any;
      return {
        ...JSON.parse(JSON.stringify(m)),
        authorId: {
          _id: m.authorId.toString(),
          id: m.authorId.toString(),
          username: author?.username ?? 'Kullanıcı',
          displayName: author?.username ?? 'Kullanıcı',
          avatarUrl: null,
        },
      };
    });
  })
  
  .post('/channels/:channelId/messages', async ({ params: { channelId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };

    const message = await Message.create({
      channelId: new mongoose.Types.ObjectId(channelId),
      authorId: new mongoose.Types.ObjectId(userId),
      content: body.content,
      replyToId: body.replyToId ? new mongoose.Types.ObjectId(body.replyToId) : undefined,
    });

    // Yazar bilgisini ekle
    const author = await AuthUser.findById(userId).lean() as any;
    const msgJson = {
      ...toJSON(message),
      authorId: {
        _id: userId,
        id: userId,
        username: author?.username ?? 'Kullanıcı',
        displayName: author?.username ?? 'Kullanıcı',
        avatarUrl: null,
      },
    };

    // WebSocket üzerinden anlık yayın
    broadcastToChannel(channelId, 'message.create', { channelId, message: msgJson });
    await publishEvent('message.create', { channelId, message: msgJson });
    return msgJson;
  }, { body: t.Object({ content: t.String(), replyToId: t.Optional(t.String()) }) })
  
  .patch('/channels/:channelId/messages/:messageId', async ({ params: { messageId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    
    const message = await Message.findByIdAndUpdate(
      messageId,
      { content: body.content, edited: true },
      { new: true }
    );
    
    await publishEvent('message.update', { message: toJSON(message) });
    return toJSON(message);
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
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };
    
    await MessageReaction.create({
      messageId: new mongoose.Types.ObjectId(messageId),
      userId: new mongoose.Types.ObjectId(userId),
      emoji: decodeURIComponent(emoji),
    });
    
    return { success: true };
  })
  
  .delete('/channels/:channelId/messages/:messageId/reactions/:emoji/@me', async ({ params: { messageId, emoji }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };
    
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
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };

    await redis.setex(`typing:${channelId}:${userId}`, 10, '1');
    // WebSocket üzerinden typing yayını
    broadcastToChannel(channelId, 'typing.start', { channelId, userId });
    await publishEvent('typing.start', { channelId, userId });

    return { success: true };
  })

  // ─── Dosya eki yükleme (multipart, max 10 MB) ────────────────────────────
  .post('/channels/:channelId/attachments', async ({ params: { channelId }, request, bearer }) => {
    if (!bearer) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    const userId = extractUserId(bearer);
    if (!userId) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });

    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'multipart/form-data gerekli' }), { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const content = (formData.get('content') as string | null) ?? '';

    if (!file) return new Response(JSON.stringify({ error: 'Dosya bulunamadı' }), { status: 400 });

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      return new Response(JSON.stringify({ error: 'Dosya boyutu 10 MB\'ı geçemez' }), { status: 413 });
    }

    // MinIO'ya yükle
    const ext = file.name.split('.').pop() ?? '';
    const objectKey = `${channelId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      await minioClient.putObject(MINIO_BUCKET, objectKey, buffer, file.size, {
        'Content-Type': file.type || 'application/octet-stream',
      });
    } catch (err: any) {
      console.error('MinIO yükleme hatası:', err);
      return new Response(JSON.stringify({ error: 'Dosya yüklenemedi' }), { status: 500 });
    }

    // Mesaj oluştur
    const message = await Message.create({
      channelId: new mongoose.Types.ObjectId(channelId),
      authorId:  new mongoose.Types.ObjectId(userId),
      content:   content || '',
      type:      'default',
    });

    // Attachment kaydı
    const attachment = await MessageAttachment.create({
      messageId:   message._id,
      filename:    file.name,
      url:         objectKey,   // MinIO key; frontend /api/v1/media/{key} üzerinden okur
      size:        file.size,
      contentType: file.type || 'application/octet-stream',
    });

    const author = await AuthUser.findById(userId).lean() as any;
    const msgJson = {
      ...toJSON(message),
      authorId: {
        _id: userId, id: userId,
        username: author?.username ?? 'Kullanıcı',
        displayName: author?.username ?? 'Kullanıcı',
        avatarUrl: null,
      },
      attachments: [toJSON(attachment)],
    };

    broadcastToChannel(channelId, 'message.create', { channelId, message: msgJson });
    await publishEvent('message.create', { channelId, message: msgJson });
    return new Response(JSON.stringify(msgJson), {
      headers: { 'Content-Type': 'application/json' },
    });
  })
  
  // DM Channels — /channels/dm prefix kullan (Traefik zaten /api/v1/channels → message-service)
  .get('/channels/dm', async ({ bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };
    
    const myRecipients = await DMChannelRecipient.find({ userId: new mongoose.Types.ObjectId(userId) }).lean();
    const channelIds = myRecipients.map(r => r.channelId);
    
    const channels = await DMChannel.find({ _id: { $in: channelIds } }).lean();
    
    // Her kanal için tüm alıcıları getir (karşı tarafın user ID'si dahil)
    const allRecipients = await DMChannelRecipient.find({ channelId: { $in: channelIds } }).lean();
    
    // Karşı tarafların user ID'lerini topla ve user bilgilerini al
    const otherUserIds = [...new Set(
      allRecipients
        .filter(r => r.userId.toString() !== userId)
        .map(r => r.userId)
    )];
    const authUsers = await AuthUser.find({ _id: { $in: otherUserIds } }).lean();
    const userMap = new Map(authUsers.map((u: any) => [u._id.toString(), u]));
    
    return channels.map(ch => {
      const chId = ch._id.toString();
      const recipients = allRecipients
        .filter(r => r.channelId.toString() === chId && r.userId.toString() !== userId)
        .map(r => {
          const user = userMap.get(r.userId.toString()) as any;
          return { userId: r.userId.toString(), username: user?.username ?? null };
        });
      return {
        ...JSON.parse(JSON.stringify(ch)),
        recipients,
      };
    });
  })
  
  .post('/channels/dm', async ({ body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };
    
    const channel = await DMChannel.create({ type: 'dm' });
    await DMChannelRecipient.insertMany([
      { channelId: channel._id, userId: new mongoose.Types.ObjectId(userId) },
      { channelId: channel._id, userId: new mongoose.Types.ObjectId((body as any).recipientId) },
    ]);
    
    return toJSON(channel);
  }, { body: t.Object({ recipientId: t.String() }) })

  // Legacy /users/@me/channels (doğrudan port erişimi için)
  .get('/users/@me/channels', async ({ bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };
    
    const recipients = await DMChannelRecipient.find({ userId: new mongoose.Types.ObjectId(userId) });
    const channelIds = recipients.map(r => r.channelId);
    
    return toJSONList(await DMChannel.find({ _id: { $in: channelIds } }));
  })
  
  .post('/users/@me/channels', async ({ body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = extractUserId(bearer);
    if (!userId) return { error: 'Invalid token' };
    
    const channel = await DMChannel.create({ type: 'dm' });
    await DMChannelRecipient.insertMany([
      { channelId: channel._id, userId: new mongoose.Types.ObjectId(userId) },
      { channelId: channel._id, userId: new mongoose.Types.ObjectId((body as any).recipientId) },
    ]);
    
    return toJSON(channel);
  }, { body: t.Object({ recipientId: t.String() }) })
  
  // Search
  .get('/channels/:channelId/messages/search', async ({ params: { channelId }, query }) => {
    const searchQuery = query.q as string;
    return toJSONList(await Message.find({
      channelId: new mongoose.Types.ObjectId(channelId),
      content: { $regex: searchQuery, $options: 'i' }
    }).limit(25));
  })

  // ─── WebSocket Gateway (gerçek zamanlı mesaj/typing) ────────────────────────
  .ws('/ws', {
    open(ws: any) {
      wsConnData.set(ws, { userId: null, subscribed: new Set() })
      ws.send(JSON.stringify({ op: 'HELLO' }))
    },
    message(ws: any, rawMsg: any) {
      let msg: any
      try {
        msg = typeof rawMsg === 'string' ? JSON.parse(rawMsg) : rawMsg
      } catch { return }

      const connData = wsConnData.get(ws)
      if (!connData) return

      if (msg.op === 'IDENTIFY') {
        connData.userId = extractUserId(msg.data?.token ?? '')
        ws.send(JSON.stringify({ op: 'READY', data: { userId: connData.userId } }))
      } else if (msg.op === 'SUBSCRIBE') {
        const channelId: string = msg.data?.channelId
        if (channelId) {
          if (!wsClients.has(channelId)) wsClients.set(channelId, new Set())
          wsClients.get(channelId)!.add(ws)
          connData.subscribed.add(channelId)
        }
      } else if (msg.op === 'UNSUBSCRIBE') {
        const channelId: string = msg.data?.channelId
        if (channelId) {
          wsClients.get(channelId)?.delete(ws)
          connData.subscribed.delete(channelId)
        }
      } else if (msg.op === 'HEARTBEAT') {
        ws.send(JSON.stringify({ op: 'HEARTBEAT_ACK' }))
      }
    },
    close(ws: any) {
      const connData = wsConnData.get(ws)
      if (connData) {
        for (const channelId of connData.subscribed) {
          wsClients.get(channelId)?.delete(ws)
        }
        wsConnData.delete(ws)
      }
    },
  })

  .listen(PORT);

console.log(`🦊 Message Service running at http://${app.server?.hostname}:${app.server?.port}`);
