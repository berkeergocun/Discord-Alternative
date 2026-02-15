import bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import { config } from '../config';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema';
import type Redis from 'ioredis';
import mongoose from 'mongoose';

export class AuthService {
  constructor(private redis: Redis, private jwtSecret: string) {}

  async register(data: RegisterInput) {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new Error('Email already in use');
      }
      if (existingUser.username === data.username) {
        throw new Error('Username already taken');
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, config.bcrypt.saltRounds);

    // Create user
    const user = await User.create({
      email: data.email,
      username: data.username,
      passwordHash,
      emailVerified: false,
      twoFactorEnabled: false,
    });

    // Generate email verification token (stored in Redis)
    const verificationToken = this.generateRandomToken();
    await this.redis.setex(
      `email_verify:${verificationToken}`,
      3600, // 1 hour expiry
      user._id.toString()
    );

    return {
      user: this.sanitizeUser(user),
      verificationToken,
    };
  }

  async login(data: LoginInput) {
    // Find user by email
    const user = await User.findOne({ email: data.email });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      if (!data.twoFactorCode) {
        return {
          requires2FA: true,
          userId: user._id.toString(),
        };
      }

      // Verify 2FA code
      const isValid = authenticator.verify({
        token: data.twoFactorCode,
        secret: user.twoFactorSecret!,
      });

      if (!isValid) {
        throw new Error('Invalid 2FA code');
      }
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user._id.toString());

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      requires2FA: false,
    };
  }

  async logout(userId: string, refreshToken: string) {
    // Remove refresh token from database
    await RefreshToken.deleteOne({ token: refreshToken, userId: new mongoose.Types.ObjectId(userId) });

    // Add access token to blacklist (if provided via header)
    // This would require the actual access token to be passed
    // For now, we just remove the refresh token

    return { success: true };
  }

  async refreshAccessToken(refreshTokenString: string) {
    // Find refresh token
    const refreshTokenDoc = await RefreshToken.findOne({
      token: refreshTokenString,
    });

    if (!refreshTokenDoc) {
      throw new Error('Invalid refresh token');
    }

    // Check if expired
    if (refreshTokenDoc.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ _id: refreshTokenDoc._id });
      throw new Error('Refresh token expired');
    }

    // Generate new access token
    const accessToken = await this.generateAccessToken(refreshTokenDoc.userId.toString());

    return { accessToken };
  }

  async verifyEmail(token: string) {
    // Get userId from Redis
    const userId = await this.redis.get(`email_verify:${token}`);

    if (!userId) {
      throw new Error('Invalid or expired verification token');
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { emailVerified: true },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Delete token from Redis
    await this.redis.del(`email_verify:${token}`);

    return { success: true, user: this.sanitizeUser(user) };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return { success: true };
    }

    // Generate reset token
    const resetToken = this.generateRandomToken();
    await this.redis.setex(
      `password_reset:${resetToken}`,
      3600, // 1 hour expiry
      user._id.toString()
    );

    return { success: true, resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    // Get userId from Redis
    const userId = await this.redis.get(`password_reset:${token}`);

    if (!userId) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);

    // Update user
    await User.findByIdAndUpdate(userId, { passwordHash });

    // Delete token from Redis
    await this.redis.del(`password_reset:${token}`);

    // Invalidate all refresh tokens for this user
    await RefreshToken.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });

    return { success: true };
  }

  async enable2FA(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.twoFactorEnabled) {
      throw new Error('2FA is already enabled');
    }

    // Generate secret
    const secret = authenticator.generateSecret();

    // Store secret temporarily (not enabled yet)
    await this.redis.setex(`2fa_pending:${userId}`, 600, secret); // 10 minutes

    // Generate QR code URL
    const otpauthUrl = authenticator.keyuri(user.email, 'Discord Alternative', secret);

    return {
      secret,
      otpauthUrl,
    };
  }

  async verify2FA(userId: string, code: string) {
    // Get pending secret
    const secret = await this.redis.get(`2fa_pending:${userId}`);

    if (!secret) {
      throw new Error('No pending 2FA setup found');
    }

    // Verify code
    const isValid = authenticator.verify({ token: code, secret });

    if (!isValid) {
      throw new Error('Invalid 2FA code');
    }

    // Enable 2FA
    await User.findByIdAndUpdate(userId, {
      twoFactorEnabled: true,
      twoFactorSecret: secret,
    });

    // Delete pending secret
    await this.redis.del(`2fa_pending:${userId}`);

    return { success: true };
  }

  async disable2FA(userId: string, code: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.twoFactorEnabled) {
      throw new Error('2FA is not enabled');
    }

    // Verify code
    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret!,
    });

    if (!isValid) {
      throw new Error('Invalid 2FA code');
    }

    // Disable 2FA
    await User.findByIdAndUpdate(userId, {
      twoFactorEnabled: false,
      twoFactorSecret: undefined,
    });

    return { success: true };
  }

  async validateToken(token: string): Promise<{ userId: string; valid: boolean }> {
    // This would use JWT verification in a real implementation
    // For now, we'll implement a basic check
    try {
      // Check if token is blacklisted
      const isBlacklisted = await this.redis.exists(`blacklist:${token}`);
      if (isBlacklisted) {
        return { userId: '', valid: false };
      }

      // In real implementation, decode and verify JWT here
      // For now, return a placeholder
      return { userId: 'user_id_from_token', valid: true };
    } catch (error) {
      return { userId: '', valid: false };
    }
  }

  private async generateTokens(userId: string) {
    const accessToken = await this.generateAccessToken(userId);
    const refreshToken = this.generateRandomToken();

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await RefreshToken.create({
      userId: new mongoose.Types.ObjectId(userId),
      token: refreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(userId: string) {
    // In real implementation, use JWT library
    // For now, return a placeholder
    const token = `access_${userId}_${Date.now()}`;
    return token;
  }

  private generateRandomToken(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  private sanitizeUser(user: any) {
    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
