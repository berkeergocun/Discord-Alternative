# Auth Debug Kılavuzu

## Sorun: Auth olmadan /channels/@me sayfasına erişilebiliyor

### Debug Adımları:

1. **Tarayıcıda http://localhost:3000 aç**

2. **Console'u Aç (F12 → Console tab)**

3. **LocalStorage'ı Temizle:**
   ```javascript
   localStorage.clear()
   ```

4. **Sayfayı Yenile (F5)**

5. **Console'da şunları kontrol et:**
   - `[Auth Middleware]` logları görüyor musun?
   - `isAuthenticated` değeri `false` mı?
   - `isLoading` değeri ne?

6. **Şimdi `/channels/@me` adresine git:**
   ```
   http://localhost:3000/channels/@me
   ```

7. **Console'da ne yazıyor:**
   - Middleware çalıştı mı?
   - Redirect edildi mi?
   - Hata var mı?

---

## Olası Sorunlar ve Çözümler:

### Sorun 1: Middleware hiç çalışmıyor
**Belirti:** Console'da `[Auth Middleware]` logu yok

**Çözüm:** 
- Frontend'i yeniden başlat
- `.nuxt` klasörünü sil: `rm -rf .nuxt`
- Tekrar başlat: `npm run dev`

### Sorun 2: isLoading sürekli true
**Belirti:** Console'da `Still loading, waiting...` logu

**Çözüm:**
```javascript
// Console'da çalıştır:
const { initAuth, isLoading, isAuthenticated } = useAuth()
console.log({ isLoading: isLoading.value, isAuthenticated: isAuthenticated.value })
```

### Sorun 3: isAuthenticated yanlış true dönüyor
**Belirti:** Token yok ama `isAuthenticated: true`

**Çözüm:**
```javascript
// Console'da kontrol et:
console.log('Token:', localStorage.getItem('discord_access_token'))
console.log('User:', localStorage.getItem('discord_user'))
```

### Sorun 4: SSR/Hydration problemi
**Belirti:** Server'da render edilirken middleware çalışmıyor

**Çözüm:** Middleware'de `if (process.server) return` ekledik ✅

---

## Test Senaryosu:

### Test 1: Korumalı Sayfaya Erişim (No Auth)
```bash
1. localStorage.clear()
2. window.location.href = '/channels/@me'
3. Beklenen: /login sayfasına redirect
```

### Test 2: Login Sonrası Erişim
```bash
1. /login sayfasına git
2. Giriş yap (testuser999@example.com / Test123456)
3. /channels/@me sayfasına git
4. Beklenen: Sayfa açılmalı
```

### Test 3: Logout Sonrası Erişim
```bash
1. Login olmuş durumda
2. Logout yap (sol alttaki avatar → Çıkış Yap)
3. /channels/@me sayfasına gitmeyi dene
4. Beklenen: /login'e redirect
```

---

## Console Commands:

```javascript
// Auth durumunu kontrol et
const { isAuthenticated, user, isLoading } = useAuth()
console.log({
  isAuthenticated: isAuthenticated.value,
  isLoading: isLoading.value,
  user: user.value,
  hasToken: !!localStorage.getItem('discord_access_token')
})

// Manual olarak initAuth çağır
await initAuth()

// LocalStorage'ı temizle ve test et
localStorage.clear()
window.location.href = '/channels/@me'
```

---

## Sonuç Raporu:

Lütfen şunları kontrol edip sonuçları paylaş:

- [ ] Console'da `[Auth Middleware]` logları görünüyor mu?
- [ ] `isAuthenticated` değeri doğru mu?
- [ ] `isLoading` false oluyor mu?
- [ ] LocalStorage'da token var mı?
- [ ] /channels/@me'ye erişim engelleniyor mu?
