import mongoose, { Schema, Document } from 'mongoose';

export interface IOAuthAccount extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  provider: 'google' | 'github' | 'discord';
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt: Date;
}

const OAuthAccountSchema = new Schema<IOAuthAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ['google', 'github', 'discord'],
    },
    providerId: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'oauth_accounts',
  }
);

// Compound index for provider and providerId
OAuthAccountSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export const OAuthAccount = mongoose.model<IOAuthAccount>('OAuthAccount', OAuthAccountSchema);
