# Auth Service API Documentation

## Genel Bilgiler

**Base URL**: `http://localhost/api/v1/auth`  
**Direct URL**: `http://localhost:3001`  
**Version**: 1.0.0  
**Port**: 3001

> **Not:** Tüm istekler Traefik API Gateway üzerinden `/api/v1/auth` prefix'i ile yapılır. Geliştirme için direkt servis erişimi (port 3001) de kullanılabilir.

Auth Service, Discord Alternative platformunun kimlik doğrulama ve yetkilendirme işlemlerinden sorumludur.

## Özellikler

- ✅ Email/Password ile kayıt ve giriş
- ✅ JWT tabanlı authentication (Access & Refresh Token)
- ✅ 2FA (Two-Factor Authentication) desteği
- ✅ Email doğrulama
- ✅ Şifre sıfırlama
- ✅ Token yenileme
- ✅ Güvenli logout
- ✅ Redis tabanlı session yönetimi

## Teknoloji Stack

- **Runtime**: Bun.js
- **Framework**: ElysiaJS
- **Database**: MongoDB
- **Cache**: Redis
- **Authentication**: JWT
- **2FA**: TOTP (Time-based One-Time Password)

---

## Endpoints

### Health Check

#### GET `/health`

Servisin çalışır durumda olup olmadığını kontrol eder.

**Response:**
```json
{
  "status": "ok",
  "service": "auth-service",
  "timestamp": "2026-02-16T10:00:00.000Z"
}
```

---

### Authentication

#### POST `/api/v1/auth/register`

Yeni kullanıcı kaydı oluşturur.

**Traefik URL:** `http://localhost/api/v1/auth/register`  
**Direct URL:** `http://localhost:3001/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Validation:**
- `email`: Valid email format
- `username`: 3-32 karakter, sadece harf, rakam ve underscore
- `password`: Minimum 8 karakter, en az 1 büyük harf, 1 küçük harf, 1 rakam

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "emailVerified": false,
      "twoFactorEnabled": false,
      "createdAt": "2026-02-16T10:00:00.000Z",
      "updatedAt": "2026-02-16T10:00:00.000Z"
    },
    "verificationToken": "abc123xyz789"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Email already in use"
}
```

---

#### POST `/api/v1/auth/login`

Kullanıcı girişi yapar ve token'lar döner.

**Traefik URL:** `http://localhost/api/v1/auth/login`  
**Direct URL:** `http://localhost:3001/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "twoFactorCode": "123456"  // Opsiyonel, 2FA aktif ise gerekli
}
```

**Success Response (200) - 2FA Devre Dışı:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "emailVerified": true,
      "twoFactorEnabled": false,
      "createdAt": "2026-02-16T10:00:00.000Z",
      "updatedAt": "2026-02-16T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "random_refresh_token_string",
    "requires2FA": false
  }
}
```

**Success Response (200) - 2FA Gerekli:**
```json
{
  "success": true,
  "data": {
    "requires2FA": true,
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

```json
{
  "success": false,
  "error": "Invalid 2FA code"
}
```

---

#### POST `/api/v1/auth/logout`

Kullanıcı çıkışı yapar ve token'ları geçersiz kılar.

**Traefik URL:** `http://localhost/api/v1/auth/logout`  
**Direct URL:** `http://localhost:3001/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refreshToken": "random_refresh_token_string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true
  }
}
```

---

#### POST `/api/v1/auth/refresh`

Refresh token kullanarak yeni access token alır.

**Traefik URL:** `http://localhost/api/v1/auth/refresh`  
**Direct URL:** `http://localhost:3001/refresh`

**Request Body:**
```json
{
  "refreshToken": "random_refresh_token_string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid refresh token"
}
```

---

### Email Verification

#### POST `/auth/verify-email`

Email adresini doğrular.

**Request Body:**
```json
{
  "token": "abc123xyz789"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "emailVerified": true,
      "twoFactorEnabled": false,
      "createdAt": "2026-02-16T10:00:00.000Z",
      "updatedAt": "2026-02-16T10:00:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid or expired verification token"
}
```

---

### Password Reset

#### POST `/auth/forgot-password`

Şifre sıfırlama isteği oluşturur.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "resetToken": "reset_abc123xyz789"
  }
}
```

> **Not:** Güvenlik nedeniyle, email sistemde olmasa bile aynı response döner.

---

#### POST `/auth/reset-password`

Şifreyi sıfırlar.

**Request Body:**
```json
{
  "token": "reset_abc123xyz789",
  "newPassword": "NewSecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid or expired reset token"
}
```

---

### Two-Factor Authentication (2FA)

#### POST `/auth/2fa/enable`

2FA kurulumunu başlatır.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "otpauthUrl": "otpauth://totp/Discord%20Alternative:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Discord%20Alternative"
  }
}
```

> **Not:** `otpauthUrl` QR kod oluşturmak için kullanılabilir. Kullanıcı bu QR kodu Google Authenticator veya benzeri uygulamaya ekler.

**Error Response (400):**
```json
{
  "success": false,
  "error": "2FA is already enabled"
}
```

---

#### POST `/auth/2fa/verify`

2FA kurulumunu tamamlar.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "code": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "Invalid 2FA code"
}
```

```json
{
  "success": false,
  "error": "No pending 2FA setup found"
}
```

---

#### POST `/auth/2fa/disable`

2FA'yı devre dışı bırakır.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "code": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "Invalid 2FA code"
}
```

```json
{
  "success": false,
  "error": "2FA is not enabled"
}
```

---

## MongoDB Collections

### users
```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  username: string (unique, indexed),
  passwordHash: string,
  emailVerified: boolean,
  twoFactorEnabled: boolean,
  twoFactorSecret?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### oauth_accounts
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: users, indexed),
  provider: 'google' | 'github' | 'discord',
  providerId: string,
  accessToken?: string,
  refreshToken?: string,
  createdAt: Date
}
```
**Index:** `{ provider: 1, providerId: 1 }` (unique)

### refresh_tokens
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: users, indexed),
  token: string (unique, indexed),
  expiresAt: Date (indexed, TTL),
  createdAt: Date
}
```
**TTL Index:** `{ expiresAt: 1 }` - MongoDB otomatik olarak süresi dolan token'ları siler

---

## Redis Keys

### Email Verification
```
Key: email_verify:{token}
Value: {userId}
Expiry: 3600 seconds (1 hour)
```

### Password Reset
```
Key: password_reset:{token}
Value: {userId}
Expiry: 3600 seconds (1 hour)
```

### 2FA Setup (Pending)
```
Key: 2fa_pending:{userId}
Value: {secret}
Expiry: 600 seconds (10 minutes)
```

### Token Blacklist
```
Key: blacklist:{accessToken}
Value: 1
Expiry: Token expiry time
```

---

## Error Codes

| HTTP Code | Description |
|-----------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Validation error, business logic error) |
| 401 | Unauthorized (Invalid or missing token) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Security

### Password Requirements
- Minimum 8 karakter
- En az 1 büyük harf
- En az 1 küçük harf
- En az 1 rakam
- Bcrypt ile hash (cost factor: 12)

### Token Management
- **Access Token**: 15 dakika geçerlilik süresi
- **Refresh Token**: 7 gün geçerlilik süresi
- Token rotation: Her refresh'te yeni access token üretilir
- Refresh token'lar MongoDB'de saklanır
- Logout sonrası refresh token geçersiz kılınır

### Rate Limiting (TODO)
- Login: 5 deneme / 15 dakika
- Register: 3 deneme / saat
- Password reset: 3 deneme / saat

---

## Development

### Başlatma
```bash
cd auth-service
bun install
bun run dev
```

### Environment Variables
```env
AUTH_SERVICE_PORT=3001
MONGODB_URI=mongodb://admin:discord_admin_pass@localhost:27017/discord?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=discord_redis_pass
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### Test
```bash
bun test
```

---

## Swagger Documentation

Servis çalıştığında Swagger UI'ya şu adresten erişilebilir:
```
http://localhost:3001/swagger
```

---

## Future Enhancements

- [ ] OAuth2 entegrasyonu (Google, GitHub, Discord)
- [ ] Email gönderimi (verification, password reset)
- [ ] Rate limiting
- [ ] Account lockout (failed login attempts)
- [ ] Session management (multiple devices)
- [ ] Backup codes for 2FA
- [ ] SMS 2FA (opsiyonel)
- [ ] Audit logging
- [ ] CAPTCHA integration

---

## Contact

Issues ve sorular için GitHub repository'sini kullanabilirsiniz.
