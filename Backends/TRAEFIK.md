# 🚀 Traefik API Gateway Kullanım Kılavuzu

Bu belge, Discord Alternative Backend projesi için Traefik yapılandırmasını ve kullanımını açıklar.

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Başlatma ve Durdurma](#başlatma-ve-durdurma)
3. [Erişim Adresleri](#erişim-adresleri)
4. [Routing Yapısı](#routing-yapısı)
5. [Health Checks](#health-checks)
6. [Troubleshooting](#troubleshooting)

---

## Genel Bakış

Traefik, tüm backend servislerimiz için merkezi bir API Gateway görevi görür. Tüm istekler önce Traefik'e gelir ve ardından uygun servise yönlendirilir.

### Özellikler

- ✅ Otomatik servis keşfi (Docker integration)
- ✅ Load balancing
- ✅ Health checks
- ✅ Rate limiting
- ✅ CORS desteği
- ✅ Dinamik yapılandırma
- ✅ Web dashboard

---

## Başlatma ve Durdurma

### Tüm Sistemi Başlatma

#### macOS/Linux:
```bash
./start-services.sh
```

#### Windows:
```batch
start-services.bat
```

Bu script şunları yapar:
1. Docker container'ları başlatır (MongoDB, Redis, RabbitMQ, Elasticsearch, Traefik)
2. Tüm backend servislerini başlatır
3. Health check yapar
4. Erişim adreslerini gösterir

### Sadece Docker Container'ları Başlatma

```bash
docker-compose up -d
```

### Sadece Traefik'i Yeniden Başlatma

```bash
docker-compose restart traefik
```

### Servisleri Durdurma

#### macOS/Linux:
```bash
./stop-services.sh
```

#### Windows:
```batch
stop-services.bat
```

### Docker Container'ları Durdurma

```bash
docker-compose down
```

---

## Erişim Adresleri

### � Traefik Üzerinden (Port 80)

Traefik üzerinden hem frontend hem backend'e erişebilirsiniz:

#### Frontend Routes (`/*`)
| Route | Açıklama |
|-------|----------|
| http://localhost/ | Ana sayfa |
| http://localhost/login | Login sayfası |
| http://localhost/register | Kayıt sayfası |
| http://localhost/channels/@me | DM/Friends ana sayfası |
| http://localhost/channels/@me/:dmId | DM konuşması |
| http://localhost/channels/:serverId/:channelId | Sunucu kanalı |

#### Backend API Routes (`/api/v1/*`)
| Servis | Adres | Açıklama |
|--------|-------|----------|
| Auth Service | http://localhost/api/v1/auth | Authentication & Authorization |
| User Service | http://localhost/api/v1/users | User Management |
| Guild Service | http://localhost/api/v1/guilds | Guild/Server Management |
| Message Service | http://localhost/api/v1/channels<br>http://localhost/api/v1/messages | Messaging & DMs |
| WebSocket Gateway | http://localhost/api/v1/ws (HTTP)<br>ws://localhost/ws (WebSocket) | Real-time Events |
| SFU Service | http://localhost/api/v1/channels/:id/voice | Voice & Video |

### 📊 Dashboard ve Management

| Servis | Adres | Credentials |
|--------|-------|-------------|
| Traefik Dashboard | http://localhost:8081 | - |
| RabbitMQ Management | http://localhost:15672 | discord_user / discord_pass |

### 🔧 Direkt Servis Erişimi (Geliştirme)

Traefik'i bypass edip servislere direkt erişim:

| Servis | Adres | Swagger |
|--------|-------|---------|
| Frontend (Nuxt) | http://localhost:3000 | - |
| Auth Service | http://localhost:3001 | /swagger |
| User Service | http://localhost:3002 | /swagger |
| Guild Service | http://localhost:3003 | /swagger |
| Message Service | http://localhost:3004 | /swagger |
| WebSocket Gateway | http://localhost:3006 | /swagger |
| SFU Service | http://localhost:3007 | /swagger |

---

## Routing Yapısı

Traefik, gelen istekleri URL path'ine göre yönlendirir:

```
http://localhost/api/v1/auth/register
                 ↓
        Traefik Gateway (Port 80)
                 ↓
        PathPrefix: /api/v1/auth
                 ↓
        Middleware: Strip /api/v1
                 ↓
        Auth Service (Port 3001)
                 ↓
        Endpoint: /auth/register
```

### Routing Kuralları

1. **Frontend routing (`/*`)**: Priority 1, Nuxt.js'e yönlendirme
2. **Backend routing (`/api/v1/*`)**: PathPrefix ile servislere yönlendirme
3. **Strip prefix**: `/api/v1` middleware ile otomatik temizlenir
4. **Health checks**: Her servis için otomatik sağlık kontrolü
5. **Load balancing**: Birden fazla instance varsa otomatik dağıtım

### Örnek İstekler

#### Frontend (Traefik üzerinden):
```bash
# Ana sayfa
curl http://localhost/

# Login sayfası
curl http://localhost/login

# Channels
curl http://localhost/channels/@me
```

#### Backend API (Traefik üzerinden):
```bash
# Register
curl -X POST http://localhost/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"test","password":"123456"}'

# Get user
curl http://localhost/api/v1/users/@me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get guilds
curl http://localhost/api/v1/guilds \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Direkt servis erişimi (Development):
```bash
# Nuxt direkt
curl http://localhost:3000/login

# Auth Service direkt
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"test","password":"123456"}'
```

---

## Health Checks

### Traefik Health Check

```bash
curl http://localhost:8081/ping
```

### Servis Health Checks

Traefik otomatik olarak her servisi kontrol eder:

```bash
# Manuel health check
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # User
curl http://localhost:3003/health  # Guild
curl http://localhost:3004/health  # Message
curl http://localhost:3006/health  # WebSocket
curl http://localhost:3007/health  # SFU
curl http://localhost:3100/health  # API Gateway
```

### Traefik Dashboard'da Health Status

Traefik dashboard'da tüm servislerin health durumunu görebilirsiniz:

1. http://localhost:8081 adresine gidin
2. "HTTP Services" sekmesine tıklayın
3. Her servisin status'ünü görün (UP/DOWN)

---

## Troubleshooting

### Traefik Healthy Değil

```bash
# Traefik loglarını kontrol et
docker-compose logs traefik

# Traefik'i yeniden başlat
docker-compose restart traefik

# Traefik yapılandırmasını kontrol et
docker exec discord-traefik cat /etc/traefik/traefik.yml
docker exec discord-traefik cat /etc/traefik/dynamic.yml
```

### Servis Erişilemiyor

1. **Servisin çalıştığını kontrol edin:**
```bash
curl http://localhost:3001/health
```

2. **Traefik routing'i kontrol edin:**
- Dashboard'da servisi görüyor musunuz?
- Routing kuralları doğru mu?

3. **Docker network'ü kontrol edin:**
```bash
docker network inspect discord_network
```

4. **Logları inceleyin:**
```bash
# Servis logları
tail -f logs/auth-service.log
tail -f logs/user-service.log

# Docker logları
docker-compose logs traefik
docker-compose logs mongodb
```

### Port Zaten Kullanımda

```bash
# Port 80 kullanımda
lsof -ti:80 | xargs kill -9

# Port 443 kullanımda
lsof -ti:443 | xargs kill -9

# Port 8081 kullanımda
lsof -ti:8081 | xargs kill -9
```

### Traefik Dashboard Açılmıyor

1. **Container çalışıyor mu?**
```bash
docker-compose ps traefik
```

2. **Port erişilebilir mi?**
```bash
curl http://localhost:8081/ping
```

3. **Tarayıcı cache'i temizleyin**

### Rate Limit Hatası

Traefik default olarak rate limiting aktif:
- Average: 100 requests/second
- Burst: 200 requests

Rate limit'i artırmak için `traefik/dynamic.yml` dosyasını düzenleyin:

```yaml
middlewares:
  rate-limit:
    rateLimit:
      average: 200  # Artırın
      burst: 400    # Artırın
      period: 1s
```

---

## Yapılandırma Dosyaları

### Statik Yapılandırma

`traefik/traefik.yml` - Traefik'in temel ayarları:
- Entry points (HTTP, HTTPS)
- API Dashboard
- Docker provider
- File provider

### Dinamik Yapılandırma

`traefik/dynamic.yml` - Runtime yapılandırması:
- HTTP routers
- Services
- Middlewares (CORS, rate limit, strip prefix)
- Health checks

### Docker Compose

`docker-compose.yml` - Container yapılandırması:
- Traefik container
- Volume mounts
- Network bağlantıları
- Health check

---

## Performance Tips

### Load Balancing

Birden fazla service instance'ı çalıştırın:

```bash
# Örnek: 2 Auth Service instance
cd auth-service && bun src/index.ts --port 3001 &
cd auth-service && bun src/index.ts --port 3011 &
```

Traefik otomatik olarak yük dağılımı yapacaktır.

### Caching

Redis cache'i aktif kullanın:
- Session caching
- Query result caching
- Rate limit caching

### Connection Pooling

Her servis için MongoDB connection pool ayarları:

```typescript
// MongoDB client options
{
  maxPoolSize: 50,
  minPoolSize: 10,
  serverSelectionTimeoutMS: 5000
}
```

---

## Monitoring

### Traefik Metrics

Dashboard'da görebilirsiniz:
- Request count
- Response times
- Error rates
- Service health

### Prometheus Integration (Optional)

Traefik Prometheus metrics'i destekler. Eklemek için `traefik.yml`:

```yaml
metrics:
  prometheus:
    entryPoint: metrics
```

---

## Güvenlik

### Production için Öneriler

1. **HTTPS Kullanın**
   - Let's Encrypt entegrasyonu
   - Otomatik sertifika yenileme

2. **API Dashboard'u Kapatın**
```yaml
api:
  dashboard: false
  insecure: false
```

3. **Rate Limiting'i Sıkılaştırın**
```yaml
middlewares:
  rate-limit:
    rateLimit:
      average: 50
      burst: 100
```

4. **CORS Ayarlarını Güncelleyin**
```yaml
middlewares:
  cors:
    headers:
      accessControlAllowOriginList:
        - "https://yourdomain.com"
```

5. **Authentication Middleware Ekleyin**

---

## Yardım ve Destek

### Log Dosyaları

```bash
logs/
  ├── auth-service.log
  ├── user-service.log
  ├── guild-service.log
  ├── message-service.log
  ├── websocket-gateway.log
  ├── sfu-service.log
  └── api-gateway.log
```

### Docker Logs

```bash
docker-compose logs -f traefik
docker-compose logs -f mongodb
docker-compose logs -f redis
docker-compose logs -f rabbitmq
```

### Hızlı Komutlar

```bash
# Tüm sistemin durumu
docker-compose ps && ps aux | grep "bun src/index.ts"

# Tüm logları takip et
tail -f logs/*.log

# Portları kontrol et
lsof -i :80,443,3001,3002,3003,3004,3006,3007,3100,8081

# Memory kullanımı
docker stats

# Disk kullanımı
docker system df
```

---

## 🎉 Başarıyla Kuruldu!

Artık Traefik API Gateway sisteminiz çalışıyor. Tüm servislere http://localhost üzerinden erişebilirsiniz.

**Dashboard:** http://localhost:8081
**API Documentation:** http://localhost/swagger
**Health Check:** http://localhost:8081/ping

İyi çalışmalar! 🚀
