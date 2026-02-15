import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  channelId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
  type: 'default' | 'reply' | 'system';
  replyToId?: mongoose.Types.ObjectId;
  edited: boolean;
  pinned: boolean;
  mentionEveryone: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    channelId: { type: Schema.Types.ObjectId, ref: 'Channel', required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, maxlength: 4000 },
    type: { type: String, enum: ['default', 'reply', 'system'], default: 'default' },
    replyToId: { type: Schema.Types.ObjectId, ref: 'Message' },
    edited: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    mentionEveryone: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'messages' }
);

MessageSchema.index({ channelId: 1, createdAt: -1 });
export const Message = mongoose.model<IMessage>('Message', MessageSchema);

export interface IMessageAttachment extends Document {
  messageId: mongoose.Types.ObjectId;
  filename: string;
  url: string;
  size: number;
  contentType: string;
}

const MessageAttachmentSchema = new Schema<IMessageAttachment>(
  {
    messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true, index: true },
    filename: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    contentType: { type: String, required: true },
  },
  { collection: 'message_attachments' }
);

export const MessageAttachment = mongoose.model<IMessageAttachment>('MessageAttachment', MessageAttachmentSchema);

export interface IMessageReaction extends Document {
  messageId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  emoji: string;
}

const MessageReactionSchema = new Schema<IMessageReaction>(
  {
    messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    emoji: { type: String, required: true },
  },
  { collection: 'message_reactions' }
);

MessageReactionSchema.index({ messageId: 1, userId: 1, emoji: 1 }, { unique: true });
export const MessageReaction = mongoose.model<IMessageReaction>('MessageReaction', MessageReactionSchema);

export interface IDMChannel extends Document {
  _id: mongoose.Types.ObjectId;
  type: 'dm' | 'group';
  name?: string;
  ownerId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const DMChannelSchema = new Schema<IDMChannel>(
  {
    type: { type: String, enum: ['dm', 'group'], required: true },
    name: { type: String, maxlength: 100 },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: 'dm_channels' }
);

export const DMChannel = mongoose.model<IDMChannel>('DMChannel', DMChannelSchema);

export interface IDMChannelRecipient extends Document {
  channelId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const DMChannelRecipientSchema = new Schema<IDMChannelRecipient>(
  {
    channelId: { type: Schema.Types.ObjectId, ref: 'DMChannel', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { collection: 'dm_channel_recipients' }
);

DMChannelRecipientSchema.index({ channelId: 1, userId: 1 }, { unique: true });
DMChannelRecipientSchema.index({ userId: 1, channelId: 1 });
export const DMChannelRecipient = mongoose.model<IDMChannelRecipient>('DMChannelRecipient', DMChannelRecipientSchema);
