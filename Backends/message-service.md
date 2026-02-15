# Message Service API Documentation

**Base URL**: `http://localhost:3004`  
**Port**: 3004

Message Service handles messages, reactions, DM channels, typing indicators, and search.

## Endpoints

### Messages
- `GET /channels/:channelId/messages?limit=50&before=:messageId` - Get messages
- `POST /channels/:channelId/messages` - Send message
- `PATCH /channels/:channelId/messages/:messageId` - Edit message
- `DELETE /channels/:channelId/messages/:messageId` - Delete message
- `GET /channels/:channelId/messages/search?q=:query` - Search messages

### Reactions
- `PUT /channels/:channelId/messages/:messageId/reactions/:emoji/@me` - Add reaction
- `DELETE /channels/:channelId/messages/:messageId/reactions/:emoji/@me` - Remove reaction
- `GET /channels/:channelId/messages/:messageId/reactions/:emoji` - Get users who reacted

### Typing
- `POST /channels/:channelId/typing` - Trigger typing indicator (10s TTL)

### DM Channels
- `GET /users/@me/channels` - Get user's DM channels
- `POST /users/@me/channels` - Create DM channel
- `DELETE /channels/:channelId` - Close DM channel

### Pins
- `GET /channels/:channelId/pins` - Get pinned messages
- `PUT /channels/:channelId/pins/:messageId` - Pin message
- `DELETE /channels/:channelId/pins/:messageId` - Unpin message

## MongoDB Collections

- `messages`: Message data with compound index (channelId, createdAt)
- `message_attachments`: File attachments
- `message_reactions`: User reactions with unique constraint
- `dm_channels`: DM/Group channel metadata
- `dm_channel_recipients`: Channel participants

## RabbitMQ Events

Published to `discord_events` exchange:
- `message.create` - New message sent
- `message.update` - Message edited
- `message.delete` - Message deleted
- `typing.start` - User started typing

## Redis Keys

- `typing:{channelId}:{userId}` - Typing indicator (TTL: 10s)
- `message_cache:{messageId}` - Cached message data

## Elasticsearch Integration

For production, index messages in Elasticsearch:
- Full-text search across all messages
- Advanced filters (author, date range, mentions)
- Fuzzy matching and autocomplete
