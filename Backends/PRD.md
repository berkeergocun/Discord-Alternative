# Discord Alternative Platform - Product Requirements Document (PRD)

## 1. Proje Özeti

### 1.1 Vizyon
Modern, ölçeklenebilir ve dağıtık bir gerçek zamanlı iletişim platformu geliştirmek. Platform, metin tabanlı sohbet, sesli/görüntülü aramalar, ekran paylaşımı ve topluluk yönetimi özelliklerini mikroservis mimarisi ile sunacaktır.

### 1.2 Misyon
Kullanıcılara Discord'a alternatif, açık kaynaklı ve özelleştirilebilir bir iletişim platformu sunmak. Geliştiricilere ise modern backend mimarisi ve ölçeklenebilir sistem tasarımı konusunda referans bir proje sağlamak.

### 1.3 Proje Hedefleri
- **Ölçeklenebilirlik**: Mikroservis mimarisi ile yatay ölçekleme
- **Performans**: Düşük gecikme süreli gerçek zamanlı iletişim
- **Güvenilirlik**: %99.9 uptime hedefi
- **Güvenlik**: JWT tabanlı kimlik doğrulama ve RBAC yetkilendirme
- **Genişletilebilirlik**: Modüler yapı ile yeni özellik ekleme kolaylığı

---

## 2. Hedef Kullanıcılar

### 2.1 Birincil Kullanıcılar
- **Oyuncular**: Oyun topluluklarını yönetmek isteyen kullanıcılar
- **Topluluk Yöneticileri**: Discord benzeri topluluk platformu arayan moderatörler
- **Geliştiriciler**: Açık kaynaklı iletişim platformu arayan yazılım ekipleri

### 2.2 İkincil Kullanıcılar
- **Öğrenciler**: Ders çalışma grupları için platform arayan öğrenciler
- **Küçük İşletmeler**: Dahili iletişim için alternatif arayan şirketler
- **Hobiciler**: Kendi topluluk platformlarını host etmek isteyen kullanıcılar

---

## 3. Temel Özellikler (Core Features)

### 3.1 Kimlik Doğrulama ve Yetkilendirme
- **JWT Authentication**: Access token ve refresh token mekanizması
- **Email/Password**: Geleneksel email/şifre ile kayıt ve giriş
- **OAuth2**: Google, GitHub, Discord ile sosyal giriş
- **2FA (Two-Factor Authentication)**: İki faktörlü kimlik doğrulama desteği
- **Session Management**: Redis tabanlı oturum yönetimi
- **Rate Limiting**: API istekleri için hız sınırlaması

### 3.2 Kullanıcı Yönetimi
- **Profil Yönetimi**:
  - Avatar yükleme (AWS S3)
  - Durum mesajları (custom status)
  - Biyografi ve kullanıcı bilgileri
  - Kullanıcı ayarları (tema, bildirimler, gizlilik)
  
- **Arkadaşlık Sistemi**:
  - Arkadaş ekleme/çıkarma
  - Arkadaşlık istekleri (pending, accepted, rejected)
  - Engelleme sistemi (block/unblock)
  - Arkadaş listesi ve online durumu

- **Kullanıcı Durumu (Presence)**:
  - Online / Offline / Away / DND (Do Not Disturb)
  - Custom status mesajları
  - Gerçek zamanlı durum güncellemeleri
  - "Typing" indikatörü

### 3.3 Sunucu (Guild) Yönetimi
- **Sunucu Oluşturma ve Yönetimi**:
  - Sunucu oluşturma (isim, açıklama, ikon)
  - Sunucu ayarları (bölge, gizlilik, doğrulama seviyesi)
  - Sunucu silme ve transfer
  - Sunucu davet linkleri (süreli/süresiz)
  - Vanity URL desteği

- **Kanal Yönetimi**:
  - Metin kanalları (text channels)
  - Sesli kanalları (voice channels)
  - Kategori sistemi (channel grouping)
  - Kanal izinleri (per-channel permissions)
  - Kanal konuları ve açıklamaları
  - NSFW kanal işaretleme
  - Kanal sıralama (drag-and-drop)

- **Rol Tabanlı Erişim Kontrolü (RBAC)**:
  - Rol oluşturma ve düzenleme
  - Hiyerarşik rol sistemi
  - Detaylı izin sistemi (40+ izin)
  - Rol renkleri ve görünürlük
  - Varsayılan roller (@everyone)
  - Rol ataması ve yönetimi

- **Üye Yönetimi**:
  - Üye davet etme
  - Üye kick/ban
  - Ban listesi yönetimi
  - Üye rolleri atama
  - Üye arama ve filtreleme

### 3.4 Mesajlaşma Sistemi
- **Gerçek Zamanlı Mesajlaşma**:
  - Anlık mesaj gönderme ve alma
  - Mesaj düzenleme ve silme
  - Mesaj tepkileri (reactions/emojis)
  - Mesaj sabitleme (pinning)
  - Mesaj yanıtlama (reply/thread)
  - Mesaj bahsetme (@mentions)
  - Rol ve everyone/here mentions
  
- **Medya Paylaşımı**:
  - Dosya yükleme (AWS S3)
  - Resim/video önizleme
  - Link önizleme (embeds)
  - Desteklenen formatlar: PNG, JPG, GIF, MP4, PDF, ZIP
  - Maksimum dosya boyutu: 8MB (standart), 100MB (premium)

- **Mesaj Formatı**:
  - Markdown desteği
  - Kod blokları (syntax highlighting)
  - Spoiler etiketleri
  - Emoji ve custom emoji desteği

- **Direkt Mesajlar (DM)**:
  - Birebir DM kanalları
  - Grup DM (maksimum 10 kişi)
  - DM geçmişi
  - DM kapatma/açma

- **Mesaj Geçmişi**:
  - Sayfalı mesaj yükleme (pagination)
  - Mesaj arama (full-text search)
  - Mesaj filtreleme (by user, date, has:file)
  - Mesaj export (JSON, CSV)

### 3.5 Sesli ve Görüntülü İletişim
- **Voice Channels**:
  - Sesli kanala katılma/ayrılma
  - Push-to-talk (PTT) desteği
  - Mikrofon susturma (mute/unmute)
  - Hoparlör sessize alma (deafen)
  - Ses kalitesi ayarları
  - Voice activity detection

- **Video Call**:
  - Webcam paylaşımı
  - Video kalitesi ayarları (480p, 720p, 1080p)
  - Kamera açma/kapatma
  - Video layout seçenekleri

- **Screen Sharing**:
  - Tam ekran paylaşımı
  - Uygulama penceresi paylaşımı
  - Çözünürlük seçimi
  - Ses paylaşımı desteği

- **WebRTC Özellikleri**:
  - Mediasoup SFU kullanımı
  - Simulcast desteği
  - E2E encryption (optional)
  - Network adaptasyon
  - Jitter buffer

### 3.6 Bildirim Sistemi
- **Push Notifications**:
  - Mentions için bildirim
  - DM için bildirim
  - Sunucu olayları için bildirim
  - Özelleştirilebilir bildirim ayarları

- **Email Notifications**:
  - Önemli olaylar için email
  - Digest emails (günlük/haftalık özet)
  - Email tercih yönetimi

- **In-App Notifications**:
  - Bildirim merkezi
  - Okunmamış sayaçları
  - Toast notifications

### 3.7 Arama ve Keşif
- **Global Arama**:
  - Mesaj arama
  - Kullanıcı arama
  - Sunucu arama
  - Gelişmiş arama filtreleri

- **Sunucu Keşfi**:
  - Public sunucu listesi
  - Kategori bazlı keşif
  - Trend olan sunucular
  - Arama ve filtreleme

---

## 4. Sistem Mimarisi

### 4.1 Genel Mimari Yaklaşım
**Mikroservis Mimarisi**: Platform, bağımsız olarak deploy edilebilen ve ölçeklenebilen mikroservislerden oluşacaktır.

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Layer                            │
│  (Web, Mobile, Desktop Apps)                                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway (Traefik)                        │
│  - Load Balancing  - Rate Limiting  - SSL Termination           │
└────────┬──────────────────────────┬─────────────────────────────┘
         │                          │
         ▼                          ▼
┌────────────────────┐    ┌─────────────────────────┐
│  HTTP Services     │    │  WebSocket Gateway      │
│  (REST/gRPC)       │    │  (Socket.IO)            │
└─────┬──────────────┘    └──────────┬──────────────┘
      │                               │
      ├───────────┬───────────┬───────┴────────┬──────────┐
      ▼           ▼           ▼                ▼          ▼
┌──────────┐ ┌─────────┐ ┌────────┐ ┌────────────┐ ┌──────────┐
│   Auth   │ │  User   │ │ Guild  │ │  Message   │ │   SFU    │
│ Service  │ │ Service │ │Service │ │  Service   │ │ (Media)  │
└────┬─────┘ └────┬────┘ └───┬────┘ └─────┬──────┘ └────┬─────┘
     │            │           │            │             │
     └────────────┴───────────┴────────────┴─────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
     ┌─────────┐        ┌──────────┐       ┌──────────┐
     │ RabbitMQ│        │  Redis   │       │PostgreSQL│
     │ Message │        │  Cache   │       │ Database │
     │  Queue  │        │ Sessions │       │          │
     └─────────┘        └──────────┘       └──────────┘
                              │
                              ▼
                        ┌──────────┐
                        │  AWS S3  │
                        │  Media   │
                        └──────────┘
```

### 4.2 Servis Detayları

#### 4.2.1 Auth Service (Kimlik Doğrulama Servisi)
**Sorumluluklar**:
- Kullanıcı kaydı ve girişi
- JWT token üretimi ve doğrulaması
- Refresh token yönetimi
- OAuth2 entegrasyonu
- 2FA yönetimi
- Session yönetimi

**Teknolojiler**:
- **Framework**: Bun.js + ElysiaJS
- **Database**: MongoDB (kullanıcı credentials)
- **Cache**: Redis (sessions, blacklisted tokens)
- **Libraries**: 
  - `@elysiajs/jwt` - JWT işlemleri
  - `@elysiajs/bearer` - Bearer token extraction
  - `bcrypt` - Şifre hashleme
  - `mongoose` - MongoDB ODM
  - `otplib` - 2FA token üretimi

**API Endpoints**:
```
POST   /auth/register                  - Yeni kullanıcı kaydı
POST   /auth/login                     - Kullanıcı girişi
POST   /auth/logout                    - Kullanıcı çıkışı
POST   /auth/refresh                   - Token yenileme
POST   /auth/verify-email              - Email doğrulama
POST   /auth/forgot-password           - Şifre sıfırlama isteği
POST   /auth/reset-password            - Şifre sıfırlama
POST   /auth/2fa/enable                - 2FA aktifleştirme
POST   /auth/2fa/verify                - 2FA doğrulama
GET    /auth/oauth/:provider           - OAuth redirect
POST   /auth/oauth/:provider/callback  - OAuth callback
```

**Database Schema (MongoDB)**:
```typescript
// users collection
interface UserDocument {
  _id: ObjectId;
  email: string; // indexed, unique
  username: string; // indexed, unique
  passwordHash: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

// oauthAccounts collection
interface OAuthAccountDocument {
  _id: ObjectId;
  userId: ObjectId; // ref to users
  provider: string; // 'google', 'github', 'discord'
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt: Date;
}

// refreshTokens collection
interface RefreshTokenDocument {
  _id: ObjectId;
  userId: ObjectId; // ref to users
  token: string; // indexed, unique
  expiresAt: Date; // TTL index
  createdAt: Date;
}
```

**gRPC Interface**:
```protobuf
service AuthService {
  rpc ValidateToken (ValidateTokenRequest) returns (ValidateTokenResponse);
  rpc GetUserFromToken (GetUserRequest) returns (UserResponse);
  rpc RevokeToken (RevokeTokenRequest) returns (RevokeTokenResponse);
}
```

#### 4.2.2 User Service (Kullanıcı Servisi)
**Sorumluluklar**:
- Kullanıcı profil yönetimi
- Arkadaşlık sistemi
- Kullanıcı durumu (presence)
- Engelleme sistemi
- Kullanıcı ayarları

**Teknolojiler**:
- **Framework**: Bun.js + ElysiaJS
- **Database**: MongoDB (kullanıcı verileri)
- **Cache**: Redis (online users, presence)
- **Storage**: AWS S3 (avatarlar)

**API Endpoints**:
```
GET    /users/@me                      - Kendi profilim
PATCH  /users/@me                      - Profil güncelleme
GET    /users/:userId                  - Kullanıcı profili
PATCH  /users/@me/settings             - Ayarlar güncelleme

GET    /users/@me/friends              - Arkadaş listesi
POST   /users/:userId/friend-request   - Arkadaş isteği gönder
PUT    /users/@me/friend-requests/:id  - İsteği kabul et
DELETE /users/@me/friends/:userId      - Arkadaşı kaldır

GET    /users/@me/blocked              - Engellenen kullanıcılar
POST   /users/:userId/block            - Kullanıcıyı engelle
DELETE /users/:userId/block            - Engeli kaldır

PATCH  /users/@me/presence             - Durum güncelleme
POST   /users/@me/avatar               - Avatar yükleme
```

**Database Schema (MongoDB)**:
```typescript
// userProfiles collection
interface UserProfileDocument {
  _id: ObjectId;
  userId: ObjectId; // ref to users
  displayName?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  status: 'online' | 'offline' | 'away' | 'dnd';
  customStatus?: string;
  updatedAt: Date;
}

// friendships collection
interface FriendshipDocument {
  _id: ObjectId;
  userId: ObjectId; // ref to users
  friendId: ObjectId; // ref to users
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
// compound index on (userId, friendId) - unique

// userBlocks collection
interface UserBlockDocument {
  _id: ObjectId;
  userId: ObjectId; // ref to users
  blockedUserId: ObjectId; // ref to users
  createdAt: Date;
}
// compound index on (userId, blockedUserId) - unique

// userSettings collection
interface UserSettingsDocument {
  _id: ObjectId;
  userId: ObjectId; // ref to users, unique
  theme: 'dark' | 'light';
  locale: string;
  notificationSettings: Record<string, any>;
  privacySettings: Record<string, any>;
  updatedAt: Date;
}
```

**gRPC Interface**:
```protobuf
service UserService {
  rpc GetUser (GetUserRequest) returns (UserResponse);
  rpc GetUsers (GetUsersRequest) returns (UsersResponse);
  rpc UpdateUserPresence (UpdatePresenceRequest) returns (Empty);
  rpc GetUserFriends (GetFriendsRequest) returns (FriendsResponse);
}
```

#### 4.2.3 Guild Service (Sunucu Servisi)
**Sorumluluklar**:
- Sunucu (guild) yönetimi
- Kanal yönetimi
- Rol ve izin sistemi (RBAC)
- Üye yönetimi
- Davet sistemi

**Teknolojiler**:
- **Framework**: Bun.js + ElysiaJS
- **Database**: MongoDB (sunucu verileri)
- **Cache**: Redis (izinler, roller)
- **Storage**: AWS S3 (sunucu ikonları)

**API Endpoints**:
```
GET    /guilds                         - Kullanıcının sunucuları
POST   /guilds                         - Sunucu oluştur
GET    /guilds/:guildId                - Sunucu detayı
PATCH  /guilds/:guildId                - Sunucu güncelle
DELETE /guilds/:guildId                - Sunucu sil

GET    /guilds/:guildId/channels       - Kanal listesi
POST   /guilds/:guildId/channels       - Kanal oluştur
PATCH  /guilds/:guildId/channels/:id   - Kanal güncelle
DELETE /guilds/:guildId/channels/:id   - Kanal sil

GET    /guilds/:guildId/roles          - Rol listesi
POST   /guilds/:guildId/roles          - Rol oluştur
PATCH  /guilds/:guildId/roles/:id      - Rol güncelle
DELETE /guilds/:guildId/roles/:id      - Rol sil

GET    /guilds/:guildId/members        - Üye listesi
POST   /guilds/:guildId/members        - Üye ekle
PATCH  /guilds/:guildId/members/:id    - Üye güncelle (rol ata)
DELETE /guilds/:guildId/members/:id    - Üyeyi çıkar

POST   /guilds/:guildId/bans           - Üyeyi banla
DELETE /guilds/:guildId/bans/:userId   - Ban kaldır
GET    /guilds/:guildId/bans           - Ban listesi

GET    /guilds/:guildId/invites        - Davet listesi
POST   /guilds/:guildId/invites        - Davet oluştur
DELETE /guilds/:guildId/invites/:code  - Daveti iptal et
POST   /invites/:code                  - Daveti kullan
```

**Database Schema**:
```sql
TABLE guilds (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(500),
  banner_url VARCHAR(500),
  owner_id UUID REFERENCES users(id),
  region VARCHAR(50) DEFAULT 'us-east',
  verification_level INTEGER DEFAULT 0,
  vanity_url_code VARCHAR(20) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

TABLE channels (
  id UUID PRIMARY KEY,
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES channels(id),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL, -- text, voice, category
  topic TEXT,
  position INTEGER DEFAULT 0,
  nsfw BOOLEAN DEFAULT false,
  rate_limit_per_user INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

TABLE roles (
  id UUID PRIMARY KEY,
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7), -- HEX color
  permissions BIGINT NOT NULL DEFAULT 0,
  position INTEGER DEFAULT 0,
  mentionable BOOLEAN DEFAULT true,
  hoist BOOLEAN DEFAULT false, -- Separate display
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

TABLE guild_members (
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nickname VARCHAR(32),
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (guild_id, user_id)
);

TABLE member_roles (
  guild_id UUID,
  user_id UUID,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (guild_id, user_id) REFERENCES guild_members(guild_id, user_id),
  PRIMARY KEY (guild_id, user_id, role_id)
);

TABLE guild_bans (
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  reason TEXT,
  banned_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (guild_id, user_id)
);

TABLE invites (
  code VARCHAR(10) PRIMARY KEY,
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id),
  inviter_id UUID REFERENCES users(id),
  max_uses INTEGER DEFAULT 0, -- 0 = unlimited
  uses INTEGER DEFAULT 0,
  max_age INTEGER DEFAULT 86400, -- seconds, 0 = never expire
  temporary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

TABLE channel_permissions (
  id UUID PRIMARY KEY,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  allow BIGINT DEFAULT 0,
  deny BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Permission System**:
```typescript
enum Permission {
  CREATE_INSTANT_INVITE = 1 << 0,
  KICK_MEMBERS = 1 << 1,
  BAN_MEMBERS = 1 << 2,
  ADMINISTRATOR = 1 << 3,
  MANAGE_CHANNELS = 1 << 4,
  MANAGE_GUILD = 1 << 5,
  ADD_REACTIONS = 1 << 6,
  VIEW_AUDIT_LOG = 1 << 7,
  PRIORITY_SPEAKER = 1 << 8,
  STREAM = 1 << 9,
  VIEW_CHANNEL = 1 << 10,
  SEND_MESSAGES = 1 << 11,
  SEND_TTS_MESSAGES = 1 << 12,
  MANAGE_MESSAGES = 1 << 13,
  EMBED_LINKS = 1 << 14,
  ATTACH_FILES = 1 << 15,
  READ_MESSAGE_HISTORY = 1 << 16,
  MENTION_EVERYONE = 1 << 17,
  USE_EXTERNAL_EMOJIS = 1 << 18,
  CONNECT = 1 << 20,
  SPEAK = 1 << 21,
  MUTE_MEMBERS = 1 << 22,
  DEAFEN_MEMBERS = 1 << 23,
  MOVE_MEMBERS = 1 << 24,
  USE_VAD = 1 << 25,
  CHANGE_NICKNAME = 1 << 26,
  MANAGE_NICKNAMES = 1 << 27,
  MANAGE_ROLES = 1 << 28,
  MANAGE_WEBHOOKS = 1 << 29,
  MANAGE_EMOJIS = 1 << 30,
}
```

**gRPC Interface**:
```protobuf
service GuildService {
  rpc GetGuild (GetGuildRequest) returns (GuildResponse);
  rpc GetGuildChannels (GetChannelsRequest) returns (ChannelsResponse);
  rpc GetGuildMember (GetMemberRequest) returns (MemberResponse);
  rpc CheckPermission (CheckPermissionRequest) returns (PermissionResponse);
  rpc GetUserGuilds (GetUserGuildsRequest) returns (GuildsResponse);
}
```

#### 4.2.4 Message Service (Mesaj Servisi)
**Sorumluluklar**:
- Mesaj gönderme ve alma
- Mesaj düzenleme ve silme
- Mesaj reactions
- Dosya yükleme
- Mesaj arama
- DM channel yönetimi

**Teknolojiler**:
- **Framework**: Bun.js + ElysiaJS
- **Database**: MongoDB (mesajlar)
- **Search**: Elasticsearch (mesaj arama)
- **Cache**: Redis (son mesajlar)
- **Storage**: AWS S3 (dosya ekleri)

**API Endpoints**:
```
GET    /channels/:channelId/messages       - Mesaj listesi
POST   /channels/:channelId/messages       - Mesaj gönder
GET    /channels/:channelId/messages/:id   - Mesaj detayı
PATCH  /channels/:channelId/messages/:id   - Mesaj düzenle
DELETE /channels/:channelId/messages/:id   - Mesaj sil

POST   /channels/:channelId/messages/:id/reactions/:emoji  - Reaction ekle
DELETE /channels/:channelId/messages/:id/reactions/:emoji  - Reaction kaldır

POST   /channels/:channelId/typing         - Typing indicator
POST   /channels/:channelId/messages/:id/pin    - Mesaj sabitle
DELETE /channels/:channelId/messages/:id/pin    - Sabitlemeyi kaldır

POST   /channels/:channelId/attachments    - Dosya yükle
GET    /channels/:channelId/search         - Mesaj ara

GET    /users/@me/channels                 - DM kanallarım
POST   /users/@me/channels                 - DM kanalı oluştur
DELETE /channels/:channelId                - DM kanalını kapat
```

**Database Schema**:
```sql
TABLE messages (
  id UUID PRIMARY KEY,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  edited_at TIMESTAMP,
  pinned BOOLEAN DEFAULT false,
  tts BOOLEAN DEFAULT false,
  mention_everyone BOOLEAN DEFAULT false,
  reply_to_id UUID REFERENCES messages(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

TABLE message_attachments (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  size INTEGER NOT NULL,
  content_type VARCHAR(100),
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

TABLE message_reactions (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  emoji VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id, emoji)
);

TABLE message_mentions (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  PRIMARY KEY (message_id, user_id)
);

TABLE dm_channels (
  id UUID PRIMARY KEY,
  type VARCHAR(20) NOT NULL, -- dm, group_dm
  name VARCHAR(100), -- For group DMs
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

TABLE dm_channel_recipients (
  channel_id UUID REFERENCES dm_channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  PRIMARY KEY (channel_id, user_id)
);
```

**gRPC Interface**:
```protobuf
service MessageService {
  rpc GetMessages (GetMessagesRequest) returns (MessagesResponse);
  rpc GetMessage (GetMessageRequest) returns (MessageResponse);
  rpc CreateMessage (CreateMessageRequest) returns (MessageResponse);
  rpc DeleteMessage (DeleteMessageRequest) returns (Empty);
  rpc SearchMessages (SearchRequest) returns (MessagesResponse);
}
```

#### 4.2.5 WebSocket Gateway (Gerçek Zamanlı İletişim)
**Sorumluluklar**:
- Gerçek zamanlı mesaj iletimi
- User presence tracking
- Typing indicators
- Event broadcasting
- Client connection yönetimi

**Teknolojiler**:
- **Framework**: Bun.js + ElysiaJS
- **WebSocket**: ElysiaJS WebSocket plugin
- **Cache**: Redis (socket connections, rooms)
- **Message Queue**: RabbitMQ (event distribution)

**Events (Client -> Server)**:
```typescript
// Connection
socket.emit('authenticate', { token: 'jwt_token' });

// Messages
socket.emit('message:send', { channelId, content, attachments });
socket.emit('message:edit', { messageId, content });
socket.emit('message:delete', { messageId });
socket.emit('typing:start', { channelId });
socket.emit('typing:stop', { channelId });

// Presence
socket.emit('presence:update', { status, customStatus });

// Voice
socket.emit('voice:join', { channelId });
socket.emit('voice:leave', { channelId });
socket.emit('voice:state', { muted, deafened });
```

**Events (Server -> Client)**:
```typescript
// Messages
socket.on('message:create', (message) => {});
socket.on('message:update', (message) => {});
socket.on('message:delete', (messageId) => {});
socket.on('typing:start', ({ userId, channelId }) => {});

// Guild events
socket.on('guild:create', (guild) => {});
socket.on('guild:update', (guild) => {});
socket.on('guild:delete', (guildId) => {});
socket.on('channel:create', (channel) => {});
socket.on('channel:update', (channel) => {});
socket.on('channel:delete', (channelId) => {});

// Member events
socket.on('guild_member:add', (member) => {});
socket.on('guild_member:update', (member) => {});
socket.on('guild_member:remove', (member) => {});

// Presence
socket.on('presence:update', ({ userId, status }) => {});

// Voice
socket.on('voice:state:update', (voiceState) => {});
```

**Redis Pub/Sub için Event Format**:
```typescript
interface Event {
  type: string;
  data: any;
  guildId?: string;
  channelId?: string;
  userId?: string;
  timestamp: number;
}
```

#### 4.2.6 SFU Service (Media/Voice Servisi)
**Sorumluluklar**:
- WebRTC signaling
- Media streaming (audio, video, screen)
- Room/session yönetimi
- Bandwidth optimization
- Recording (opsiyonel)

**Teknolojiler**:
- **Framework**: Bun.js + ElysiaJS
- **SFU**: Mediasoup
- **Database**: MongoDB (session logs)
- **Cache**: Redis (active sessions)

**API Endpoints**:
```
POST   /rtc/sessions                   - Session oluştur
GET    /rtc/sessions/:id               - Session bilgisi
DELETE /rtc/sessions/:id               - Session sonlandır

POST   /rtc/sessions/:id/join          - Session'a katıl
POST   /rtc/sessions/:id/leave         - Session'dan ayrıl

POST   /rtc/sessions/:id/produce       - Media produce et
POST   /rtc/sessions/:id/consume       - Media consume et
POST   /rtc/sessions/:id/pause         - Media duraklat
POST   /rtc/sessions/:id/resume        - Media devam ettir

GET    /rtc/sessions/:id/participants  - Katılımcı listesi
GET    /rtc/sessions/:id/stats         - Session istatistikleri
```

**WebRTC Signaling Events**:
```typescript
// Socket.IO events for signaling
socket.on('rtc:join', async (data) => {
  // Router RTP capabilities gönder
  socket.emit('rtc:routerCapabilities', capabilities);
});

socket.on('rtc:createTransport', async ({ direction }) => {
  // WebRTC transport oluştur (send/recv)
  socket.emit('rtc:transportCreated', transportParams);
});

socket.on('rtc:connectTransport', async ({ dtlsParameters }) => {
  // Transport bağlantısı kur
});

socket.on('rtc:produce', async ({ kind, rtpParameters }) => {
  // Producer oluştur (audio/video/screen)
  socket.emit('rtc:produced', { producerId });
});

socket.on('rtc:consume', async ({ producerId }) => {
  // Consumer oluştur
  socket.emit('rtc:consumed', consumerParams);
});
```

**Database Schema**:
```sql
TABLE voice_sessions (
  id UUID PRIMARY KEY,
  channel_id UUID REFERENCES channels(id),
  created_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

TABLE voice_participants (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES voice_sessions(id),
  user_id UUID REFERENCES users(id),
  muted BOOLEAN DEFAULT false,
  deafened BOOLEAN DEFAULT false,
  self_video BOOLEAN DEFAULT false,
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP
);
```

### 4.3 Servisler Arası İletişim

#### 4.3.1 gRPC (Senkron İletişim)
**Kullanım Senaryoları**:
- Auth service'ten token doğrulama
- User service'ten kullanıcı bilgisi alma
- Guild service'ten izin kontrolü
- Real-time veri gerektiren işlemler

**Örnek Flow**:
```
Message Service -> (gRPC) -> Auth Service: Token doğrula
Message Service -> (gRPC) -> Guild Service: Kullanıcının kanala yazma izni var mı?
Message Service -> (gRPC) -> User Service: Mention edilen kullanıcılar var mı?
```

#### 4.3.2 RabbitMQ (Asenkron İletişim)
**Exchange Types**:
- **Direct Exchange**: Belirli routing key ile mesaj iletimi
- **Topic Exchange**: Pattern matching ile mesaj iletimi
- **Fanout Exchange**: Broadcast mesajlar için

**Queues ve Binding'ler**:
```
Exchange: events.guild
├── Queue: guild.websocket (websocket gateway için)
├── Queue: guild.notifications (notification service için)
└── Queue: guild.analytics (analytics service için)

Exchange: events.message
├── Queue: message.websocket
├── Queue: message.notifications
└── Queue: message.search (Elasticsearch indexing)

Exchange: events.user
├── Queue: user.websocket
└── Queue: user.notifications
```

**Event Örnekleri**:
```typescript
// Message created event
{
  type: 'MESSAGE_CREATE',
  data: {
    id: 'msg_123',
    channelId: 'ch_456',
    authorId: 'user_789',
    content: 'Hello world',
    mentions: ['user_111'],
    createdAt: '2026-02-16T10:00:00Z'
  },
  routingKey: 'message.create'
}

// Guild member joined event
{
  type: 'GUILD_MEMBER_ADD',
  data: {
    guildId: 'guild_123',
    userId: 'user_456',
    joinedAt: '2026-02-16T10:00:00Z'
  },
  routingKey: 'guild.member.add'
}
```

#### 4.3.3 Redis Pub/Sub (Real-time Events)
WebSocket Gateway için Redis Pub/Sub kullanarak event broadcasting:

```typescript
// Publisher (Message Service)
await redis.publish('channel:msg_123', JSON.stringify({
  type: 'MESSAGE_CREATE',
  data: message
}));

// Subscriber (WebSocket Gateway)
redis.subscribe('channel:*');
redis.on('message', (channel, message) => {
  const event = JSON.parse(message);
  io.to(channel).emit(event.type, event.data);
});
```

### 4.4 API Gateway (Traefik)

**Yapılandırma**:
```yaml
# traefik.yml
entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@example.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

# Rate limiting
http:
  middlewares:
    rate-limit:
      rateLimit:
        average: 100
        burst: 200
        period: 1m
    
    auth-check:
      forwardAuth:
        address: "http://auth-service:3000/auth/verify"
        authResponseHeaders:
          - "X-User-Id"
          - "X-User-Roles"
```

**Service Routing**:
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.auth.rule=PathPrefix(`/api/auth`)"
  - "traefik.http.routers.auth.entrypoints=websecure"
  - "traefik.http.routers.auth.tls.certresolver=letsencrypt"
  - "traefik.http.middlewares.auth-ratelimit.ratelimit.average=50"
```

### 4.5 Veri Yönetimi

#### 4.5.1 PostgreSQL (Ana Database)
**Sharding Strategy**:
- Guild-based sharding: Her guild farklı shard'da
- User-based sharding: Kullanıcı ID'sine göre dağıtım

**Replication**:
- Master-Slave replication
- Read replicas (okuma yükünü dağıtmak için)

**Backup Strategy**:
- Günlük automated backups
- Point-in-time recovery (PITR)
- Cross-region backup replication

#### 4.5.2 Redis (Cache & Sessions)
**Kullanım Alanları**:
- Session storage
- Rate limiting counters
- Online user presence
- Real-time data caching
- Message queue için buffer

**Data Structures**:
```redis
# User session
SET session:{token} "{userId: '123', expiresAt: '...'}" EX 86400

# Online users
ZADD online_users {timestamp} {userId}

# Rate limiting
INCR ratelimit:{userId}:{endpoint} EX 60

# Channel members cache
SADD channel:{channelId}:members {userId}

# Recent messages cache
LPUSH channel:{channelId}:messages {messageJson}
LTRIM channel:{channelId}:messages 0 49
```

**Redis Cluster**:
- 3 master + 3 slave konfigürasyonu
- Automatic failover

#### 4.5.3 Elasticsearch (Search Engine)
**Index Mapping**:
```json
{
  "messages": {
    "mappings": {
      "properties": {
        "id": { "type": "keyword" },
        "channelId": { "type": "keyword" },
        "guildId": { "type": "keyword" },
        "authorId": { "type": "keyword" },
        "content": { "type": "text", "analyzer": "standard" },
        "mentions": { "type": "keyword" },
        "hasAttachment": { "type": "boolean" },
        "createdAt": { "type": "date" }
      }
    }
  }
}
```

**Search Queries**:
```typescript
// Full-text search with filters
{
  "query": {
    "bool": {
      "must": [
        { "match": { "content": "search term" } }
      ],
      "filter": [
        { "term": { "channelId": "ch_123" } },
        { "range": { "createdAt": { "gte": "2026-01-01" } } }
      ]
    }
  },
  "sort": [
    { "createdAt": { "order": "desc" } }
  ]
}
```

#### 4.5.4 AWS S3 (Object Storage)
**Bucket Organization**:
```
discord-alternative-prod/
├── avatars/
│   └── {userId}/{filename}
├── guild-icons/
│   └── {guildId}/{filename}
├── attachments/
│   └── {channelId}/{messageId}/{filename}
└── voice-recordings/
    └── {sessionId}/{filename}
```

**CDN Integration**:
- CloudFront CDN ile S3 integration
- Signed URLs için pre-signed URL generation
- Image resizing lambda functions

---

## 5. Teknoloji Stack

### 5.1 Backend Technologies

#### Core Framework
- **Bun.js** (v1.1+)
  - Ultra-fast JavaScript runtime
  - Built-in TypeScript support
  - Native package manager
  - High performance HTTP server

- **ElysiaJS** (v1.0+)
  - Fast and ergonomic web framework for Bun
  - Type-safe routing
  - Built-in validation
  - OpenAPI/Swagger support

#### Databases
- **MongoDB** (v7+)
  - Document-based NoSQL database
  - Flexible schema design
  - Horizontal scalability
  - Rich query language
  - GridFS for file storage

- **Redis** (v7+)
  - In-memory cache
  - Session storage
  - Pub/Sub messaging
  - Rate limiting

- **Elasticsearch** (v8+)
  - Full-text search
  - Message indexing
  - Analytics

#### Message Queue
- **RabbitMQ** (v3.12+)
  - Event-driven architecture
  - Reliable message delivery
  - Multiple exchange types
  - Dead letter queues

#### Real-time Communication
- **Socket.IO** (v4+)
  - WebSocket communication
  - Automatic reconnection
  - Room support
  - Broadcasting

- **Mediasoup** (v3+)
  - WebRTC SFU server
  - Multi-party video conferencing
  - Screen sharing
  - Simulcast support

#### API Gateway
- **Traefik** (v2+)
  - Reverse proxy
  - Load balancing
  - SSL termination
  - Service discovery

#### Object Storage
- **AWS S3**
  - Media file storage
  - Scalable storage
  - CDN integration

#### Containerization & Orchestration
- **Docker** (v24+)
  - Service containerization
  - Development environment

- **Docker Compose** (Development)
  - Multi-container orchestration
  - Local development setup

- **Kubernetes** (Production)
  - Container orchestration
  - Auto-scaling
  - Self-healing
  - Rolling updates

### 5.2 Libraries & Tools

#### Backend Libraries
```json
{
  "dependencies": {
    "elysia": "^1.0.0",
    "@elysiajs/jwt": "^1.0.0",
    "@elysiajs/bearer": "^1.0.0",
    "@elysiajs/cors": "^1.0.0",
    "@elysiajs/swagger": "^1.0.0",
    "mongoose": "^8.0.0",
    "ioredis": "^5.3.0",
    "amqplib": "^0.10.3",
    "bcrypt": "^5.1.1",
    "otplib": "^12.0.1",
    "aws-sdk": "^2.1467.0",
    "@elastic/elasticsearch": "^8.10.0",
    "mediasoup": "^3.12.0",
    "zod": "^3.22.0"
  }
}
```

### 5.3 Development Tools
- **TypeScript** (v5+) - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing
- **Supertest** - Integration testing
- **Postman/Insomnia** - API testing

### 5.4 Monitoring & Logging
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
  - Log aggregation
  - Log analysis
  - Real-time monitoring
- **Sentry** - Error tracking
- **Jaeger** - Distributed tracing

---

## 6. Güvenlik Gereksinimleri

### 6.1 Authentication & Authorization
- **JWT Tokens**:
  - Access token: 15 dakika expiry
  - Refresh token: 7 gün expiry
  - Token rotation mechanism
  - Token blacklisting (Redis)

- **Password Security**:
  - Bcrypt hashing (cost factor: 12)
  - Minimum 8 karakter
  - Complexity requirements
  - Password history (son 5 şifre)

- **2FA**:
  - TOTP (Time-based One-Time Password)
  - Backup codes
  - SMS fallback (opsiyonel)

### 6.2 API Security
- **Rate Limiting**:
  - Global: 1000 req/min per IP
  - Per user: 100 req/min
  - Per endpoint: Özelleştirilmiş limitler
  - Distributed rate limiting (Redis)

- **Input Validation**:
  - DTO validation (class-validator)
  - SQL injection prevention (parameterized queries)
  - XSS prevention (input sanitization)
  - File upload validation (type, size, virus scan)

- **CORS**:
  - Whitelist-based origin control
  - Credential support
  - Preflight caching

### 6.3 Data Security
- **Encryption**:
  - TLS 1.3 for data in transit
  - AES-256 for data at rest
  - Database encryption (Transparent Data Encryption)
  - S3 bucket encryption

- **PII Protection**:
  - Email masking in logs
  - Password never logged
  - GDPR compliance
  - Data anonymization for analytics

### 6.4 Infrastructure Security
- **Network Security**:
  - VPC isolation
  - Security groups
  - Private subnets for databases
  - Bastion host for SSH access

- **Container Security**:
  - Non-root containers
  - Image scanning (Trivy)
  - Secret management (Kubernetes secrets)
  - Resource limits

- **DDoS Protection**:
  - Cloudflare protection
  - Rate limiting
  - Connection throttling

---

## 7. Performans Gereksinimleri

### 7.1 Response Time SLAs
- **API Endpoints**:
  - GET requests: < 100ms (p95)
  - POST requests: < 200ms (p95)
  - Search queries: < 500ms (p95)

- **Real-time Events**:
  - Message delivery latency: < 100ms
  - Presence updates: < 200ms
  - Voice/Video latency: < 150ms (RTT)

### 7.2 Throughput Requirements
- **Message Service**:
  - 10,000 messages/second peak load
  - 1,000,000 concurrent connections
  - 100,000 concurrent voice users

- **Database**:
  - 50,000 queries/second
  - Write throughput: 10,000 ops/second

### 7.3 Scalability Targets
- **Horizontal Scaling**:
  - Auto-scaling based on CPU/Memory
  - Load balancer distribution
  - Stateless service design

- **Database Scaling**:
  - Read replicas (5+ replicas)
  - Sharding strategy
  - Connection pooling

### 7.4 Caching Strategy
- **Redis Caching**:
  - User sessions: 24 hour TTL
  - Permission cache: 5 minute TTL
  - Online users: Real-time
  - Recent messages: 50 messages per channel

- **CDN Caching**:
  - Static assets: 1 year
  - User avatars: 1 day
  - Guild icons: 1 day

---

## 8. Monitoring ve Observability

### 8.1 Metrics Collection
**Application Metrics**:
- Request rate, latency, error rate
- WebSocket connections
- Database query performance
- Cache hit/miss ratio
- Message queue depth

**Infrastructure Metrics**:
- CPU, Memory, Disk usage
- Network I/O
- Container health
- Pod restart count

**Business Metrics**:
- Daily/Monthly Active Users (DAU/MAU)
- Messages sent per day
- Voice call duration
- Server creation rate

### 8.2 Logging Strategy
**Log Levels**:
- ERROR: Application errors, exceptions
- WARN: Degraded functionality, deprecated API usage
- INFO: Important events (user login, message sent)
- DEBUG: Detailed debugging information

**Log Format** (JSON):
```json
{
  "timestamp": "2026-02-16T10:00:00Z",
  "level": "INFO",
  "service": "message-service",
  "traceId": "abc123",
  "userId": "user_123",
  "message": "Message sent successfully",
  "metadata": {
    "channelId": "ch_456",
    "messageId": "msg_789"
  }
}
```

### 8.3 Distributed Tracing
- **Jaeger Integration**:
  - Request tracing across services
  - Performance bottleneck identification
  - Service dependency mapping

### 8.4 Alerting
**Critical Alerts**:
- Service down (Pagerduty)
- Database connection failure
- High error rate (> 5%)
- Disk space critical (> 90%)

**Warning Alerts**:
- High latency (> 500ms p95)
- Cache miss rate > 20%
- Queue depth > 1000

---

## 9. Deployment ve DevOps

### 9.1 CI/CD Pipeline
**Build Stage**:
```yaml
- Checkout code
- Install dependencies
- Run linter (ESLint)
- Run unit tests
- Run integration tests
- Build Docker images
- Security scan (Trivy)
- Push images to registry
```

**Deploy Stage**:
```yaml
- Pull images from registry
- Update Kubernetes manifests
- Apply rolling update
- Run smoke tests
- Monitor deployment health
- Rollback if health check fails
```

### 9.2 Environment Strategy
- **Development**: Local Docker Compose
- **Staging**: Kubernetes cluster (single region)
- **Production**: Multi-region Kubernetes

### 9.3 Database Migrations
- **TypeORM Migrations**:
  - Version-controlled migrations
  - Automated migration on deploy
  - Rollback capability
  - Data migration scripts

### 9.4 Kubernetes Configuration
**Deployments**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: message-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: message-service
  template:
    spec:
      containers:
      - name: message-service
        image: message-service:latest
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
```

**Services**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: message-service
spec:
  type: ClusterIP
  selector:
    app: message-service
  ports:
  - port: 3000
    targetPort: 3000
```

**Horizontal Pod Autoscaler**:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: message-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: message-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## 10. Test Stratejisi

### 10.1 Unit Tests
- **Coverage Target**: 80%+
- **Test Framework**: Jest
- **Mocking**: Service dependencies, database calls
- **Assertions**: Business logic, data transformations

### 10.2 Integration Tests
- **API Tests**: Endpoint testing with Supertest
- **Database Tests**: Real database transactions
- **Message Queue Tests**: RabbitMQ integration
- **Cache Tests**: Redis operations

### 10.3 End-to-End Tests
- **User Flows**:
  - User registration and login
  - Create guild and channels
  - Send messages
  - Join voice channel
  - Friend request flow

### 10.4 Performance Tests
- **Load Testing**: Apache JMeter, Artillery
- **Stress Testing**: Identify breaking points
- **Endurance Testing**: 24+ hour sustained load

### 10.5 Security Tests
- **Penetration Testing**: OWASP Top 10
- **Vulnerability Scanning**: Automated tools
- **Dependency Audit**: npm audit

---

## 11. Data Models (Detaylı)

### 11.1 User Domain
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  discriminator: string; // 4-digit tag
  verified: boolean;
  mfaEnabled: boolean;
  locale: string;
  flags: number; // User flags (staff, partner, etc.)
  premiumType: number; // 0: None, 1: Classic, 2: Nitro
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  userId: string;
  displayName: string;
  avatar: string | null;
  banner: string | null;
  bio: string;
  accentColor: string | null;
}

interface UserSettings {
  userId: string;
  theme: 'dark' | 'light';
  locale: string;
  compactMode: boolean;
  showEmbeds: boolean;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
}

interface Presence {
  userId: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Activity[];
  clientStatus: {
    desktop?: string;
    mobile?: string;
    web?: string;
  };
}
```

### 11.2 Guild Domain
```typescript
interface Guild {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  splash: string | null;
  banner: string | null;
  ownerId: string;
  afkChannelId: string | null;
  afkTimeout: number;
  verificationLevel: number;
  defaultMessageNotifications: number;
  explicitContentFilter: number;
  features: string[];
  mfaLevel: number;
  systemChannelId: string | null;
  memberCount: number;
  createdAt: Date;
}

interface Channel {
  id: string;
  type: ChannelType;
  guildId: string | null;
  position: number;
  name: string;
  topic: string | null;
  nsfw: boolean;
  lastMessageId: string | null;
  bitrate: number | null;
  userLimit: number | null;
  rateLimitPerUser: number;
  recipients: string[]; // For DMs
  parentId: string | null;
}

enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_ANNOUNCEMENT = 5,
}

interface Role {
  id: string;
  guildId: string;
  name: string;
  color: number;
  hoist: boolean;
  icon: string | null;
  position: number;
  permissions: string; // BigInt as string
  managed: boolean;
  mentionable: boolean;
}
```

### 11.3 Message Domain
```typescript
interface Message {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  timestamp: Date;
  editedTimestamp: Date | null;
  tts: boolean;
  mentionEveryone: boolean;
  mentions: string[];
  mentionRoles: string[];
  attachments: Attachment[];
  embeds: Embed[];
  reactions: Reaction[];
  nonce: string | null;
  pinned: boolean;
  type: MessageType;
  referencedMessage: string | null;
}

interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxyUrl: string;
  height: number | null;
  width: number | null;
  contentType: string;
}

interface Embed {
  title: string | null;
  type: string;
  description: string | null;
  url: string | null;
  timestamp: Date | null;
  color: number | null;
  footer: EmbedFooter | null;
  image: EmbedMedia | null;
  thumbnail: EmbedMedia | null;
  video: EmbedMedia | null;
  author: EmbedAuthor | null;
  fields: EmbedField[];
}
```

---

## 12. API Documentation

### 12.1 API Versioning
- **URL Versioning**: `/api/v1/...`
- **Backward Compatibility**: Minimum 6 ay eski versiyon desteği
- **Deprecation Policy**: 3 ay önce duyuru

### 12.2 Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ],
    "timestamp": "2026-02-16T10:00:00Z",
    "path": "/api/v1/auth/register",
    "requestId": "req_abc123"
  }
}
```

### 12.3 Pagination Format
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 500,
    "hasMore": true,
    "nextCursor": "cursor_abc123"
  }
}
```

### 12.4 Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642329600
```

---

## 13. Roadmap ve Milestone'lar

### Phase 1: MVP (3 ay)
**Milestone 1.1** (Ay 1)
- [ ] Auth Service implementation
- [ ] User Service implementation
- [ ] Basic database schema
- [ ] Docker Compose setup

**Milestone 1.2** (Ay 2)
- [ ] Guild Service implementation
- [ ] Message Service implementation
- [ ] WebSocket Gateway
- [ ] Basic frontend (web)

**Milestone 1.3** (Ay 3)
- [ ] SFU Service (voice only)
- [ ] File upload (S3)
- [ ] Basic UI/UX
- [ ] Alpha release

### Phase 2: Core Features (3 ay)
**Milestone 2.1** (Ay 4)
- [ ] Video call support
- [ ] Screen sharing
- [ ] Permission system v2
- [ ] Search functionality

**Milestone 2.2** (Ay 5)
- [ ] Notification system
- [ ] Email service
- [ ] Mobile app (iOS/Android)
- [ ] Performance optimization

**Milestone 2.3** (Ay 6)
- [ ] Admin dashboard
- [ ] Analytics service
- [ ] Monitoring setup
- [ ] Beta release

### Phase 3: Scale & Polish (3 ay)
**Milestone 3.1** (Ay 7)
- [ ] Kubernetes migration
- [ ] Multi-region deployment
- [ ] CDN integration
- [ ] Load testing

**Milestone 3.2** (Ay 8)
- [ ] Advanced features (threads, forums)
- [ ] Bot API
- [ ] Webhook system
- [ ] Premium features

**Milestone 3.3** (Ay 9)
- [ ] Security audit
- [ ] Performance tuning
- [ ] Documentation complete
- [ ] v1.0 Production release

### Future Enhancements
- [ ] Mobile push notifications
- [ ] End-to-end encryption for DMs
- [ ] Video recording
- [ ] AI-powered moderation
- [ ] Custom emoji creation
- [ ] Server templates
- [ ] Integration marketplace
- [ ] Advanced analytics

---

## 14. Başarı Metrikleri (KPIs)

### 14.1 Teknik Metrikler
- **Uptime**: 99.9%
- **API Response Time**: < 100ms (p95)
- **Message Delivery**: < 100ms latency
- **Error Rate**: < 0.1%
- **Cache Hit Rate**: > 80%

### 14.2 İş Metrikleri
- **DAU (Daily Active Users)**: Target 10K in first year
- **MAU (Monthly Active Users)**: Target 50K in first year
- **Message Volume**: 1M+ messages/day
- **Retention Rate**: 40%+ (30-day)
- **Engagement**: 30+ min/day average session

### 14.3 Performans Metrikleri
- **Time to First Message**: < 3 seconds
- **Voice Connection Time**: < 2 seconds
- **Search Response Time**: < 500ms
- **Page Load Time**: < 2 seconds

---

## 15. Risk Yönetimi

### 15.1 Teknik Riskler
| Risk | Olasılık | Etki | Mitigation |
|------|----------|------|------------|
| Database bottleneck | Orta | Yüksek | Sharding, read replicas, caching |
| WebSocket connection limits | Yüksek | Yüksek | Horizontal scaling, connection pooling |
| Message queue overflow | Orta | Orta | Dead letter queues, monitoring, auto-scaling |
| S3 cost overrun | Orta | Orta | CDN caching, compression, lifecycle policies |
| Security breach | Düşük | Kritik | Security audits, penetration testing, monitoring |

### 15.2 İş Riskleri
| Risk | Olasılık | Etki | Mitigation |
|------|----------|------|------------|
| Low user adoption | Orta | Yüksek | Marketing, community building, feature differentiation |
| High operating costs | Yüksek | Orta | Cost optimization, efficient architecture |
| Competitor feature parity | Yüksek | Orta | Innovation, unique features, better UX |

---

## 16. Compliance ve Legal

### 16.1 GDPR Compliance
- **Right to Access**: User data export API
- **Right to Erasure**: Account deletion mechanism
- **Data Portability**: Export in machine-readable format
- **Consent Management**: Clear consent flows
- **Data Protection Officer**: Designated contact

### 16.2 Content Moderation
- **Reporting System**: User-friendly reporting
- **Automated Detection**: AI-powered content filtering
- **Human Review**: Moderation team for appeals
- **Transparency**: Clear community guidelines

### 16.3 Age Verification
- **Minimum Age**: 13+ (COPPA compliance)
- **Age Gating**: Age verification on signup
- **Parental Consent**: For users under 13 (if supported)

---

## 17. Dokümantasyon Gereksinimleri

### 17.1 API Documentation
- **OpenAPI/Swagger**: Auto-generated API docs
- **Interactive Examples**: Try-it-out functionality
- **Code Samples**: Multiple languages
- **Changelog**: Version-specific changes

### 17.2 Developer Documentation
- **Architecture Diagrams**: System overview
- **Service Documentation**: Per-service guides
- **Deployment Guides**: Step-by-step instructions
- **Contributing Guidelines**: How to contribute

### 17.3 User Documentation
- **User Guide**: Feature explanations
- **FAQ**: Common questions
- **Video Tutorials**: Feature walkthroughs
- **Troubleshooting**: Common issues

---

## 18. Budget ve Kaynak Planlaması

### 18.1 Development Team
- **Backend Developers**: 2-3 developers
- **Frontend Developers**: 2 developers
- **DevOps Engineer**: 1 engineer
- **QA Engineer**: 1 engineer
- **Product Manager**: 1 PM (part-time)

### 18.2 Infrastructure Costs (Tahmini)
- **Cloud Infrastructure**: $500-1000/month (initial)
- **CDN & S3**: $100-300/month
- **Monitoring Tools**: $100-200/month
- **Domain & SSL**: $50/month
- **Third-party Services**: $100-200/month

**Total**: ~$850-1750/month (growing with scale)

### 18.3 Development Timeline
- **MVP Development**: 3 months
- **Beta Testing**: 1 month
- **Production Launch**: Month 5
- **Feature Development**: Ongoing

---

## 19. Sonuç

Bu PRD, Discord alternatifi platformun kapsamlı bir teknik ve ürün spesifikasyonunu sunmaktadır. Mikroservis mimarisi, modern teknolojiler ve ölçeklenebilir altyapı ile gerçek zamanlı bir iletişim platformu oluşturulması hedeflenmektedir.

**Temel Başarı Faktörleri**:
1. ✅ Performanslı ve ölçeklenebilir mimari
2. ✅ Kullanıcı deneyimine odaklanma
3. ✅ Güvenlik ve gizlilik
4. ✅ Sürekli iyileştirme ve iterasyon
5. ✅ Topluluk geri bildirimleri

**Sonraki Adımlar**:
1. Development environment kurulumu
2. Database schema oluşturma
3. Auth ve User service implementation
4. CI/CD pipeline kurulumu
5. MVP geliştirmeye başlama

---

## Appendix

### A. Glossary
- **SFU**: Selective Forwarding Unit
- **WebRTC**: Web Real-Time Communication
- **RBAC**: Role-Based Access Control
- **JWT**: JSON Web Token
- **TOTP**: Time-based One-Time Password
- **CDN**: Content Delivery Network
- **gRPC**: Google Remote Procedure Call

### B. References
- Discord API Documentation
- WebRTC Standards (W3C)
- Mediasoup Documentation
- NestJS Documentation
- Kubernetes Best Practices

### C. Changelog
- **v1.0** (2026-02-16): Initial PRD creation

---

**Document Owner**: Backend Team  
**Last Updated**: 16 Şubat 2026  
**Status**: Draft  
**Version**: 1.0
