# Message Service API Dokümantasyonu

**Port:** 3004  
**Base URL:** `http://localhost:3004`  
**Swagger:** `http://localhost:3004/swagger`

## Genel Bilgi

Message Service, mesajlaşma, reaction'lar, DM kanalları ve typing indicator gibi özellikleri yönetir. RabbitMQ ile event-driven architecture kullanır.

---

## Endpoints

### 🏥 Health Check

#### `GET /health`

```json
{ "status": "ok", "service": "message-service" }
```

---

### 💬 Messages

#### `GET /channels/:channelId/messages`

Kanaldaki mesajları getirir (pagination ile).

**Query Parameters:**
- `limit` (optional): Mesaj sayısı (default: 50)
- `before` (optional): Bu ID'den önceki mesajlar

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "channelId": "507f1f77bcf86cd799439013",
    "authorId": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "avatarUrl": "https://cdn.example.com/avatar.png"
    },
    "content": "Hello world!",
    "edited": false,
    "createdAt": "2026-02-16T12:00:00.000Z"
  }
]
```

#### `POST /channels/:channelId/messages`

Yeni mesaj gönderir.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "content": "Hello world!",
  "replyToId": "507f1f77bcf86cd799439014"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "channelId": "507f1f77bcf86cd799439013",
  "authorId": "507f1f77bcf86cd799439012",
  "content": "Hello world!",
  "replyToId": "507f1f77bcf86cd799439014",
  "createdAt": "2026-02-16T12:00:00.000Z"
}
```

**Event:** `message.create` event'i RabbitMQ üzerinden broadcast edilir.

#### `PATCH /channels/:channelId/messages/:messageId`

Mesajı düzenler.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "content": "Updated message content"
}
```

**Event:** `message.update`

#### `DELETE /channels/:channelId/messages/:messageId`

Mesajı siler.

**Headers:** `Authorization: Bearer <token>`

**Event:** `message.delete`

---

### 😀 Reactions

#### `PUT /channels/:channelId/messages/:messageId/reactions/:emoji/@me`

Mesaja reaction ekler.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `emoji`: URL-encoded emoji (örn: `%F0%9F%91%8D` for 👍)

**Response:**
```json
{
  "success": true
}
```

#### `DELETE /channels/:channelId/messages/:messageId/reactions/:emoji/@me`

Reaction'ı kaldırır.

---

### ✍️ Typing Indicator

#### `POST /channels/:channelId/typing`

Typing indicator başlatır (10 saniye geçerli).

**Headers:** `Authorization: Bearer <token>`

**Event:** `typing.start` event'i broadcast edilir.

---

### 📨 DM Channels

#### `GET /users/@me/channels`

Kullanıcının DM kanallarını getirir.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439016",
    "type": "dm",
    "createdAt": "2026-02-15T10:00:00.000Z"
  }
]
```

#### `POST /users/@me/channels`

Yeni DM kanalı oluşturur.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "recipientId": "507f1f77bcf86cd799439017"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "type": "dm"
}
```

---

### 🔍 Search

#### `GET /channels/:channelId/messages/search`

Kanaldaki mesajlarda arama yapar.

**Query Parameters:**
- `q`: Arama terimi

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "content": "Search result message",
    "authorId": "507f1f77bcf86cd799439012"
  }
]
```

**Not:** Production'da Elasticsearch entegrasyonu önerilir.

---

## RabbitMQ Events

Message Service aşağıdaki event'leri publish eder:

| Event | Açıklama | Data |
|-------|----------|------|
| `message.create` | Yeni mesaj | `{ channelId, message }` |
| `message.update` | Mesaj güncelleme | `{ message }` |
| `message.delete` | Mesaj silme | `{ messageId }` |
| `typing.start` | Yazıyor göstergesi | `{ channelId, userId }` |

---

## Notlar

- Mesajlar MongoDB'de saklanır
- Typing indicator Redis'te 10 saniye saklanır
- RabbitMQ ile gerçek zamanlı event broadcasting
- Pagination reverse chronological order (en yeni önce)
- Reply mesajlar `replyToId` ile referans edilir
