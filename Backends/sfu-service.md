# SFU Service API Dokümantasyonu

**Port:** 3007  
**Base URL:** `http://localhost/api/v1` (Traefik)  
**Direct URL:** `http://localhost:3007`  
**Swagger:** `http://localhost:3007/swagger`

> **Not:** Voice endpoint'leri Traefik üzerinden `/api/v1/channels/:channelId/voice/*` pattern'i ile erişilir.

## Genel Bilgi

SFU (Selective Forwarding Unit) Service, sesli ve görüntülü sohbet özelliklerini yönetir. WebRTC tabanlı medya streaming sağlar.

---

## Endpoints

### 🏥 Health Check

#### `GET /health`

```json
{
  "status": "ok",
  "service": "sfu-service"
}
```

---

### 🎙️ Voice Session Management

#### `POST /api/v1/channels/:channelId/voice/join`

Sesli kanala katılır ve session oluşturur.

**Direct:** `POST /channels/:channelId/voice/join`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "sessionId": "507f1f77bcf86cd799439018",
  "success": true
}
```

**İşlem:**
- Eğer kanal için session yoksa yeni session oluşturur
- Kullanıcıyı participant olarak ekler
- Session ID döner

---

#### `PATCH /api/v1/channels/:channelId/voice/@me`

Kendi ses/video ayarlarını günceller.

**Direct:** `PATCH /channels/:channelId/voice/@me`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "muted": false,
  "deafened": false,
  "video": true,
  "screenshare": false
}
```

**Fields (Tümü Opsiyonel):**
- `muted`: Mikrofon kapalı mı?
- `deafened`: Ses kapalı mı?
- `video`: Kamera açık mı?
- `screenshare`: Ekran paylaşımı aktif mi?

**Response:**
```json
{
  "success": true
}
```

---

#### `DELETE /api/v1/channels/:channelId/voice/@me`

Sesli kanaldan ayrılır.

**Direct:** `DELETE /channels/:channelId/voice/@me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

**İşlem:**
- Kullanıcıyı participant listesinden çıkarır
- WebRTC connection'ları temizler

---

#### `GET /api/v1/channels/:channelId/voice/participants`

Sesli kanaldaki katılımcıları listeler.

**Direct:** `GET /channels/:channelId/voice/participants`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439019",
    "sessionId": "507f1f77bcf86cd799439018",
    "userId": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "avatarUrl": "https://cdn.example.com/avatar.png"
    },
    "muted": false,
    "deafened": false,
    "video": true,
    "screenshare": false
  }
]
```

---

## WebRTC Signaling

### Connection Flow

1. **Join**: `POST /channels/:channelId/voice/join` - Session oluştur
2. **Get Participants**: `GET /channels/:channelId/voice/participants` - Diğer kullanıcıları al
3. **WebRTC Offer**: Client WebRTC offer oluşturur
4. **Signal**: WebSocket üzerinden signaling mesajları değişilir
5. **ICE Candidates**: ICE candidate'ler exchange edilir
6. **Media Stream**: Peer-to-peer veya SFU üzerinden medya stream'i başlar

### Signaling Events (WebSocket)

#### `voice.user_joined`

```json
{
  "event": "voice.user_joined",
  "data": {
    "channelId": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439012",
    "participant": {
      "muted": false,
      "video": false
    }
  }
}
```

#### `voice.user_left`

```json
{
  "event": "voice.user_left",
  "data": {
    "channelId": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439012"
  }
}
```

#### `voice.state_update`

```json
{
  "event": "voice.state_update",
  "data": {
    "channelId": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439012",
    "muted": true,
    "video": false
  }
}
```

---

## Data Models

### VoiceSession
```typescript
{
  _id: ObjectId,
  channelId: ObjectId,
  guildId: ObjectId,
  routerId: string,       // SFU router ID
  createdAt: Date
}
```

### VoiceParticipant
```typescript
{
  _id: ObjectId,
  sessionId: ObjectId,
  userId: ObjectId,
  muted: boolean,
  deafened: boolean,
  video: boolean,
  screenshare: boolean,
  joinedAt: Date
}
```

---

## Architecture

### SFU (Selective Forwarding Unit)

- **Client → SFU**: Her client medya stream'ini SFU'ya gönderir
- **SFU → Clients**: SFU stream'i diğer participant'lara forward eder
- **Avantajlar**: 
  - Düşük client-side CPU kullanımı
  - Bandwidth optimizasyonu
  - Merkezi kontrol

### Codec Support

- **Audio**: Opus
- **Video**: VP8, VP9, H.264
- **Screen Share**: VP8 (high resolution)

---

## Notlar

- WebRTC signaling WebSocket Gateway üzerinden yapılır
- Medya stream'leri peer-to-peer veya SFU üzerinden
- Session her kanal için benzersizdir
- Participant durumu real-time olarak broadcast edilir
- Production'da TURN server gereklidir (NAT traversal için)
- Maksimum participant sayısı SFU kapasitesine bağlıdır

---

## Future Enhancements

- [ ] Screen sharing ile simulcast
- [ ] Recording support
- [ ] Noise suppression
- [ ] Echo cancellation
- [ ] Video quality adaptation (bitrate)
- [ ] E2E encryption
