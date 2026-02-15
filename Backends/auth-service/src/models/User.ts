import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
  passwordHash: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
