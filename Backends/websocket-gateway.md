# WebSocket Gateway Documentation

**WebSocket URL**: `ws://localhost:3005`  
**HTTP API**: `http://localhost:3006` (Port 3006 for health/stats)

WebSocket Gateway provides real-time event broadcasting to connected clients.

## Client Connection Flow

1. Connect to `ws://localhost:3005`
2. Receive `ready` event
3. Send `identify` event with userId and guildIds
4. Receive `identified` confirmation
5. Start receiving events
6. Respond to `heartbeat` with `heartbeat_ack` (every 30s)

## Client → Server Events

```json
// Identify
{
  "event": "identify",
  "data": {
    "userId": "user_id",
    "token": "jwt_token",
    "guildIds": ["guild1", "guild2"]
  }
}

// Heartbeat ACK
{
  "event": "heartbeat_ack",
  "data": {}
}

// Guild Subscribe
{
  "event": "guild_subscribe",
  "data": {
    "guildId": "guild_id"
  }
}

// Guild Unsubscribe
{
  "event": "guild_unsubscribe",
  "data": {
    "guildId": "guild_id"
  }
}
```

## Server → Client Events

### Connection Events
- `ready` - Connection established
- `identified` - User identified successfully
- `heartbeat` - Server heartbeat (every 30s)

### Message Events
- `message.create` - New message sent
- `message.update` - Message edited
- `message.delete` - Message deleted
- `typing.start` - User started typing

### Presence Events
- `presence.update` - User status changed
- `user.update` - User profile updated

### Guild Events
- `guild.create` - Guild created/joined
- `guild.update` - Guild settings changed
- `guild.delete` - Guild deleted/left
- `channel.create` - Channel created
- `channel.update` - Channel updated
- `channel.delete` - Channel deleted
- `guild_member.add` - Member joined
- `guild_member.remove` - Member left

### Voice Events
- `voice.state.update` - User voice state changed
- `voice.server.update` - Voice server updated

## HTTP Endpoints

- `GET /health` - Service health check with connection stats
- `GET /stats` - Detailed statistics

## Architecture

### Multi-Instance Support
- Redis pub/sub for event broadcasting across gateway instances
- Horizontal scaling with load balancer (sticky sessions recommended)

### Event Sources
- RabbitMQ consumer subscribed to `discord_events` exchange
- All microservices publish events to RabbitMQ
- Gateway broadcasts to WebSocket clients

### Connection Management
- Heartbeat every 30 seconds
- Automatic reconnection handling (client-side)
- Guild-based subscriptions for efficient broadcasting
- Multiple connections per user (mobile + desktop)

## Redis Keys

- `gateway_events` - Pub/Sub channel for inter-gateway communication

## Client Libraries

Recommended to create client SDK with:
- Auto-reconnection
- Heartbeat handling
- Event emitters
- Connection state management
