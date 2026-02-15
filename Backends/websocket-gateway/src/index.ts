import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import Redis from 'ioredis';
import amqp from 'amqplib';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = parseInt(process.env.WEBSOCKET_PORT || '3005');

// Redis for pub/sub across multiple gateway instances
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || 'discord_redis_pass',
});

const redisSub = redis.duplicate();

// WebSocket clients map: userId -> WebSocket[]
const clients = new Map<string, Set<WebSocket>>();

// Guild subscriptions: guildId -> Set<userId>
const guildSubscriptions = new Map<string, Set<string>>();

// RabbitMQ consumer
let rabbitChannel: amqp.Channel;
async function setupRabbitMQ() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://discord_user:discord_pass@localhost:5672');
    rabbitChannel = await conn.createChannel();
    await rabbitChannel.assertExchange('discord_events', 'topic', { durable: true });
    
    const q = await rabbitChannel.assertQueue('', { exclusive: true });
    
    // Subscribe to all events
    await rabbitChannel.bindQueue(q.queue, 'discord_events', '#');
    
    rabbitChannel.consume(q.queue, (msg) => {
      if (msg) {
        const event = msg.fields.routingKey;
        const data = JSON.parse(msg.content.toString());
        handleEvent(event, data);
        rabbitChannel.ack(msg);
      }
    });
    
    console.log('✅ RabbitMQ consumer started');
  } catch (err) {
    console.error('⚠️ RabbitMQ connection failed:', err);
  }
}

// Handle events from RabbitMQ
function handleEvent(event: string, data: any) {
  // Broadcast to Redis for other gateway instances
  redis.publish('gateway_events', JSON.stringify({ event, data }));
  
  // Broadcast to local clients
  broadcastToClients(event, data);
}

// Redis subscriber for events from other gateway instances
redisSub.subscribe('gateway_events', (err) => {
  if (err) console.error('Redis subscribe error:', err);
});

redisSub.on('message', (channel, message) => {
  if (channel === 'gateway_events') {
    const { event, data } = JSON.parse(message);
    broadcastToClients(event, data);
  }
});

// Broadcast to local WebSocket clients
function broadcastToClients(event: string, data: any) {
  const payload = JSON.stringify({ event, data });
  
  // Determine target users based on event type
  if (event.startsWith('message.')) {
    const channelId = data.channelId;
    // Broadcast to all users in the guild/channel (simplified)
    clients.forEach((sockets) => {
      sockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      });
    });
  } else if (event === 'presence.update') {
    // Broadcast to friends of the user
    const userId = data.userId;
    clients.forEach((sockets) => {
      sockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      });
    });
  } else {
    // Broadcast to all
    clients.forEach((sockets) => {
      sockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      });
    });
  }
}

// WebSocket server
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws: WebSocket, req) => {
  let userId: string | null = null;
  let heartbeatInterval: Timer;
  
  console.log('Client connected');
  
  // Send ready event
  ws.send(JSON.stringify({ event: 'ready', data: { message: 'Connected to Discord Gateway' } }));
  
  // Heartbeat
  heartbeatInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event: 'heartbeat', data: {} }));
    }
  }, 30000);
  
  ws.on('message', (message: Buffer) => {
    try {
      const payload = JSON.parse(message.toString());
      
      // Handle client messages
      switch (payload.event) {
        case 'identify':
          userId = payload.data.userId;
          if (!clients.has(userId)) {
            clients.set(userId, new Set());
          }
          clients.get(userId)!.add(ws);
          
          // Subscribe to guilds
          if (payload.data.guildIds) {
            payload.data.guildIds.forEach((guildId: string) => {
              if (!guildSubscriptions.has(guildId)) {
                guildSubscriptions.set(guildId, new Set());
              }
              guildSubscriptions.get(guildId)!.add(userId);
            });
          }
          
          ws.send(JSON.stringify({ event: 'identified', data: { userId } }));
          break;
          
        case 'heartbeat_ack':
          // Client acknowledged heartbeat
          break;
          
        case 'guild_subscribe':
          if (userId && payload.data.guildId) {
            const guildId = payload.data.guildId;
            if (!guildSubscriptions.has(guildId)) {
              guildSubscriptions.set(guildId, new Set());
            }
            guildSubscriptions.get(guildId)!.add(userId);
          }
          break;
          
        case 'guild_unsubscribe':
          if (userId && payload.data.guildId) {
            const guildId = payload.data.guildId;
            guildSubscriptions.get(guildId)?.delete(userId);
          }
          break;
      }
    } catch (err) {
      console.error('Message parse error:', err);
    }
  });
  
  ws.on('close', () => {
    clearInterval(heartbeatInterval);
    if (userId) {
      const userSockets = clients.get(userId);
      if (userSockets) {
        userSockets.delete(ws);
        if (userSockets.size === 0) {
          clients.delete(userId);
        }
      }
      
      // Remove from guild subscriptions
      guildSubscriptions.forEach((users) => {
        users.delete(userId!);
      });
    }
    console.log('Client disconnected');
  });
  
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

// HTTP server for health checks
const app = new Elysia()
  .use(cors())
  .use(swagger({ documentation: { info: { title: 'WebSocket Gateway API', version: '1.0.0' } } }))
  .get('/health', () => ({ 
    status: 'ok', 
    service: 'websocket-gateway',
    connections: clients.size,
    guilds: guildSubscriptions.size 
  }))
  .get('/stats', () => ({
    connectedUsers: clients.size,
    totalConnections: Array.from(clients.values()).reduce((sum, set) => sum + set.size, 0),
    guildSubscriptions: guildSubscriptions.size,
  }))
  .listen(PORT + 1);

console.log(`🦊 WebSocket Gateway running on ws://localhost:${PORT}`);
console.log(`🦊 HTTP API running at http://${app.server?.hostname}:${app.server?.port}`);

setupRabbitMQ();
