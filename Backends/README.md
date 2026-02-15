# Discord Alternative - Backend Services

Discord alternatifi gerçek zamanlı iletişim platformunun backend servisleri. Mikroservis mimarisi ile Bun.js ve ElysiaJS kullanılarak geliştirilmiştir.

## 🏗️ Mimari

Bu proje 6 ana mikroservisten oluşmaktadır:

1. **Auth Service** (Port: 3001) - Kimlik doğrulama ve yetkilendirme
2. **User Service** (Port: 3002) - Kullanıcı profil ve arkadaşlık sistemi
3. **Guild Service** (Port: 3003) - Sunucu, kanal ve rol yönetimi
4. **Message Service** (Port: 3004) - Mesajlaşma ve arama
5. **WebSocket Gateway** (Port: 3005) - Gerçek zamanlı event'ler
6. **SFU Service** (Port: 3006) - Sesli/görüntülü iletişim

## 🛠️ Teknoloji Stack

- **Runtime**: Bun.js v1.1+
- **Framework**: ElysiaJS v1.0+
- **Database**: MongoDB v7+
- **Cache**: Redis v7+
- **Message Queue**: RabbitMQ v3.12+
- **Search Engine**: Elasticsearch v8+
- **Storage**: AWS S3 (opsiyonel)

## 📋 Ön Gereksinimler

- [Bun](https://bun.sh) v1.1 veya üzeri
- [Docker](https://www.docker.com/) ve Docker Compose
- [Git](https://git-scm.com/)

## 🚀 Hızlı Başlangıç

### 1. Repository'yi klonlayın
```bash
git clone <repository-url>
cd DiscordAlternative/Backends
```

### 2. Environment değişkenlerini ayarlayın
```bash
cp .env.example .env
# .env dosyasını düzenleyerek kendi ayarlarınızı yapın
```

### 3. Docker servislerini başlatın
```bash
docker-compose up -d
```

Bu komut aşağıdaki servisleri başlatacaktır:
- MongoDB (Port: 27017)
- Redis (Port: 6379)
- RabbitMQ (Port: 5672, Management UI: 15672)
- Elasticsearch (Port: 9200)

### 4. Servislerin durumunu kontrol edin
```bash
docker-compose ps
```

### 5. RabbitMQ Management UI'ya erişim
```
URL: http://localhost:15672
Username: discord
Password: discord_rabbitmq_pass
```

### 6. Her servisi çalıştırın

Her servis için ayrı terminal penceresi açın:

```bash
# Auth Service
cd auth-service
bun install
bun run dev

# User Service
cd user-service
bun install
bun run dev

# Guild Service
cd guild-service
bun install
bun run dev

# Message Service
cd message-service
bun install
bun run dev

# WebSocket Gateway
cd websocket-gateway
bun install
bun run dev

# SFU Service
cd sfu-service
bun install
bun run dev
```

## 📚 Servis Dokümantasyonları

Her servisin detaylı endpoint dokümantasyonu için ilgili `.md` dosyalarına bakın:

- [Auth Service API](./auth-service.md)
- [User Service API](./user-service.md)
- [Guild Service API](./guild-service.md)
- [Message Service API](./message-service.md)
- [WebSocket Gateway API](./websocket-gateway.md)
- [SFU Service API](./sfu-service.md)

## 🧪 Test

```bash
# Tüm servislerin testlerini çalıştır
bun test

# Belirli bir servisin testini çalıştır
cd auth-service
bun test
```

## 📦 Production Build

```bash
# Her servis için
cd <service-name>
bun run build
bun run start
```

## 🔧 Geliştirme Komutları

```bash
# Docker servislerini başlat
docker-compose up -d

# Docker servislerini durdur
docker-compose down

# Docker loglarını görüntüle
docker-compose logs -f

# Veritabanı verilerini temizle (DİKKAT: Tüm veriler silinir!)
docker-compose down -v

# Servisleri yeniden başlat
docker-compose restart
```

## 📊 Monitoring

- **RabbitMQ Management**: http://localhost:15672
- **Elasticsearch**: http://localhost:9200
- **Health Checks**: Her servis `/health` endpoint'i sunar

## 🔐 Güvenlik

- Production ortamında `.env` dosyasındaki tüm şifreleri değiştirin
- JWT secret key'i güçlü bir değer ile değiştirin
- MongoDB ve Redis için güçlü şifreler kullanın
- AWS credentials'ları environment variables olarak saklayın

## 📝 Ortam Değişkenleri

Detaylı environment değişkenleri listesi için `.env.example` dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altındadır.

## 🐛 Sorun Bildirimi

Sorun bildirmek için GitHub Issues kullanın.

## 📞 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.
