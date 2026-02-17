# Frontend-Backend Entegrasyonu Test Adımları

## ✅ Yapılan Düzeltmeler

### 1. Traefik Routing Düzeltildi
**Problem:** Traefik, `/auth` prefix'ini strip ediyordu, backend'e sadece `/register` gibi path'ler ulaşıyordu.

**Çözüm:** `Backends/traefik/dynamic.yml` dosyasında tüm servisler için `strip-*-prefix` middleware'leri kaldırıldı:
- ❌ `/auth` → strip → `/register` (YANLIŞ)
- ✅ `/auth/register` → `/auth/register` (DOĞRU)

### 2. API Endpoints Düzeltildi
**Frontend API client** (`Web/lib/api.ts`) endpoint'leri backend ile eşleşecek şekilde güncellendi:

**Auth Service:**
- `/auth/register` - Yeni kullanıcı kaydı
- `/auth/login` - Kullanıcı girişi
- `/auth/logout` - Çıkış
- `/auth/refresh` - Token yenileme

**User Service:**
- `/users/@me` - Mevcut kullanıcı profili
- `/users/{id}` - Kullanıcı detayı
- `/users/@me/friends` - Arkadaş listesi

**Guild Service:**
- `/guilds` - Sunucu listesi
- `/guilds/{id}` - Sunucu detayı
- `/guilds/{id}/channels` - Sunucu kanalları

**Message Service:**
- `/channels/{id}/messages` - Kanal mesajları
- `/users/@me/channels` - DM kanalları

### 3. Environment Configuration
`.env` dosyası oluşturuldu:
```
VITE_API_URL=http://localhost
```

## 🧪 Test Sonuçları (Backend API - cURL)

### ✅ Test 1: Register Endpoint
```bash
curl -X POST http://localhost/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser999@example.com","username":"testuser999","password":"Test123456"}'
```

**Sonuç:** ✅ BAŞARILI
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "69938089087abbba3e3194fe",
      "email": "testuser999@example.com",
      "username": "testuser999",
      "emailVerified": false,
      "twoFactorEnabled": false
    },
    "verificationToken": "c994jp7pu5gcg0ziq1g4n"
  }
}
```

### ✅ Test 2: Login Endpoint
```bash
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser999@example.com","password":"Test123456"}'
```

**Sonuç:** ✅ BAŞARILI
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "69938089087abbba3e3194fe",
      "email": "testuser999@example.com",
      "username": "testuser999"
    },
    "accessToken": "access_69938089087abbba3e3194fe_1771274384044",
    "refreshToken": "ea77n975d3v0hip9zl40n3b",
    "requires2FA": false
  }
}
```

## 📋 Frontend Test Senaryosu (Manuel)

### Test 1: Kayıt Olma (Register)
1. Tarayıcıda `http://localhost:3000` adresine git
2. "Kayıt ol" linkine tıkla
3. Formu doldur:
   - Email: `frontend-test@example.com`
   - Kullanıcı Adı: `frontendtest`
   - Şifre: `Test123456`
   - Şifre Tekrar: `Test123456`
   - Şartları kabul et ✓
4. "Kayıt Ol" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Başarı mesajı gösterilmeli
- ✅ 3 saniye sonra login sayfasına yönlendirilmeli
- ✅ Console'da hata olmamalı

### Test 2: Giriş Yapma (Login)
1. Login sayfasında formu doldur:
   - Email: `frontend-test@example.com`
   - Şifre: `Test123456`
2. "Giriş Yap" butonuna tıkla

**Beklenen Sonuç:**
- ✅ localStorage'a token'lar kaydedilmeli:
  - `discord_access_token`
  - `discord_refresh_token`
  - `discord_user`
- ✅ `/channels/@me` sayfasına yönlendirilmeli
- ✅ Console'da hata olmamalı

### Test 3: Session Restore
1. Giriş yaptıktan sonra sayfayı yenile (F5)

**Beklenen Sonuç:**
- ✅ Kullanıcı giriş yapmış olarak kalmalı
- ✅ `/channels/@me` sayfasında kalmalı
- ✅ Logout butonunda kullanıcı bilgisi görünmeli

### Test 4: Protected Route Access
1. Logout durumda tarayıcıya `http://localhost:3000/channels/@me` yaz

**Beklenen Sonuç:**
- ✅ Otomatik olarak `/login` sayfasına yönlendirilmeli
- ✅ Console'da middleware log'u görünmeli

### Test 5: Logout
1. Sol alttaki avatar'a tıkla
2. Dropdown menüden "Çıkış Yap" seçeneğine tıkla

**Beklenen Sonuç:**
- ✅ localStorage temizlenmeli
- ✅ `/login` sayfasına yönlendirilmeli
- ✅ Tekrar protected route'a girmeye çalışınca redirect edilmeli

## 🐛 Chrome DevTools Kontrolleri

### Network Tab
1. F12 ile DevTools aç
2. Network tab'ine geç
3. Register/Login işlemi yap

**Kontrol Et:**
- ✅ Request URL: `http://localhost/auth/register` veya `/auth/login`
- ✅ Status Code: `200 OK`
- ✅ Response: Valid JSON (`success: true`)
- ✅ CORS Headers: `Access-Control-Allow-Origin: *`

### Console Tab
**Olmaması Gerekenler:**
- ❌ `Unexpected token 'N', "NOT_FOUND" is not valid JSON`
- ❌ `TypeError: Failed to fetch`
- ❌ `CORS policy` hataları
- ❌ TypeScript hataları

### Application Tab → Local Storage
**Giriş Sonrası Kontrol:**
```
Key: discord_access_token
Value: access_69938089087abbba3e3194fe_1771274384044

Key: discord_refresh_token
Value: ea77n975d3v0hip9zl40n3b

Key: discord_user
Value: {"id":"69938089087abbba3e3194fe","email":"..."}
```

## 🎯 Test Kullanıcıları

### Backend'de Oluşturulmuş Kullanıcılar (cURL ile)
1. **testuser999@example.com** / `Test123456`

### Frontend'den Oluşturulacak Kullanıcı
2. **frontend-test@example.com** / `frontendtest` / `Test123456`

## 📝 Test Checklist

### Backend Routing (cURL) ✅
- [x] Register endpoint çalışıyor
- [x] Login endpoint çalışıyor
- [x] Traefik doğru route ediyor
- [x] CORS headers mevcut

### Frontend Integration (Manuel Test)
- [ ] Register formu çalışıyor
- [ ] Login formu çalışıyor
- [ ] Token'lar localStorage'a kaydediliyor
- [ ] Protected routes yönlendirme yapıyor
- [ ] Session restore çalışıyor
- [ ] Logout fonksiyonu çalışıyor

### Error Handling
- [ ] Hatalı şifre girişi uyarı veriyor
- [ ] Eksik form alanları validation çalışıyor
- [ ] Network hataları düzgün gösteriliyor

## 🚀 Sonraki Adımlar

1. ✅ **Manuel testleri tamamla** (Yukarıdaki senaryoları takip et)
2. 🔄 **Chrome MCP ile otomatik test** (Eğer manuel testler başarılı ise)
3. ✅ **Token refresh mekanizmasını test et** (Token expire olduğunda)
4. 📱 **Responsive design kontrolü**
5. 🌐 **Cross-browser testing**

## 📞 Hata Durumunda

Eğer herhangi bir test başarısız olursa:

1. **Browser Console'u kontrol et** - Hangi request başarısız?
2. **Network tab'ı kontrol et** - Response ne döndü?
3. **Backend logs'ları kontrol et** - `docker logs discord-traefik`
4. **Frontend terminal'i kontrol et** - SSR/Nuxt hataları var mı?

---

**✨ Traefik routing düzeltildi, backend testleri başarılı! Şimdi frontend manuel testlerini yapabilirsiniz.**

Frontend URL: http://localhost:3000
