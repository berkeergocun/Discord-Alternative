[🇹🇷 Türkçe Dökümantasyon için tıklayınız](#discord-alternative-platform-tr)

# Discord Alternative Platform

## 🚀 About the Project

A modern, scalable, and distributed real-time communication platform. This project aims to recreate core Discord features (text chat, voice/video calls, server management) using a microservices architecture. It serves as a reference project for developers on modern backend architecture and scalable system design.

**Vision:** To provide a free, open-source, and reliable communication alternative for users.

---

## 🛠 Tech Stack

### Backend (Microservices)
The project consists of independent microservices, each handling specific responsibilities:

*   **Runtime:** [Bun.js](https://bun.sh) (High-performance JavaScript runtime)
*   **Framework:** [ElysiaJS](https://elysiajs.com) (Fast and type-safe web framework)
*   **Databases:**
    *   **MongoDB:** For user data, messages, and persistent storage.
    *   **Redis:** For caching, session management, and Pub/Sub (real-time events).
    *   **PostgreSQL:** For relational data (optional for future extensions).
*   **Communication:**
    *   **REST & gRPC:** Inter-service communication.
    *   **RabbitMQ:** Asynchronous message queue.
    *   **WebSocket:** Real-time client communication.
*   **Media & Storage:**
    *   **AWS S3:** Avatar, file, and media storage.
    *   **Mediasoup:** WebRTC-based SFU (Selective Forwarding Unit) for voice and video processing.

### Frontend (Web)
*   **Framework:** [Nuxt.js 4](https://nuxt.com) (Vue 3 based full-stack framework)
*   **Language:** TypeScript
*   **Style:** Tailwind CSS
*   **State Management:** Pinia (Nuxt 4 built-in state management)
*   **UI Components:** Radix Vue (Headless UI), Lucide Vue (Icons)

### Mobile (Planned)
*   **Tech:** React Native or Flutter (Not yet in development)

---

## 🏗 System Architecture

The system features a layered architecture for load balancing, security, and scalability:

1.  **Client Layer:** Web, Mobile, and Desktop applications.
2.  **API Gateway (Traefik):** Handles all requests, distributes load, and routes to relevant services.
3.  **Core Services:**
    *   `auth-service`: Authentication, JWT, OAuth2.
    *   `user-service`: Profile, friendship, blocking operations.
    *   `guild-service`: Server, channel, role, and permission management.
    *   `message-service`: Messaging, search, file upload.
    *   `sfu-service`: Voice and video calls (WebRTC).
    *   `websocket-gateway`: Real-time event delivery.
4.  **Data & Infrastructure:** MongoDB, Redis, RabbitMQ, S3.

---

## ✨ Features

### 🔐 Authentication
*   Email/Password registration and login.
*   OAuth2 (Google, Discord, GitHub, etc.) integration.
*   JWT-based secure session management.
*   Two-Factor Authentication (2FA).

### 👥 User & Social
*   Customizable user profiles (Avatar, Bio, Status).
*   Friend request, removal, and blocking system.
*   Real-time "Online", "Idle", "Do Not Disturb" status.

### 💬 Servers & Messaging
*   **Servers:** Create and customize your own community server.
*   **Channels:** Text and voice channels, categories.
*   **Roles:** Detailed permission system (RBAC) for server management.
*   **Messages:** Markdown support, file sharing, emojis, replies.
*   **DM:** One-on-one and group messaging.

### 📞 Voice & Video
*   High-quality voice chat.
*   Screen sharing.
*   Video calls (Camera).
*   Noise cancellation and voice activity detection (VAD).

---

## 📂 Project Structure

```
DiscordAlternative/
├── .git/
├── .gitignore          # Global git ignore configuration
├── Backends/           # All backend microservices reside here
│   ├── auth-service/
│   ├── user-service/
│   ├── guild-service/
│   ├── message-service/
│   ├── sfu-service/
│   ├── websocket-gateway/
│   ├── PRD.md          # Detailed Product Requirements Document
│   └── docker-compose.yml # For spinning up services locally
├── Web/                # Frontend (Nuxt.js) project
│   ├── components/     # UI components
│   ├── pages/          # Page routes
│   ├── layouts/        # Page layouts
│   └── ...
└── Mobile/             # Mobile app (Future)
```

---

## 🚀 Installation & Setup

### Requirements
*   [Bun](https://bun.sh) (v1.0+)
*   [Node.js](https://nodejs.org) (v18+) - May be required for Frontend
*   [Docker](https://www.docker.com) & Docker Compose (For databases and services)

### Step 1: Clone the Project
```bash
git clone https://github.com/username/DiscordAlternative.git
cd DiscordAlternative
```

### Step 2: Configure Environment Variables
Each service (or root) contains `.env.example` files. Copy them to `.env` and configure necessary settings.

### Step 3: Start Backend Services
Spin up the infrastructure (MongoDB, Redis, RabbitMQ) using Docker:
```bash
cd Backends
docker-compose up -d
```
Then navigate to the relevant service folder and start it in dev mode:
```bash
cd auth-service
bun install
bun run dev
```

### Step 4: Start Frontend
```bash
cd ../Web
npm install
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## 🤝 Contributing

Contributions are welcome! Please support the project by opening an "Issue" or sending a "Pull Request".

1.  Fork this repository.
2.  Create a new branch (`git checkout -b feature/new-feature`).
3.  Commit your changes (`git commit -m 'Added new feature'`).
4.  Push to your branch (`git push origin feature/new-feature`).
5.  Create a Pull Request.

---

## 📄 License

This project is licensed under the [MIT](LICENSE) license.

<br>
<br>
<br>

---

# Discord Alternative Platform (TR)

## 🚀 Proje Hakkında

Modern, ölçeklenebilir ve dağıtık bir gerçek zamanlı iletişim platformu. Bu proje, Discord'un temel özelliklerini (metin tabanlı sohbet, sesli/görüntülü aramalar, sunucu yönetimi) mikroservis mimarisi kullanarak yeniden oluşturmayı hedefler. Geliştiriciler için modern backend mimarisi ve ölçeklenebilir sistem tasarımı konusunda referans bir projedir.

**Vizyon:** Kullanıcılara özgür, açık kaynaklı ve güvenilir bir iletişim alternatifi sunmak.

---

## 🛠 Teknoloji Yığını (Tech Stack)

### Backend (Mikroservisler)
Proje, her biri belirli bir sorumluluğu üstlenen bağımsız mikroservislerden oluşur:

*   **Runtime:** [Bun.js](https://bun.sh) (Yüksek performanslı JavaScript runtime)
*   **Framework:** [ElysiaJS](https://elysiajs.com) (Hızlı ve tip güvenli web framework)
*   **Veritabanları:**
    *   **MongoDB:** Kullanıcı verileri, mesajlar ve kalıcı depolama için.
    *   **Redis:** Cache, session yönetimi ve Pub/Sub (gerçek zamanlı olaylar) için.
    *   **PostgreSQL:** İlişkisel veriler (gelecekteki genişletmeler için opsiyonel).
*   **İletişim:**
    *   **REST & gRPC:** Servisler arası iletişim.
    *   **RabbitMQ:** Asenkron mesaj kuyruğu.
    *   **WebSocket:** Gerçek zamanlı istemci iletişimi.
*   **Medya & Depolama:**
    *   **AWS S3:** Avatar, dosya ve medya depolama.
    *   **Mediasoup:** WebRTC tabanlı SFU (Selective Forwarding Unit) ses ve görüntü işleme.

### Frontend (Web)
*   **Framework:** [Nuxt.js 4](https://nuxt.com) (Vue 3 tabanlı full-stack framework)
*   **Dil:** TypeScript
*   **Stil:** Tailwind CSS
*   **State Management:** Pinia (Nuxt 4 built-in state yönetimi)
*   **UI Bileşenleri:** Radix Vue (Headless UI), Lucide Vue (İkonlar)

### Mobil (Planlanan)
*   **Tech:** React Native veya Flutter (Henüz geliştirme aşamasında değil)

---

## 🏗 Sistem Mimarisi

Sistem, yük dengeleme, güvenlik ve ölçeklenebilirlik için katmanlı bir mimariye sahiptir:

1.  **Client Layer:** Web, Mobil ve Masaüstü uygulamaları.
2.  **API Gateway (Traefik):** Tüm istekleri karşılar, yük dağıtır ve ilgili servislere yönlendirir.
3.  **Core Services:**
    *   `auth-service`: Kimlik doğrulama, JWT, OAuth2.
    *   `user-service`: Profil, arkadaşlık, engelleme işlemleri.
    *   `guild-service`: Sunucu, kanal, rol ve izin yönetimi.
    *   `message-service`: Mesajlaşma, arama, dosya yükleme.
    *   `sfu-service`: Sesli ve görüntülü görüşme (WebRTC).
    *   `websocket-gateway`: Gerçek zamanlı olay iletimi.
4.  **Data & Infrastructure:** MongoDB, Redis, RabbitMQ, S3.

---

## ✨ Özellikler

### 🔐 Kimlik Doğrulama
*   Email/Şifre ile kayıt ve giriş.
*   OAuth2 (Google, Discord, GitHub vb.) entegrasyonu.
*   JWT tabanlı güvenli oturum yönetimi.
*   İki Faktörlü Doğrulama (2FA).

### 👥 Kullanıcı & Sosyal
*   Özelleştirilebilir kullanıcı profilleri (Avatar, Bio, Durum).
*   Arkadaş ekleme, çıkarma ve engelleme sistemi.
*   Gerçek zamanlı "Online", "Boşta", "Rahatsız Etmeyin" durumu.

### 💬 Sunucular ve Mesajlaşma
*   **Sunucular:** Kendi topluluk sunucunuzu oluşturun, özelleştirin.
*   **Kanallar:** Metin ve ses kanalları, kategoriler.
*   **Roller:** Detaylı izin sistemi (RBAC) ile sunucu yönetimi.
*   **Mesajlar:** Markdown desteği, dosya paylaşımı, emojiler, yanıtlamalar.
*   **DM:** Birebir ve grup mesajlaşma.

### 📞 Ses ve Görüntü
*   Yüksek kaliteli sesli sohbet.
*   Ekran paylaşımı.
*   Görüntülü görüşme (Kamera).
*   Gürültü engelleme ve ses aktivasyonu (VAD).

---

## 📂 Proje Yapısı

```
DiscordAlternative/
├── .git/
├── .gitignore          # Global git ignore yapılandırması
├── Backends/           # Tüm backend mikroservisleri burada
│   ├── auth-service/
│   ├── user-service/
│   ├── guild-service/
│   ├── message-service/
│   ├── sfu-service/
│   ├── websocket-gateway/
│   ├── PRD.md          # Detaylı Ürün Gereksinim Dokümanı
│   └── docker-compose.yml # Servisleri yerel ortamda kaldırmak için
├── Web/                # Frontend (Nuxt.js) projesi
│   ├── components/     # UI bileşenleri
│   ├── pages/          # Sayfa rotaları
│   ├── layouts/        # Sayfa düzenleri
│   └── ...
└── Mobile/             # Mobil uygulama (Gelecekte)
```

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
*   [Bun](https://bun.sh) (v1.0+)
*   [Node.js](https://nodejs.org) (v18+) - Frontend için gerekli olabilir
*   [Docker](https://www.docker.com) & Docker Compose (Veritabanları ve servisler için)

### Adım 1: Projeyi Klonlayın
```bash
git clone https://github.com/kullaniciadi/DiscordAlternative.git
cd DiscordAlternative
```

### Adım 2: Çevresel Değişkenleri Ayarlayın
Her servisin (veya root'un) içinde `.env.example` dosyaları bulunur. Bunları `.env` olarak kopyalayıp gerekli ayarları yapın.

### Adım 3: Backend Servislerini Başlatın
Docker kullanarak altyapıyı (MongoDB, Redis, RabbitMQ) ayağa kaldırın:
```bash
cd Backends
docker-compose up -d
```
Ardından ilgili servis klasörüne gidip servisi geliştirme modunda başlatın:
```bash
cd auth-service
bun install
bun run dev
```

### Adım 4: Frontend'i Başlatın
```bash
cd ../Web
npm install
npm run dev
```
Tarayıcınızda `http://localhost:3000` adresine gidin.

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen bir "Issue" açarak veya "Pull Request" göndererek projeye destek olun.

1.  Bu depoyu fork'layın.
2.  Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`).
3.  Değişikliklerinizi commit'leyin (`git commit -m 'Yeni özellik eklendi'`).
4.  Branch'inizi push'layın (`git push origin feature/yeni-ozellik`).
5.  Bir Pull Request oluşturun.

---

## 📄 Lisans

Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.
