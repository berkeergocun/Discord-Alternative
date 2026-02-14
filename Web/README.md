# Discord Alternative - Frontend

Discord benzeri bir chat uygulamasının frontend'i. Nuxt.js ve Tailwind CSS ile geliştirilmiştir.

## Özellikler

✅ **Full Screen Layout** - Tüm sayfa ekranı tamamen kaplar
✅ **Client-Side Rendering (CSR)** - Sadece client tarafında çalışır
✅ **Lazy Loading** - Tüm componentler skeleton loading ile lazy yüklenir
✅ **Loading Screen** - Sadece ilk açılışta gösterilir
✅ **Component Tabanlı** - Her UI parçası ayrı bir component

### Sayfalar

- **Arkadaşlar Sayfası** - Arkadaşları görüntüleme ve filtreleme
- **Direkt Mesajlar** - 1-1 ve grup mesajlaşma
- **Sunucu Kanalları** - Metin ve ses kanalları
- **Üye Listesi** - Sunucu üyelerini rollere göre görüntüleme

### Mock Data

Uygulama tamamen mock data ile çalışır:
- 4 sunucu
- 6 arkadaş
- 4 DM konuşması  
- Her sunucu için kanallar ve mesajlar

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build
```

## Teknolojiler

- **Nuxt.js 4** - Vue.js framework
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
├── composables/       # useMockData
├── pages/            # index.vue
├── layouts/          # default.vue
└── assets/css/       # main.css
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
- Backend yok, tüm data mock
- Dark theme Discord renklerine göre ayarlanmış
