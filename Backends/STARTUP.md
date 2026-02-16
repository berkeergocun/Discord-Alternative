# 🎮 Discord Alternative - Servis Başlatma Rehberi

## 🚀 Hızlı Başlangıç

### macOS / Linux

```bash
# Tüm servisleri başlat (Docker + Backend)
./start-services.sh

# Servisleri durdur
./stop-services.sh
```

### Windows

```batch
# Tüm servisleri başlat (Docker + Backend)
start-services.bat

# Servisleri durdur
stop-services.bat
```

## 📋 Gereksinimler

- **Bun.js** v1.3.5+
- **Docker** & **Docker Compose**
- **macOS/Linux**: bash shell
- **Windows**: Command Prompt veya PowerShell

## 🏗️ Mimari

### Docker Container'ları

| Servis | Port | Durum |
|--------|------|-------|
| MongoDB | 27017 | ✅ Healthy |
| Redis | 6379 | ✅ Healthy |
| RabbitMQ | 5672, 15672 | ✅ Healthy |
| Elasticsearch | 9200, 9300 | ✅ Healthy |
| Traefik | 80, 443, 8081 | ✅ Healthy |

### Backend Servisleri

| Servis | Port | Traefik Route | Durum |
|--------|------|---------------|-------|
| Auth Service | 3001 | /auth | ✅ Running |
| User Service | 3002 | /users | ✅ Running |
| Guild Service | 3003 | /guilds | ✅ Running |
| Message Service | 3004 | /messages | ✅ Running |
| WebSocket Gateway | 3006 | /ws | ✅ Running |
| SFU Service | 3007 | /sfu | ✅ Running |
| API Gateway | 3100 | /api | ✅ Running |

## 🌐 Erişim Adresleri

### Traefik API Gateway (Önerilen)

**Ana Endpoint:** http://localhost

| Route | Servis | Örnek |
|-------|--------|-------|
| `/auth` | Auth Service | `curl http://localhost/auth/health` |
| `/users` | User Service | `curl http://localhost/users/health` |
| `/guilds` | Guild Service | `curl http://localhost/guilds/health` |
| `/messages` | Message Service | `curl http://localhost/messages/health` |
| `/ws` | WebSocket Gateway | `curl http://localhost/ws/health` |
| `/sfu` | SFU Service | `curl http://localhost/sfu/health` |
| `/api` | API Gateway | `curl http://localhost/api/health` |
| `/swagger` | Unified Swagger | http://localhost/swagger |

### Dashboard'lar

- **Traefik Dashboard:** http://localhost:8081
- **RabbitMQ Management:** http://localhost:15672
  - Username: `discord_user`
  - Password: `discord_pass`

### Direkt Servis Erişimi (Geliştirme)

| Servis | Health Check | Swagger |
|--------|--------------|---------|
| Auth | http://localhost:3001/health | http://localhost:3001/swagger |
| User | http://localhost:3002/health | http://localhost:3002/swagger |
| Guild | http://localhost:3003/health | http://localhost:3003/swagger |
| Message | http://localhost:3004/health | http://localhost:3004/swagger |
| WebSocket | http://localhost:3006/health | http://localhost:3006/swagger |
| SFU | http://localhost:3007/health | http://localhost:3007/swagger |
| API Gateway | http://localhost:3100/health | http://localhost:3100/swagger |

## 📝 Scriptler

### start-services.sh / start-services.bat

**Yapılanlar:**
1. Docker container'ları başlatır
2. Container'ların sağlıklı olmasını bekler
3. Tüm backend servislerini sırayla başlatır
4. Her servis için health check yapar
5. PID'leri kaydeder (.pids dosyası)
6. Erişim adreslerini gösterir

**Özellikler:**
- ✅ Otomatik health check
- ✅ Renkli terminal çıktısı
- ✅ Log dosyaları (`logs/*.log`)
- ✅ PID takibi
- ✅ Hata raporlama

### stop-services.sh / stop-services.bat

**Yapılanlar:**
1. Kayıtlı PID'lerden servisleri durdurur
2. Port'lardaki tüm servisleri temizler
3. Kalan Bun process'lerini sonlandırır

**Not:** Docker container'ları durdurmaz. Container'ları durdurmak için:
```bash
docker-compose down
```

## 🔍 Loglara Bakma

### Tüm Logları Takip Et

```bash
tail -f logs/*.log
```

### Belirli Bir Servisi Takip Et

```bash
tail -f logs/auth-service.log
tail -f logs/user-service.log
tail -f logs/guild-service.log
```

### Docker Logları

```bash
# Traefik
docker-compose logs -f traefik

# MongoDB
docker-compose logs -f mongodb

# RabbitMQ
docker-compose logs -f rabbitmq

# Tüm container'lar
docker-compose logs -f
```

## 🧪 Test Komutları

### Health Check Testi

```bash
# Traefik Dashboard
curl http://localhost:8081/api/overview | jq

# Tüm servisleri Traefik üzerinden test et
for service in auth users guilds messages ws sfu api; do
  echo "Testing /$service:"
  curl -s http://localhost/$service/health | jq
  echo ""
done
```

### Örnek API İstekleri

```bash
# Register (via Traefik)
curl -X POST http://localhost/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "SecurePass123!"
  }'

# Login (via Traefik)
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Get user profile (direkt)
curl http://localhost:3002/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🛠️ Troubleshooting

### Servis Başlamıyor

1. **Port kullanımda mı kontrol et:**
```bash
lsof -i :3001,3002,3003,3004,3006,3007,3100
```

2. **Logları kontrol et:**
```bash
tail -100 logs/auth-service.log
```

3. **Bun process'lerini temizle:**
```bash
pkill -9 -f "bun.*src/index.ts"
```

### Docker Container Problemi

```bash
# Container durumunu kontrol et
docker-compose ps

# Logları kontrol et
docker-compose logs mongodb

# Container'ı yeniden başlat
docker-compose restart mongodb

# Tüm container'ları yeniden başlat
docker-compose down
docker-compose up -d
```

### Traefik Routing Çalışmıyor

1. **Traefik Dashboard'u kontrol et:**
   - http://localhost:8081 adresine git
   - "HTTP Routers" ve "HTTP Services" sekmelerini incele

2. **Traefik loglarını kontrol et:**
```bash
docker-compose logs traefik
```

3. **Servislerin çalıştığını doğrula:**
```bash
curl http://localhost:3001/health
```

4. **Traefik'i yeniden başlat:**
```bash
docker-compose restart traefik
```

### Port Zaten Kullanımda

```bash
# macOS/Linux
lsof -ti:80 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :80
taskkill /F /PID <PID>
```

## 📊 Sistem Durumu

### Çalışan Process'leri Görüntüle

```bash
# Backend servisleri
ps aux | grep "bun src/index.ts"

# Docker container'lar
docker-compose ps

# Port kullanımı
lsof -i :80,443,3001,3002,3003,3004,3006,3007,3100,8081
```

### Kaynak Kullanımı

```bash
# Docker stats
docker stats

# Disk kullanımı
docker system df

# Memory kullanımı
docker stats --no-stream
```

## 🎯 Geliştirme Workflow'u

### Yeni Bir Özellik Geliştirme

1. **Servisleri başlat:**
```bash
./start-services.sh
```

2. **Geliştirme yap:**
   - Kod değişikliklerini yap
   - Servisi yeniden başlat

3. **Tek bir servisi yeniden başlat:**
```bash
# PID'i bul
lsof -ti:3001

# Servisi durdur
kill -9 <PID>

# Servisi başlat
cd auth-service && bun src/index.ts > ../logs/auth-service.log 2>&1 &
```

4. **Test et:**
```bash
curl http://localhost/auth/health
```

### Hot Reload için

Her servis için watch mode kullanabilirsiniz:

```bash
cd auth-service
bun --watch src/index.ts
```

## 📚 Dokümantasyon

- **[PRD.md](PRD.md)** - Product Requirements Document
- **[TRAEFIK.md](TRAEFIK.md)** - Traefik yapılandırma detayları
- **[auth-service.md](auth-service.md)** - Auth Service API dokümantasyonu
- **[user-service.md](user-service.md)** - User Service API dokümantasyonu
- **[guild-service.md](guild-service.md)** - Guild Service API dokümantasyonu
- **[message-service.md](message-service.md)** - Message Service API dokümantasyonu
- **[websocket-gateway.md](websocket-gateway.md)** - WebSocket Gateway API dokümantasyonu
- **[sfu-service.md](sfu-service.md)** - SFU Service API dokümantasyonu
- **[api-gateway.md](api-gateway.md)** - API Gateway dokümantasyonu

## 🔐 Güvenlik

### Geliştirme Ortamı

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting (Traefik)
- ✅ CORS enabled
- ⚠️ HTTP only (HTTPS yok)
- ⚠️ Traefik dashboard açık

### Production için

1. HTTPS'i aktifleştir
2. Traefik dashboard'u kapat
3. Rate limiting'i sıkılaştır
4. CORS ayarlarını güncelle
5. Güçlü şifreler kullan
6. Gizli bilgileri environment variable'larda sakla

## 📦 Deployment

### Production Checklist

- [ ] Environment variable'ları ayarla
- [ ] HTTPS sertifikası yapılandır
- [ ] Database backup stratejisi oluştur
- [ ] Monitoring kurulumu (Prometheus, Grafana)
- [ ] Log aggregation (ELK Stack)
- [ ] CI/CD pipeline oluştur
- [ ] Rate limiting ayarla
- [ ] CORS production domain'leri ayarla
- [ ] Traefik dashboard'u kapat
- [ ] Güvenlik testleri yap

## 🤝 Katkıda Bulunma

1. Branch oluştur
2. Değişiklikleri yap
3. Test et
4. Commit oluştur
5. Pull request aç

## 📝 Git Workflow

```bash
# Feature branch oluştur
git checkout -b feature/yeni-ozellik

# Değişiklikleri commit et
git add .
git commit -m "feat: Yeni özellik eklendi"

# Main branch'e merge et
git checkout main
git merge feature/yeni-ozellik

# Remote'a push (manuel)
# git push origin main
```

**Not:** Şu anda tüm commit'ler local'de tutulmaktadır. Push işlemi elle yapılmalıdır.

## 🎉 Başarıyla Kuruldu!

Tüm sistemler çalışıyor! 🚀

**Dashboard:** http://localhost:8081  
**API Gateway:** http://localhost/api  
**Unified Swagger:** http://localhost/swagger  

İyi çalışmalar! 💻
