# Guild Service API Documentation

**Base URL**: `http://localhost:3003`  
**Port**: 3003

Guild Service manages servers (guilds), channels, roles, members, and invites.

## Endpoints

### Guilds
- `GET /guilds` - Get user's guilds
- `POST /guilds` - Create guild
- `GET /guilds/:guildId` - Get guild details
- `PATCH /guilds/:guildId` - Update guild
- `DELETE /guilds/:guildId` - Delete guild

### Channels
- `GET /guilds/:guildId/channels` - List channels
- `POST /guilds/:guildId/channels` - Create channel
- `PATCH /guilds/:guildId/channels/:channelId` - Update channel
- `DELETE /guilds/:guildId/channels/:channelId` - Delete channel

### Roles
- `GET /guilds/:guildId/roles` - List roles
- `POST /guilds/:guildId/roles` - Create role
- `PATCH /guilds/:guildId/roles/:roleId` - Update role
- `DELETE /guilds/:guildId/roles/:roleId` - Delete role

### Members
- `GET /guilds/:guildId/members` - List members
- `POST /guilds/:guildId/members` - Add member
- `DELETE /guilds/:guildId/members/:userId` - Remove member

### Invites
- `GET /guilds/:guildId/invites` - List invites
- `POST /guilds/:guildId/invites` - Create invite
- `POST /invites/:code` - Use invite to join guild
- `DELETE /guilds/:guildId/invites/:code` - Delete invite

## MongoDB Collections

- `guilds`: Guild data
- `channels`: Channel data
- `roles`: Role data with permissions (bitfield)
- `guild_members`: User memberships
- `invites`: Invite codes

## Permissions System

Permissions stored as BigInt bitfield. Example permissions:
- CREATE_INSTANT_INVITE = 1 << 0
- KICK_MEMBERS = 1 << 1
- BAN_MEMBERS = 1 << 2
- ADMINISTRATOR = 1 << 3
- MANAGE_CHANNELS = 1 << 4
- MANAGE_GUILD = 1 << 5
