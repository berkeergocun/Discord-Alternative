# 🔐 Authentication Troubleshooting Guide

Bu döküman, frontend authentication sisteminde karşılaşabileceğiniz sorunlar ve çözümlerini içerir.

## Genel Kontroller

### 1. Backend Servisleri Çalışıyor mu?

```bash
# Auth Service kontrolü
curl http://localhost/auth/health

# Yanıt:
# {"status":"ok","service":"auth-service"}
```

### 2. Traefik Gateway Çalışıyor mu?

```bash
# Traefik dashboard
open http://localhost:8081
```

### 3. Browser Console'da Hata Var mı?

- Chrome DevTools'u aç (F12)
- Console sekmesine git
- Network sekmesinde API isteklerini kontrol et

---

## Yaygın Sorunlar ve Çözümleri

### ❌ "Failed to fetch" / CORS Hatası

**Sorun**: Backend'e istek atılamıyor veya CORS hatası.

**Çözüm**:
1. Backend servislerinin çalıştığından emin ol
2. Traefik gateway'in aktif olduğunu kontrol et
3. `.env` dosyasındaki `VITE_API_URL` değerini kontrol et

```bash
# Backend servislerini kontrol et
docker ps | grep discord

# Traefik loglarını kontrol et
docker logs discord-traefik
```

---

### ❌ "Session expired" / Token Geçersiz

**Sorun**: Token expire olmuş veya geçersiz.

**Çözüm**:
1. localStorage'ı temizle ve yeniden login ol

```javascript
// Browser console'da çalıştır
localStorage.clear()
location.reload()
```

2. Backend'de token'ların expire süresini kontrol et
3. Refresh token mekanizmasının çalıştığını kontrol et

---

### ❌ Sonsuz Redirect Loop

**Sorun**: `/login` ve `/channels/@me` arasında sonsuz redirect.

**Çözüm**:
1. Auth middleware'in doğru çalıştığını kontrol et
2. `isLoading` state'inin doğru yönetildiğini kontrol et

```typescript
// useAuth composable'da
console.log('Auth Loading:', isLoading.value)
console.log('Is Authenticated:', isAuthenticated.value)
```

---

### ❌ 2FA Kodu Kabul Edilmiyor

**Sorun**: 2FA kodu girilse bile giriş yapılamıyor.

**Çözüm**:
1. 2FA kodunun 6 haneli olduğunu kontrol et
2. Kodun son kullanma süresini kontrol et (30 saniye)
3. Backend'de 2FA setup'ının tamamlandığını kontrol et

---

### ❌ Login Sonrası Sayfa Yüklenmiyor

**Sorun**: Login başarılı ama sayfa yüklenmiyor veya boş kalıyor.

**Çözüm**:
1. `app.vue`'daki `initAuth()` fonksiyonunu kontrol et
2. User data'nın doğru şekilde set edildiğini kontrol et

```typescript
// Browser console'da
console.log('User:', localStorage.getItem('discord_user'))
console.log('Token:', localStorage.getItem('discord_access_token'))
```

---

### ❌ "Invalid email or password"

**Sorun**: Doğru bilgiler girilse de giriş yapılamıyor.

**Çözüm**:
1. Email format'ının doğru olduğunu kontrol et
2. Password'ün minimum gereksinimleri karşıladığını kontrol et
3. Backend'de kullanıcının oluşturulduğunu kontrol et

```bash
# MongoDB'de kullanıcıyı kontrol et
docker exec -it discord-mongo mongosh
use discord_auth
db.users.findOne({email: "user@example.com"})
```

---

## Debug Modu

### API İsteklerini Loglama

`lib/api.ts` dosyasında debug mode ekle:

```typescript
const DEBUG = true

private async request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  if (DEBUG) {
    console.log('API Request:', endpoint, options)
  }
  
  // ... existing code
  
  if (DEBUG) {
    console.log('API Response:', endpoint, data)
  }
  
  return data
}
```

### Auth State'i İzleme

`useAuth.ts` dosyasında state değişikliklerini logla:

```typescript
watch([user, isAuthenticated, isLoading], () => {
  console.log('Auth State:', {
    user: user.value,
    isAuthenticated: isAuthenticated.value,
    isLoading: isLoading.value,
  })
})
```

---

## Test Kullanıcısı Oluşturma

Backend'de test kullanıcısı oluştur:

```bash
# Register endpoint'i kullan
curl -X POST http://localhost/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123456"
  }'
```

---

## Production Kontrol Listesi

Frontend'i production'a almadan önce:

- [ ] `.env` dosyasında production API URL'i ayarlanmış mı?
- [ ] HTTPS kullanılıyor mu?
- [ ] CORS ayarları production için güncellenmiş mi?
- [ ] Token'lar güvenli şekilde saklanıyor mu?
- [ ] Error handling tüm API çağrılarında var mı?
- [ ] Loading state'leri kullanıcı deneyimi için yeterli mi?
- [ ] Rate limiting var mı?
- [ ] XSS koruması var mı?

---

## Backend Servis Kontrolü

Tüm backend servislerinin sağlık durumunu kontrol et:

```bash
# Auth Service
curl http://localhost/auth/health

# User Service
curl http://localhost/users/health

# Guild Service
curl http://localhost/guilds/health

# Message Service
curl http://localhost/messages/health

# WebSocket Gateway
curl http://localhost/ws/health

# SFU Service
curl http://localhost/voice/health
```

---

## Yardım

Sorun çözülmedi mi?

1. Browser console'daki hataları kontrol et
2. Network sekmesinde failed request'leri kontrol et
3. Backend servis loglarını kontrol et
4. Traefik loglarını kontrol et

```bash
# Backend service logları
docker logs discord-auth-service
docker logs discord-user-service

# Traefik logları
docker logs discord-traefik
```
