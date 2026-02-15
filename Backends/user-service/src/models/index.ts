import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  displayName?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  status: 'online' | 'offline' | 'away' | 'dnd';
  customStatus?: string;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    displayName: { type: String, maxlength: 32 },
    avatarUrl: { type: String },
    bannerUrl: { type: String },
    bio: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ['online', 'offline', 'away', 'dnd'],
      default: 'offline',
    },
    customStatus: { type: String, maxlength: 128 },
  },
  { timestamps: { createdAt: false, updatedAt: true }, collection: 'user_profiles' }
);

export const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

export interface IFriendship extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  friendId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const FriendshipSchema = new Schema<IFriendship>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    friendId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      required: true,
      default: 'pending',
    },
  },
  { timestamps: true, collection: 'friendships' }
);

FriendshipSchema.index({ userId: 1, friendId: 1 }, { unique: true });

export const Friendship = mongoose.model<IFriendship>('Friendship', FriendshipSchema);

export interface IUserBlock extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  blockedUserId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const UserBlockSchema = new Schema<IUserBlock>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    blockedUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: 'user_blocks' }
);

UserBlockSchema.index({ userId: 1, blockedUserId: 1 }, { unique: true });

export const UserBlock = mongoose.model<IUserBlock>('UserBlock', UserBlockSchema);
