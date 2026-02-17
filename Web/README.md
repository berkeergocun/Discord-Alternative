# Discord Alternative - Frontend

Discord benzeri bir chat uygulamasının frontend'i. Nuxt.js ve Tailwind CSS ile geliştirilmiştir.

## Özellikler

✅ **Full Screen Layout** - Tüm sayfa ekranı tamamen kaplar
✅ **Client-Side Rendering (CSR)** - Sadece client tarafında çalışır
✅ **Authentication System** - JWT tabanlı auth sistemi
✅ **Protected Routes** - Middleware ile sayfa koruması
✅ **Lazy Loading** - Tüm componentler skeleton loading ile lazy yüklenir
✅ **Loading Screen** - Sadece ilk açılışta gösterilir
✅ **Component Tabanlı** - Her UI parçası ayrı bir component

### Sayfalar

- **Login / Register** - Kullanıcı girişi ve kayıt
- **Arkadaşlar Sayfası** - Arkadaşları görüntüleme ve filtreleme
- **Direkt Mesajlar** - 1-1 ve grup mesajlaşma
- **Sunucu Kanalları** - Metin ve ses kanalları
- **Üye Listesi** - Sunucu üyelerini rollere göre görüntüleme

### Backend Entegrasyonu

Frontend, Traefik API Gateway üzerinden backend servislerine bağlanır:
- **Auth Service**: Kullanıcı girişi, kayıt, token yönetimi
- **User Service**: Profil yönetimi, arkadaşlık sistemi
- **Guild Service**: Sunucu ve kanal yönetimi
- **Message Service**: Mesajlaşma ve DM'ler
- **WebSocket Gateway**: Gerçek zamanlı event'ler
- **SFU Service**: Ses ve video chat

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Environment variables
cp .env.example .env

# Development server'ı başlat
npm run dev

# Production build
npm run build
```

### Backend Gereksinimi

Frontend'in çalışması için backend servislerin aktif olması gerekir:

```bash
# Backend klasöründe
cd ../Backends

# Docker container'ları başlat
docker-compose up -d

# Backend servisleri başlat
./start-services.sh  # macOS/Linux
# veya
start-services.bat   # Windows
```

Backend servisleri Traefik üzerinden `http://localhost` adresinde çalışır.

## Teknolojiler

- **Nuxt.js 3** - Vue.js framework
- **Vue 3** - Composition API
- **Tailwind CSS** - Utility-first CSS
- **TypeScript** - Type safety
- **Radix Vue** - Headless UI components
- **Lucide Vue** - Icon library

## Proje Yapısı

```
discord-app/
├── components/
│   ├── atoms/          # Avatar, Badge, ServerIcon vb.
│   ├── navigation/     # ServerRail, Sidebar, UserPanel
│   ├── channels/       # ChannelList, ChannelItem
│   ├── chat/          # MessageList, ChatInput, ChatArea
│   ├── members/       # MemberList, MemberItem
│   ├── friends/       # FriendsView
│   ├── dm/            # DMList, DMItem
│   └── layouts/       # MainLayout
├── composables/       # useMockData, useAuth
├── pages/            # Login, Register, Channels
├── middleware/       # auth.ts
├── layouts/          # default.vue
├── lib/              # api.ts (API client)
└── assets/css/       # main.css
```

## Authentication Flow

### 1. İlk Yükleme
- `app.vue` mount olunca `useAuth().initAuth()` çalışır
- Token varsa session verify edilir
- Geçersiz token varsa temizlenir ve login'e yönlendirilir

### 2. Login
- Kullanıcı `/login` sayfasına gider
- Email ve password ile giriş yapar
- 2FA aktifse kod istenir
- Başarılı girişte token'lar localStorage'a kaydedilir
- `/channels/@me` sayfasına yönlendirilir

### 3. Route Protection
- Tüm `/channels/*` sayfaları `auth` middleware ile korunur
- Token yoksa `/login` sayfasına yönlendirir
- Token varsa sayfaya erişim sağlanır

### 4. Token Refresh
- Access token expire olunca API client otomatik refresh eder
- Refresh başarısızsa kullanıcı logout edilir

### 5. Logout
- UserPanel'deki kullanıcı avatarına tıkla → Çıkış Yap
- Token'lar temizlenir ve `/login`'e yönlendirilir

## API Client Kullanımı

```typescript
import { authService, userService, guildService } from '~/lib/api'

// Login
const result = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})

// Get user profile
const user = await userService.getMe()

// Get guilds
const guilds = await guildService.getGuilds()
```

## Component Hiyerarşisi

```
MainLayout
├── ServerRail (sol)
├── Sidebar (orta)
│   ├── DMList (DM mode)
│   └── ChannelList (Server mode)
└── Content Area (sağ)
    ├── FriendsView
    ├── ChatArea
    └── MemberList
```

## Geliştirme Notları

- Her component Suspense ile sarılı ve skeleton loading'e sahip
- Tüm state'ler MainLayout'ta merkezi olarak yönetilir
- Auth state global olarak `useState` ile saklanır
- Token'lar localStorage'da, refresh otomatik
- Dark theme Discord renklerine göre ayarlanmış

## Güvenlik

- JWT token'lar localStorage'da saklanır
- Refresh token ile otomatik token yenileme
- Middleware ile sayfa koruması
- XSS koruması için Content Security Policy önerilir
- Production'da HTTPS kullanılmalı
