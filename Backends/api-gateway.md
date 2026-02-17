# API Gateway Documentation

> **ÖNEMLİ:** Bu API Gateway artık kullanılmamaktadır. Tüm routing işlemleri **Traefik** tarafından yapılmaktadır.

## Traefik API Gateway

**Base URL**: `http://localhost`  
**Frontend**: `http://localhost/*`  
**Backend API**: `http://localhost/api/v1/*`  
**Dashboard**: `http://localhost:8081`

Traefik, tüm frontend ve backend isteklerini yönetir.

---

## Yeni Routing Yapısı

### Frontend Routes (`/*`)
- `GET /` → Nuxt.js (Port 3000)
- `GET /login` → Nuxt.js
- `GET /register` → Nuxt.js
- `GET /channels/@me` → Nuxt.js
- `GET /channels/@me/:dmId` → Nuxt.js
- `GET /channels/:serverId/:channelId` → Nuxt.js
- Tüm frontend sayfaları...

### Backend API Routes (`/api/v1/*`)

#### Auth Service (`/api/v1/auth/*`)
- `POST /api/v1/auth/register` → Port 3001
- `POST /api/v1/auth/login` → Port 3001
- `POST /api/v1/auth/logout` → Port 3001
- `POST /api/v1/auth/refresh` → Port 3001
- Tüm diğer auth endpoints...

#### User Service (`/api/v1/users/*`)
- `GET /api/v1/users/:userId` → Port 3002
- `PATCH /api/v1/users/@me` → Port 3002
- `GET /api/v1/users/@me/friends` → Port 3002
- Tüm diğer user endpoints...

#### Guild Service (`/api/v1/guilds/*`)
- `GET /api/v1/guilds` → Port 3003
- `POST /api/v1/guilds` → Port 3003
- `GET /api/v1/guilds/:guildId/channels` → Port 3003
- Tüm diğer guild endpoints...

#### Message Service (`/api/v1/channels/*` & `/api/v1/messages/*`)
- `GET /api/v1/channels/:channelId/messages` → Port 3004
- `POST /api/v1/channels/:channelId/messages` → Port 3004
- `GET /api/v1/messages/:messageId` → Port 3004
- Tüm diğer message endpoints...

#### WebSocket Gateway (`/api/v1/ws/*` & `/ws`)
- `GET /api/v1/ws/health` → Port 3006 (HTTP)
- `WS /ws` → Port 3005 (WebSocket)

#### SFU Service (Voice - `/api/v1/channels/:channelId/voice/*`)
- `POST /api/v1/channels/:channelId/voice/join` → Port 3007
- `GET /api/v1/channels/:channelId/voice/participants` → Port 3007
- Tüm diğer voice endpoints...

---

## Kullanım Örnekleri

### Frontend
```bash
# Ana sayfa
curl http://localhost/

# Login sayfası
curl http://localhost/login

# Channels
curl http://localhost/channels/@me
```

### Backend API
```bash
# Kullanıcı kaydı
curl -X POST http://localhost/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "username": "user123", "password": "password123"}'

# Login
curl -X POST http://localhost/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Guild listesi
curl http://localhost/api/v1/guilds \
  -H "Authorization: Bearer YOUR_TOKEN"

# Mesaj gönder
curl -X POST http://localhost/api/v1/channels/CHANNEL_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello World!"}'
```

---

## Swagger Dokümantasyonu

### Servis Bazlı Dokümantasyonlar (Direct Access)
- Auth: http://localhost:3001/swagger
- User: http://localhost:3002/swagger
- Guild: http://localhost:3003/swagger
- Message: http://localhost:3004/swagger
- WebSocket: http://localhost:3006/swagger
- SFU: http://localhost:3007/swagger

---

## Traefik Avantajları

1. **Tek Giriş Noktası**: Tüm frontend ve backend tek URL'den
2. **Path-Based Routing**: Frontend `/*`, Backend `/api/v1/*`
3. **Automatic Service Discovery**: Docker container'ları otomatik keşfeder
4. **Load Balancing**: Multiple instance'lara otomatik dağıtım
5. **Health Checks**: Her servis için otomatik sağlık kontrolü
6. **Rate Limiting**: Middleware ile rate limiting
7. **CORS**: Merkezi CORS yönetimi
8. **SSL/TLS**: Let's Encrypt entegrasyonu

---

## Traefik Dashboard

Traefik dashboard'da tüm routing'leri ve servislerin durumunu görebilirsiniz:

**URL**: http://localhost:8081

### Dashboard Özellikleri
- 🔍 Tüm router'ları görüntüleme
- 📊 Servis health status'ları
- 📈 Request metrics
- ⚙️ Middleware yapılandırmaları
- 🌐 TLS sertifikaları

---

## Yapılandırma

### Static Config
`Backends/traefik/traefik.yml` - Temel Traefik ayarları

### Dynamic Config
`Backends/traefik/dynamic.yml` - Runtime routing yapılandırması

Detaylı bilgi için bkz: [TRAEFIK.md](./TRAEFIK.md)

---

## Notlar

- Eski API Gateway (port 3000) artık kullanılmamaktadır
- Tüm routing işlemleri Traefik tarafından yapılır
- Frontend ve backend aynı domain üzerinde çalışır (CORS problemi yok)
- Production'da Traefik SSL/TLS termination yapabilir
