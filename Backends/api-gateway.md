# API Gateway Documentation

**Base URL**: `http://localhost:3000`  
**Port**: 3000

API Gateway tüm mikroservisleri tek bir endpoint altında toplar ve birleşik Swagger dokümantasyonu sağlar.

## Ana Endpoint

- `GET /` - Gateway bilgileri ve servis listesi
- `GET /health` - Tüm servislerin sağlık durumu
- `GET /swagger` - **Birleşik Swagger dokümantasyonu**

## Service Routing

API Gateway, istekleri ilgili mikroservislere yönlendirir:

### Auth Service (`/auth/*`)
- `POST /auth/register` → Port 3001
- `POST /auth/login` → Port 3001
- `POST /auth/logout` → Port 3001
- `POST /auth/refresh` → Port 3001
- Tüm diğer auth endpoints...

### User Service (`/users/*`)
- `GET /users/:userId` → Port 3002
- `PATCH /users/@me` → Port 3002
- `GET /users/@me/friends` → Port 3002
- Tüm diğer user endpoints...

### Guild Service (`/guilds/*`)
- `GET /guilds` → Port 3003
- `POST /guilds` → Port 3003
- `GET /guilds/:guildId/channels` → Port 3003
- Tüm diğer guild endpoints...

### Message Service (`/messages/*`)
- `GET /messages/channels/:channelId/messages` → Port 3004
- `POST /messages/channels/:channelId/messages` → Port 3004
- Tüm diğer message endpoints...

### WebSocket Gateway (`/ws/*`)
- `GET /ws/health` → Port 3006
- `GET /ws/stats` → Port 3006

### SFU Service (`/voice/*`)
- `POST /voice/channels/:channelId/voice/join` → Port 3007
- `GET /voice/channels/:channelId/voice/participants` → Port 3007
- Tüm diğer voice endpoints...

## Kullanım Örneği

```bash
# Gateway üzerinden login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Gateway üzerinden guild listesi
curl http://localhost:3000/guilds \
  -H "Authorization: Bearer YOUR_TOKEN"

# Tüm servislerin sağlık durumu
curl http://localhost:3000/health
```

## Swagger Dokümantasyonu

### Birleşik Dokümantasyon
- **Ana Swagger**: http://localhost:3000/swagger
  - Tüm servislerin endpoint'lerini gösterir
  - Her servise link verir

### Servis Bazlı Dokümantasyonlar
- Auth: http://localhost:3001/swagger
- User: http://localhost:3002/swagger
- Guild: http://localhost:3003/swagger
- Message: http://localhost:3004/swagger
- WebSocket: http://localhost:3006/swagger
- SFU: http://localhost:3007/swagger

## Avantajlar

1. **Tek Giriş Noktası**: Tüm API'lere tek URL'den erişim
2. **Birleşik Dokümantasyon**: Tüm servislerin API'leri tek sayfada
3. **Merkezi Health Check**: Tüm servislerin durumunu tek sorguda görme
4. **Rate Limiting**: Gateway seviyesinde rate limiting eklenebilir
5. **Authentication**: Merkezi auth kontrolü yapılabilir
6. **Load Balancing**: Gelecekte multiple instance'lara yönlendirme

## Geliştirme

```bash
cd Backends/api-gateway
bun install
bun run dev
```

## Production Notları

- CORS ayarlarını production için güncelle
- Rate limiting ekle
- API key/token validation ekle
- Request/response logging ekle
- Circuit breaker pattern uygula
