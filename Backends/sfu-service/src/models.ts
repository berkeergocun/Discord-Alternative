import mongoose, { Schema, Document } from 'mongoose';

export interface IVoiceSession extends Document {
  _id: mongoose.Types.ObjectId;
  channelId: mongoose.Types.ObjectId;
  guildId: mongoose.Types.ObjectId;
  routerId: string;
  createdAt: Date;
}

const VoiceSessionSchema = new Schema<IVoiceSession>(
  {
    channelId: { type: Schema.Types.ObjectId, ref: 'Channel', required: true, unique: true },
    guildId: { type: Schema.Types.ObjectId, ref: 'Guild', required: true, index: true },
    routerId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: 'voice_sessions' }
);

export const VoiceSession = mongoose.model<IVoiceSession>('VoiceSession', VoiceSessionSchema);

export interface IVoiceParticipant extends Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  transportId: string;
  producerIds: string[];
  consumerIds: string[];
  muted: boolean;
  deafened: boolean;
  video: boolean;
  screenshare: boolean;
  joinedAt: Date;
}

const VoiceParticipantSchema = new Schema<IVoiceParticipant>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'VoiceSession', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    transportId: { type: String, required: true },
    producerIds: [{ type: String }],
    consumerIds: [{ type: String }],
    muted: { type: Boolean, default: false },
    deafened: { type: Boolean, default: false },
    video: { type: Boolean, default: false },
    screenshare: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
  },
  { collection: 'voice_participants' }
);

VoiceParticipantSchema.index({ sessionId: 1, userId: 1 }, { unique: true });
export const VoiceParticipant = mongoose.model<IVoiceParticipant>('VoiceParticipant', VoiceParticipantSchema);
