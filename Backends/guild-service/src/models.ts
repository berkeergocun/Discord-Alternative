import mongoose, { Schema, Document } from 'mongoose';

export interface IGuild extends Document {
  name: string;
  description?: string;
  iconUrl?: string;
  bannerUrl?: string;
  ownerId: mongoose.Types.ObjectId;
  region: string;
  verificationLevel: number;
  vanityUrlCode?: string;
}

const GuildSchema = new Schema<IGuild>(
  {
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    iconUrl: { type: String },
    bannerUrl: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    region: { type: String, default: 'us-east' },
    verificationLevel: { type: Number, default: 0 },
    vanityUrlCode: { type: String, unique: true, sparse: true },
  },
  { timestamps: true, collection: 'guilds' }
);

export const Guild = mongoose.model<IGuild>('Guild', GuildSchema);

export interface IChannel extends Document {
  guildId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  name: string;
  type: 'text' | 'voice' | 'category';
  topic?: string;
  position: number;
  nsfw: boolean;
}

const ChannelSchema = new Schema<IChannel>(
  {
    guildId: { type: Schema.Types.ObjectId, ref: 'Guild', required: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Channel' },
    name: { type: String, required: true, maxlength: 100 },
    type: { type: String, enum: ['text', 'voice', 'category'], required: true },
    topic: { type: String, maxlength: 1024 },
    position: { type: Number, default: 0 },
    nsfw: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'channels' }
);

export const Channel = mongoose.model<IChannel>('Channel', ChannelSchema);

export interface IRole extends Document {
  guildId: mongoose.Types.ObjectId;
  name: string;
  color?: string;
  permissions: string;
  position: number;
  mentionable: boolean;
}

const RoleSchema = new Schema<IRole>(
  {
    guildId: { type: Schema.Types.ObjectId, ref: 'Guild', required: true, index: true },
    name: { type: String, required: true, maxlength: 100 },
    color: { type: String },
    permissions: { type: String, default: '0' },
    position: { type: Number, default: 0 },
    mentionable: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'roles' }
);

export const Role = mongoose.model<IRole>('Role', RoleSchema);

export interface IGuildMember extends Document {
  guildId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  nickname?: string;
  joinedAt: Date;
}

const GuildMemberSchema = new Schema<IGuildMember>(
  {
    guildId: { type: Schema.Types.ObjectId, ref: 'Guild', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    nickname: { type: String, maxlength: 32 },
    joinedAt: { type: Date, default: Date.now },
  },
  { collection: 'guild_members' }
);

GuildMemberSchema.index({ guildId: 1, userId: 1 }, { unique: true });

export const GuildMember = mongoose.model<IGuildMember>('GuildMember', GuildMemberSchema);

export interface IInvite extends Document {
  code: string;
  guildId: mongoose.Types.ObjectId;
  channelId: mongoose.Types.ObjectId;
  inviterId: mongoose.Types.ObjectId;
  maxUses: number;
  uses: number;
  expiresAt?: Date;
}

const InviteSchema = new Schema<IInvite>(
  {
    code: { type: String, required: true, unique: true },
    guildId: { type: Schema.Types.ObjectId, ref: 'Guild', required: true, index: true },
    channelId: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
    inviterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    maxUses: { type: Number, default: 0 },
    uses: { type: Number, default: 0 },
    expiresAt: { type: Date },
  },
  { timestamps: true, collection: 'invites' }
);

export const Invite = mongoose.model<IInvite>('Invite', InviteSchema);
