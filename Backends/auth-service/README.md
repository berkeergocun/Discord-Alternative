# Auth Service

Authentication and authorization service for Discord Alternative platform.

## Features

- User registration with email/password
- JWT-based authentication (Access & Refresh tokens)
- Two-Factor Authentication (2FA) with TOTP
- Email verification
- Password reset functionality
- Token refresh mechanism
- Secure logout with token invalidation

## Tech Stack

- **Runtime**: Bun.js
- **Framework**: ElysiaJS
- **Database**: MongoDB
- **Cache**: Redis
- **Authentication**: JWT, bcrypt
- **2FA**: otplib (TOTP)

## Getting Started

### Prerequisites

- Bun v1.1+
- MongoDB v7+
- Redis v7+

### Installation

```bash
bun install
```

### Environment Variables

Copy `.env.example` from root and set:

```env
AUTH_SERVICE_PORT=3001
MONGODB_URI=mongodb://admin:discord_admin_pass@localhost:27017/discord?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=discord_redis_pass
JWT_SECRET=your-super-secret-jwt-key
```

### Development

```bash
bun run dev
```

### Production

```bash
bun run build
bun run start
```

## API Documentation

See [auth-service.md](../auth-service.md) for detailed API documentation.

**Swagger UI**: http://localhost:3001/swagger

## Project Structure

```
auth-service/
├── src/
│   ├── config/
│   │   ├── database.ts      # MongoDB & Redis connection
│   │   └── index.ts         # Configuration
│   ├── models/
│   │   ├── User.ts          # User model
│   │   ├── OAuthAccount.ts  # OAuth accounts
│   │   └── RefreshToken.ts  # Refresh tokens
│   ├── schemas/
│   │   └── auth.schema.ts   # Zod validation schemas
│   ├── services/
│   │   └── auth.service.ts  # Business logic
│   └── index.ts             # Main application
├── package.json
└── README.md
```

## Testing

```bash
bun test
```

## Security

- Passwords hashed with bcrypt (cost factor: 12)
- JWT tokens with expiration
- 2FA support with TOTP
- Token blacklisting in Redis
- Refresh token rotation

## License

MIT
