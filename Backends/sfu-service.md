# SFU Service API Documentation

**Base URL**: `http://localhost:3006`  
**Port**: 3006

SFU (Selective Forwarding Unit) Service handles real-time voice and video streaming using Mediasoup WebRTC SFU.

## Architecture

SFU Service uses **Mediasoup** for WebRTC media routing:
- Multiple workers for load distribution
- One router per voice channel
- WebRTC transports for each participant
- Producers for sending media (audio/video)
- Consumers for receiving media from others

## Connection Flow

1. **Join Channel**: `POST /channels/:channelId/voice/join` - Get RTP capabilities
2. **Create Transports**: `POST /channels/:channelId/voice/transport` - Create send/recv transports
3. **Connect Transport**: `POST /transports/:transportId/connect` - Connect with DTLS parameters
4. **Produce**: `POST /transports/:transportId/produce` - Start sending audio/video
5. **Consume**: `POST /channels/:channelId/voice/consume` - Receive media from other participants
6. **Leave**: `DELETE /channels/:channelId/voice/@me` - Disconnect from channel

## Endpoints

### Voice Channel
- `GET /channels/:channelId/voice/capabilities` - Get router RTP capabilities
- `POST /channels/:channelId/voice/join` - Join voice channel
- `DELETE /channels/:channelId/voice/@me` - Leave voice channel
- `GET /channels/:channelId/voice/participants` - Get active participants

### Transport Management
- `POST /channels/:channelId/voice/transport` - Create WebRTC transport
- `POST /transports/:transportId/connect` - Connect transport with DTLS
- `POST /transports/:transportId/produce` - Start producing media (audio/video)
- `POST /channels/:channelId/voice/consume` - Consume media from producer

### Voice State
- `PATCH /channels/:channelId/voice/@me` - Update voice state (mute, video, screenshare)

## Request/Response Examples

### Join Voice Channel
```json
POST /channels/:channelId/voice/join
Authorization: Bearer <token>

Response:
{
  "sessionId": "session_id",
  "rtpCapabilities": { /* Router RTP capabilities */ }
}
```

### Create Transport
```json
POST /channels/:channelId/voice/transport
Authorization: Bearer <token>
{
  "producing": true,
  "consuming": false
}

Response:
{
  "id": "transport_id",
  "iceParameters": { /* ICE params */ },
  "iceCandidates": [ /* ICE candidates */ ],
  "dtlsParameters": { /* DTLS params */ }
}
```

### Update Voice State
```json
PATCH /channels/:channelId/voice/@me
Authorization: Bearer <token>
{
  "muted": true,
  "video": false,
  "screenshare": false
}
```

## MongoDB Collections

- `voice_sessions`: Active voice channel sessions with router IDs
- `voice_participants`: Users in voice channels with media state

## Configuration

### Environment Variables
- `ANNOUNCED_IP`: Public IP for WebRTC (required for external access)
- `RTC_MIN_PORT`: Min port for RTP (default: 10000)
- `RTC_MAX_PORT`: Max port for RTP (default: 20000)

### Mediasoup Codecs
- **Audio**: Opus @ 48kHz, 2 channels
- **Video**: VP8 @ 90kHz (H.264 optional)

## Scaling Considerations

1. **Multiple Workers**: Distribute load across CPU cores
2. **Horizontal Scaling**: Run multiple SFU instances with load balancer
3. **Redis State**: Store session state in Redis for multi-instance coordination
4. **Port Ranges**: Configure sufficient RTC port ranges (1000+ ports per worker)

## Client Implementation

Use `mediasoup-client` library:
```javascript
import { Device } from 'mediasoup-client';

const device = new Device();
const rtpCapabilities = await fetch('/channels/:id/voice/capabilities').then(r => r.json());
await device.load({ routerRtpCapabilities: rtpCapabilities });

// Create send transport
const transport = await fetch('/channels/:id/voice/transport', {
  method: 'POST',
  body: JSON.stringify({ producing: true, consuming: false })
}).then(r => r.json());

const sendTransport = device.createSendTransport(transport);
// ... connect and produce
```

## Features

- ✅ Voice chat (Opus codec)
- ✅ Video chat (VP8 codec)
- ✅ Screen sharing
- ✅ Mute/Unmute
- ✅ Video on/off
- ✅ Multiple participants per channel
- ✅ Low latency WebRTC streaming
