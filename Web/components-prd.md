# Components PRD - Discord Clone

## 1. Atoms & Primitives
- **TypeTypography**: Consistently styled headers, text, labels matching Discord's specific font weights/colors.
- **BrandColors**: Defined palette (Blurple, Green, Yellow, Red, Grey-100 to Grey-900).
- **Icons**: Lucide or Heroicons mapped to Discord equivalents.
- **Avatars**:
    - `Avatar`: Standard user circle.
    - `ServerIcon`: Rounded rect with hover transition.
    - `GroupIcon`: Double avatar overlay.
- **Badges**:
    - `NotificationBadge`: Red pill with number.
    - `StatusIndicator`: Green/Yellow/Red/Grey dot with cutout.
    - `RoleIcon`: Small SVG next to name.
- **Inputs**:
    - `ChatInput`: Complex textarea with slate backend.
    - `SearchInput`: Small, expandable.
    - `SettingsInput`: Standard form fields with labels/error states.

## 2. Navigation Components
- **ServerRail**:
    - `ServerItem`: Draggable, Hover effects, Active white pill.
    - `FolderItem`: Collapsed group of servers.
    - `AddServerButton`: Green circle transition.
    - `ExploreButton`: Compass icon.
- **Sidebar (Context Aware)**:
    - `SidebarHeader`: Dropdown menu trigger (Server name) or Search bar (DM).
    - `SidebarScroller`: Custom scroll container.
    - `UserPanel`: Fixed bottom bar with Mic/Deafen/Settings controls.

## 3. Channel List Components
- **CategoryHeader**: Uppercase, bold, small, collapsible chevron.
- **ChannelItem**:
    - Text: `#` icon, Name, Unread white text.
    - Voice: Speaker icon, Name, listed User avatars below if active.
    - Thread: Spine line connecting to parent.
    - Locked/NSFW icons.

## 4. Chat Area Components
- **MessageList**:
    - `MessageGroup`: Container for coalesced messages.
    - `Message`:
        - `MessageHeader`: Avatar, Name (Clickable popout), Time.
        - `MessageContent`: Markdown renderer, syntax highlighting, custom emoji.
        - `Embed`: Link previews, YouTube player, Image/Video gallery.
        - `Reactions`: Row of emoji reactions with counters.
        - `ReplyPreview`: Small curved line above message indicating reply.
- **InputArea**:
    - `TypingIndicator`: "User is typing..." bottom bar.
    - `UploadButton`: File picker.
    - `Sticker/Emoji/Gift` buttons.
    - `SlashCommandAutocomplete`: Popover menu when typing `/`.

## 5. Member List Components
- **MemberSection**: Role header.
- **MemberItem**: 
    - Display Name vs Username logic.
    - Rich Presence text ("Playing Minecraft").
    - Bot tag (blue "BOT" badge).
    - Mobile indicator icon.

## 6. Settings Components
- **SettingsSidebar**: Vertical tab list, grouped headers.
- **SettingsPane**:
    - `RadioGroup`: Card selection styling (e.g., Theme picker).
    - `ToggleSwitch`: Green/Grey sliders.
    - `Slider`: Volume sliders with grab handle.
    - `ColorPicker`: For custom role/profile colors.
    - `KeybindRecorder`: Input that listens for key presses.

## 7. Modal System
- **ModalRoot**: Backdrop blur, center alignment.
- **ModalContent**:
    - `CreateServer`: Templates grid, Upload form.
    - `Invite`: Friend list with "Invite" buttons, Link copy.
    - `UserProfile`: Full profile card with banner, badging, "Note" field.
    - `ServerSettings`: (Often full screen, but technically a modal layer).

## 8. Popouts/Flyouts
- **UserPopout**: Mini profile on click (Avatar, Roles, "Message" input).
- **EmojiPicker**: Tabs for servers, search bar, huge grid.
- **ContextMenus**: Right-click menus (custom styled, not native browser menu).
- **QuickSwitcher` (Cmd+K): Search bar for jumping to channels/users.
