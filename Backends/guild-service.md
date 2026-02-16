# Guild Service API Dokümantasyonu

**Port:** 3003  
**Base URL:** `http://localhost:3003`  
**Swagger:** `http://localhost:3003/swagger`

## Genel Bilgi

Guild Service, sunucular (guilds), kanallar, roller ve davetler gibi sunucu yönetimi özelliklerini sağlar.

---

## Endpoints

### 🏥 Health Check

#### `GET /health`

```json
{ "status": "ok", "service": "guild-service" }
```

---

### 🏰 Guild Management

#### `GET /guilds`

Kullanıcının üyesi olduğu tüm sunucuları getirir.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "My Server",
    "description": "Cool server",
    "ownerId": "507f1f77bcf86cd799439012",
    "iconUrl": "https://cdn.example.com/icon.png"
  }
]
```

#### `POST /guilds`

Yeni sunucu oluşturur.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "New Server",
  "description": "Server description"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "New Server",
  "description": "Server description",
  "ownerId": "507f1f77bcf86cd799439012"
}
```

#### `GET /guilds/:guildId`

Belirli bir sunucunun detaylarını getirir.

#### `PATCH /guilds/:guildId`

Sunucu ayarlarını günceller.

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### `DELETE /guilds/:guildId`

Sunucuyu siler.

---

### 📺 Channel Management

#### `GET /guilds/:guildId/channels`

Sunucudaki tüm kanalları getirir.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "guildId": "507f1f77bcf86cd799439011",
    "name": "general",
    "type": "text",
    "position": 0
  }
]
```

#### `POST /guilds/:guildId/channels`

Yeni kanal oluşturur.

**Request:**
```json
{
  "name": "new-channel",
  "type": "text"
}
```

**Type Options:**
- `text`: Metin kanalı
- `voice`: Ses kanalı
- `category`: Kategori

#### `PATCH /guilds/:guildId/channels/:channelId`

Kanal ayarlarını günceller.

**Request:**
```json
{
  "name": "updated-channel",
  "topic": "Channel topic"
}
```

#### `DELETE /guilds/:guildId/channels/:channelId`

Kanalı siler.

---

### 🎭 Role Management

#### `GET /guilds/:guildId/roles`

Sunucudaki tüm rolleri getirir.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "guildId": "507f1f77bcf86cd799439011",
    "name": "Admin",
    "color": "#FF0000",
    "position": 1,
    "permissions": ["ADMINISTRATOR"]
  }
]
```

#### `POST /guilds/:guildId/roles`

Yeni rol oluşturur.

**Request:**
```json
{
  "name": "Moderator",
  "color": "#00FF00"
}
```

---

### 👥 Member Management

#### `GET /guilds/:guildId/members`

Sunucu üyelerini getirir.

---

### 🎫 Invite Management

#### `GET /guilds/:guildId/invites`

Sunucunun davet linklerini getirir.

#### `POST /guilds/:guildId/invites`

Yeni davet linki oluşturur.

**Request:**
```json
{
  "channelId": "507f1f77bcf86cd799439013",
  "maxUses": 10
}
```

**Response:**
```json
{
  "code": "abc123",
  "guildId": "507f1f77bcf86cd799439011",
  "channelId": "507f1f77bcf86cd799439013",
  "maxUses": 10,
  "uses": 0
}
```

#### `POST /invites/:code`

Davet kodunu kullanarak sunucuya katılır.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "guildId": "507f1f77bcf86cd799439011"
}
```

---

## Notlar

- Tüm endpoint'ler authentication gerektirir
- Kanal tipleri: text, voice, category
- Roller hiyerarşik pozisyona göre sıralanır
- Davetlere kullanım limiti konulabilir
