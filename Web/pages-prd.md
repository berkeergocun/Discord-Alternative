# Pages PRD - Discord Clone

## 1. Authentication Pages (`/login`, `/register`, etc.)

- **Login Page**: `/login`
    - Form: Email/Phone + Password.
    - Features: QR Code login (for mobile app flow), "Forgot Password" link.
- **Register Page**: `/register`
    - Form: Email, Display Name, Username, Password, Date of Birth.
    - Terms & Privacy checkboxes.
- **Verify Email**: `/verify-email` (if flow requires it).

---

## 2. Main Application Structure (`/channels`)

### Global Layout
- **Left Rail (Server List)**: Always visible.
- **Secondary Sidebar (Navigation)**: Changes based on context (DM list vs Server Channels).
- **Main Content Area**: Chat, Settings, or Special Views.
- **Right Sidebar**: Contextual (Members list, Search results, Thread view).

### Direct Messages (`/channels/@me`)
- **Friends Home** (`/channels/@me`):
    - Tabs: Online, All, Pending, Blocked, Add Friend.
    - Content: Search bar, List of friends with status/activities.
    - Right Sidebar: "Active Now" (Rich Presence of friends).
- **DM Conversation** (`/channels/@me/:userId`):
    - Header: User status, Call buttons (Voice, Video), Pin, Add Friend.
    - Chat Area.
    - Profile Sidebar (optional toggle).
- **Group DM**:
    - Header: Group name, Member list toggle.
    - Instant Invite to group.

### Server View (`/channels/:guildId`)
- **Channel Sidebar**:
    - Server Header (Dropdown menu).
    - Boost Progress Bar (optional).
    - Categories & Channels (Text, Voice, Announcement, Forum, Stage).
    - User Control Panel (Voice connection info, Profile mini-card).
- **Text Channel** (`.../:channelId`):
    - Header: Name, Topic, Threads, Pins, Notes.
    - Message Area: Messages, Embeds, Attachments, System messages.
    - Member List (Right sidebar): Grouped by roles.
- **Voice Channel** (UI State):
    - Grid view of avatars.
    - Screen share streams.
    - Activities (Embedded games/apps).
- **Forum Channel**:
    - List/Grid of posts (threads).
    - Search/Filter tags.
    - Create Post modal.

---

## 3. User Settings (Overlay/Modal)

Accessed via the "Cog" icon in User Control Panel.

### User Settings > Account Settings
1.  **My Account**:
    - Profile Banner color/image.
    - Edit: Display Name, Username, Email, Phone.
    - Password Change.
    - 2FA Enable/Disable.
    - Account Removal (Disable/Delete).
2.  **Profiles**:
    - User Profile (Avatar, Banner, About Me, Theme Colors).
    - Server Profiles (Per-server Nickname/Avatar).
3.  **Privacy & Safety**:
    - Explicit Media Filters.
    - DM Spam Filters.
    - Server Privacy Defaults (Allow DMs, Activity Status).
    - Data usage & collection toggles.
4.  **Family Center**: Activity summary for parents.
5.  **Authorized Apps**: List of connected bots/apps.
6.  **Devices**: Active sessions management.
7.  **Connections**: Linked accounts (Steam, Spotify, Twitch, etc.).
8.  **Friend Requests**: Who can add you (Everyone, Friends of Friends, Server Members).

### User Settings > Billing Settings
9.  **Nitro**: Subscription promo page.
10. **Server Boosts**: Manage active boosts.
11. **Subscriptions**: Active billing plans.
12. **Gift Inventory**: Redeemed codes/gifts.
13. **Billing**: Payment methods, Transaction history.

### User Settings > App Settings
14. **Appearance**:
    - Theme (Dark, Light, Sync with OS).
    - Message Display (Cozy, Compact).
    - Chat Font Scaling.
    - Zoom Level.
15. **Accessibility**:
    - Saturation, Reduced Motion.
    - Sticker Animation control.
    - Contrast settings.
16. **Voice & Video**:
    - Input/Output Device selection.
    - Input Mode (Voice Activity vs PTT).
    - Video Camera selection / Backgrounds.
    - Advanced: Echo Cancellation, Noise Suppression (Krisp), Attenuation.
17. **Text & Images**:
    - Display images/videos inline.
    - Link previews.
    - Emoji/Sticker interactions.
18. **Notifications**:
    - Enable Desktop Notifications.
    - Push Notification Inactive Timeout.
    - Sound toggles (Mute, Deafen, User Join/Leave, PTT activate).
19. **Keybinds**: Custom keyboard shortcuts.
20. **Language**: App language selection.
21. **Streamer Mode**: Hide sensitive info relative to OBS/XSplit.
22. **Advanced**: Developer Mode, Hardware Acceleration.

### User Settings > Activity Settings
23. **Activity Privacy**: Share activity status.
24. **Registered Games**: Manually add/edit detected games.

---

## 4. Server Settings (Full Page View)

Accessed via Server Header Dropdown > Server Settings. Only for Admins/Owners.

1.  **Overview**: Server Name, Icon, Banner, Splash, Description, Inactive Channel setup.
2.  **Roles**:
    - Create/Order Roles.
    - Permissions Editor (Clear permissions vs permissions).
    - Display separately toggle.
    - Generic/Cosmetic settings (Color, Icon).
3.  **Emoji**: Upload custom emojis.
4.  **Stickers**: Upload custom stickers.
5.  **Soundboard**: Upload custom sounds.
6.  **Widget**: HTML embed code for websites.
7.  **Server Template**: Generate link to clone server structure.
8.  **Custom Invite Link**: (Vanity URL management).
9.  **Apps > Integrations**: Webhooks, Bots, Channels followed.
10. **Apps > App Directory**: Search/Add bots.
11. **Safety Setup**:
    - Verification Level (None, Low, Medium, High, Highest).
    - Content Moderation (Media filters).
12. **AutoMod**: Keyword filters, Spam block rules.
13. **Audit Log**: History of admin actions (Filter by user/action).
14. **Bans**: List of banned users, Unban option.

### User Management
15. **Members**: List all members, Search, Kick/Ban/Prune.
16. **Invites**: List active invite links (Creator, Uses, Expiry).

---

## 5. Other Full-Page or Complex Modal Views

- **Channel Settings** (Overlay):
    - Overview (Name, Topic, Slowmode).
    - Permissions (Role overrides).
    - Invites (Channel specific).
    - Integrations (Webhooks).
- **Create Server Modal**:
    - Templates (Gaming, School, Friends).
    - "For me and friends" vs "Community".
    - Upload Icon + Name.
- **Invite People Modal**:
    - Search friends.
    - Copy link.
    - Edit link settings (Expires after X, Max uses).
- **Search Popout**:
    - Filters: `from:`, `mentions:`, `has:`, `before:`, `during:`, `after:`.
    - Recent searches.
- **Inbox (Bell Icon)**:
    - Mentions tab.
    - Unread tab.
    - For You (Highlights).
- **Pinned Messages**: Sidebar content.
- **Threads Popout**: List of active threads in channel.
