# User Service API Documentation

**Base URL**: `http://localhost/api/v1/users`  
**Direct URL**: `http://localhost:3002`  
**Port**: 3002

> **Not:** Tüm istekler Traefik API Gateway üzerinden `/api/v1/users` prefix'i ile yapılır.

User Service, kullanıcı profil yönetimi, arkadaşlık sistemi ve presence tracking'den sorumludur.

## Endpoints

### Profile Management

#### GET `/api/v1/users/:userId` - Get user profile
**Direct:** `GET /users/:userId`

#### PATCH `/api/v1/users/@me` - Update own profile
**Direct:** `PATCH /users/@me`

**Body:**
```json
{
  "displayName": "John Doe",
  "avatarUrl": "https://cdn.example.com/avatar.jpg",
  "bio": "Hello world"
}
```

### Friend Management

#### GET `/api/v1/users/@me/friends` - Get friends list
**Direct:** `GET /users/@me/friends`

#### POST `/api/v1/users/:userId/friend-request` - Send friend request
**Direct:** `POST /users/:userId/friend-request`

#### PUT `/api/v1/users/@me/friend-requests/:requestId` - Accept friend request
**Direct:** `PUT /users/@me/friend-requests/:requestId`

#### DELETE `/api/v1/users/@me/friends/:userId` - Remove friend
**Direct:** `DELETE /users/@me/friends/:userId`

### Blocking

#### POST `/users/:userId/block` - Block user
#### DELETE `/users/:userId/block` - Unblock user

### Presence

#### PATCH `/users/@me/presence` - Update presence

**Body:**
```json
{
  "status": "online",
  "customStatus": "Playing games"
}
```

## MongoDB Collections

- `user_profiles`: User profile data
- `friendships`: Friend relationships  
- `user_blocks`: Blocked users

## Redis Keys

- `presence:{userId}`: User presence data (hash)
- `online_users`: Sorted set of online users (score: timestamp)

See full documentation for details.
