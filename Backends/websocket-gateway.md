# WebSocket Gateway API Dokümantasyonu

**Port:** 3005 (WebSocket), 3006 (HTTP)  
**WebSocket URL:** `ws://localhost:3005`  
**HTTP URL:** `http://localhost:3006`  
**Swagger:** `http://localhost:3006/swagger`

## Genel Bilgi

WebSocket Gateway, gerçek zamanlı event'leri client'lara iletir. RabbitMQ'dan event'leri dinler ve Redis Pub/Sub ile çoklu gateway instance'ları arasında senkronizasyon sağlar.

---

## WebSocket Connection

### Connection

```javascript
const ws = new WebSocket('ws://localhost:3005');

ws.onopen = () => {
  // Identify (kimlik doğrulama)
  ws.send(JSON.stringify({
    op: 'IDENTIFY',
    data: {
      token: 'your-jwt-token'
    }
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Event received:', message);
};
```

---

## WebSocket Operations

### Client → Server

#### `IDENTIFY`

WebSocket bağlantısını authenticate eder.

**Payload:**
```json
{
  "op": "IDENTIFY",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response:**
```json
{
  "op": "READY",
  "data": {
    "userId": "507f1f77bcf86cd799439012",
    "guilds": ["507f1f77bcf86cd799439011"]
  }
}
```

#### `HEARTBEAT`

Keep-alive ping gönderir.

**Payload:**
```json
{
  "op": "HEARTBEAT",
  "data": null
}
```

**Response:**
```json
{
  "op": "HEARTBEAT_ACK",
  "data": null
}
```

#### `GUILD_SUBSCRIBE`

Belirli bir guild'in event'lerine abone olur.

**Payload:**
```json
{
  "op": "GUILD_SUBSCRIBE",
  "data": {
    "guildId": "507f1f77bcf86cd799439011"
  }
}
```

#### `GUILD_UNSUBSCRIBE`

Guild aboneliğini iptal eder.

**Payload:**
```json
{
  "op": "GUILD_UNSUBSCRIBE",
  "data": {
    "guildId": "507f1f77bcf86cd799439011"
  }
}
```

---

## Server → Client Events

### Message Events

#### `message.create`

Yeni mesaj oluşturuldu.

**Payload:**
```json
{
  "event": "message.create",
  "data": {
    "channelId": "507f1f77bcf86cd799439013",
    "message": {
      "_id": "507f1f77bcf86cd799439015",
      "authorId": "507f1f77bcf86cd799439012",
      "content": "Hello!",
      "createdAt": "2026-02-16T12:00:00.000Z"
    }
  }
}
```

#### `message.update`

Mesaj güncellendi.

```json
{
  "event": "message.update",
  "data": {
    "message": {
      "_id": "507f1f77bcf86cd799439015",
      "content": "Updated content",
      "edited": true
    }
  }
}
```

#### `message.delete`

Mesaj silindi.

```json
{
  "event": "message.delete",
  "data": {
    "messageId": "507f1f77bcf86cd799439015"
  }
}
```

---

### Presence Events

#### `presence.update`

Kullanıcının online durumu değişti.

```json
{
  "event": "presence.update",
  "data": {
    "userId": "507f1f77bcf86cd799439012",
    "status": "online",
    "customStatus": "Playing games"
  }
}
```

---

### Typing Events

#### `typing.start`

Kullanıcı yazıyor.

```json
{
  "event": "typing.start",
  "data": {
    "channelId": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439012"
  }
}
```

---

### Guild Events

#### `guild.create`

Yeni guild oluşturuldu veya kullanıcı guild'e katıldı.

```json
{
  "event": "guild.create",
  "data": {
    "guild": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "My Server"
    }
  }
}
```

#### `guild.update`

Guild güncellendi.

#### `guild.delete`

Guild silindi.

---

### Channel Events

#### `channel.create`

Yeni kanal oluşturuldu.

#### `channel.update`

Kanal güncellendi.

#### `channel.delete`

Kanal silindi.

---

## HTTP Endpoints

### 🏥 Health Check

#### `GET /health`

```json
{
  "status": "ok",
  "service": "websocket-gateway",
  "connections": 42,
  "guilds": 10
}
```

---

## Architecture

### Event Flow

1. **Service → RabbitMQ**: Servisler event'leri RabbitMQ'ya publish eder
2. **RabbitMQ → Gateway**: Gateway RabbitMQ'dan event'leri consume eder
3. **Gateway → Redis**: Gateway event'i Redis Pub/Sub'a publish eder
4. **Redis → All Gateways**: Tüm gateway instance'ları event'i alır
5. **Gateway → Clients**: Gateway event'i WebSocket üzerinden client'lara gönderir

### Scaling

- Multiple gateway instance'ları load balancer arkasında çalışabilir
- Redis Pub/Sub ile instance'lar arası senkronizasyon
- RabbitMQ queue'ları otomatik olarak instance'lara distribute edilir

---

## Connection Management

- Her kullanıcı birden fazla WebSocket bağlantısı açabilir (farklı cihazlar)
- Connection'lar `clients` Map'inde tutulur: `userId → Set<WebSocket>`
- Guild subscriptions tutulur: `guildId → Set<userId>`
- Heartbeat ile connection durumu kontrol edilir

---

## Notlar

- WebSocket bağlantısı için JWT token authentication gereklidir
- Heartbeat her 30 saniyede bir gönderilmelidir
- Connection timeout: 60 saniye (heartbeat yoksa)
- Guild subscribe olmadan o guild'in event'lerini alamazsınız
- Event'ler JSON formatında gönderilir
