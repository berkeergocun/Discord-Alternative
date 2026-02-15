# User Service API Documentation

**Base URL**: `http://localhost:3002`  
**Port**: 3002

User Service, kullanıcı profil yönetimi, arkadaşlık sistemi ve presence tracking'den sorumludur.

## Endpoints

### Profile Management

#### GET `/users/:userId` - Get user profile
#### PATCH `/users/@me` - Update own profile

**Body:**
```json
{
  "displayName": "John Doe",
  "avatarUrl": "https://cdn.example.com/avatar.jpg",
  "bio": "Hello world"
}
```

### Friend Management

#### GET `/users/@me/friends` - Get friends list
#### POST `/users/:userId/friend-request` - Send friend request
#### PUT `/users/@me/friend-requests/:requestId` - Accept friend request
#### DELETE `/users/@me/friends/:userId` - Remove friend

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
