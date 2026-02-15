import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { bearer } from '@elysiajs/bearer';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { connectDatabase, connectRedis } from './config/database';
import { config } from './config';
import { AuthService } from './services/auth.service';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  enable2FASchema,
  verify2FASchema,
} from './schemas/auth.schema';

// Connect to databases
await connectDatabase();
const redis = connectRedis();

// Initialize auth service
const authService = new AuthService(redis, config.jwt.secret);

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Auth Service API',
          version: '1.0.0',
          description: 'Authentication and authorization service for Discord Alternative',
        },
        tags: [
          { name: 'auth', description: 'Authentication endpoints' },
          { name: '2fa', description: 'Two-factor authentication endpoints' },
          { name: 'health', description: 'Health check endpoints' },
        ],
      },
    })
  )
  .use(
    jwt({
      name: 'jwt',
      secret: config.jwt.secret,
    })
  )
  .use(bearer())

  // Health check
  .get(
    '/health',
    () => ({
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    }),
    {
      detail: {
        tags: ['health'],
        summary: 'Health check',
        description: 'Check if the service is running',
      },
    }
  )

  // Register
  .post(
    '/auth/register',
    async ({ body }) => {
      try {
        const result = await authService.register(body);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        username: t.String({ minLength: 3, maxLength: 32 }),
        password: t.String({ minLength: 8 }),
      }),
      detail: {
        tags: ['auth'],
        summary: 'Register new user',
        description: 'Create a new user account',
      },
    }
  )

  // Login
  .post(
    '/auth/login',
    async ({ body }) => {
      try {
        const result = await authService.login(body);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
        twoFactorCode: t.Optional(t.String()),
      }),
      detail: {
        tags: ['auth'],
        summary: 'User login',
        description: 'Authenticate user and return tokens',
      },
    }
  )

  // Logout
  .post(
    '/auth/logout',
    async ({ bearer, body }) => {
      if (!bearer) {
        return {
          success: false,
          error: 'Unauthorized',
        };
      }

      try {
        // Extract userId from token (in real implementation)
        const userId = 'user_id_from_token'; // TODO: Extract from JWT
        const result = await authService.logout(userId, body.refreshToken);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        refreshToken: t.String(),
      }),
      detail: {
        tags: ['auth'],
        summary: 'User logout',
        description: 'Invalidate user tokens',
      },
    }
  )

  // Refresh token
  .post(
    '/auth/refresh',
    async ({ body }) => {
      try {
        const result = await authService.refreshAccessToken(body.refreshToken);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        refreshToken: t.String(),
      }),
      detail: {
        tags: ['auth'],
        summary: 'Refresh access token',
        description: 'Get a new access token using refresh token',
      },
    }
  )

  // Verify email
  .post(
    '/auth/verify-email',
    async ({ body }) => {
      try {
        const result = await authService.verifyEmail(body.token);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        token: t.String(),
      }),
      detail: {
        tags: ['auth'],
        summary: 'Verify email',
        description: 'Verify user email address',
      },
    }
  )

  // Forgot password
  .post(
    '/auth/forgot-password',
    async ({ body }) => {
      try {
        const result = await authService.forgotPassword(body.email);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
      detail: {
        tags: ['auth'],
        summary: 'Forgot password',
        description: 'Request password reset',
      },
    }
  )

  // Reset password
  .post(
    '/auth/reset-password',
    async ({ body }) => {
      try {
        const result = await authService.resetPassword(body.token, body.newPassword);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        token: t.String(),
        newPassword: t.String({ minLength: 8 }),
      }),
      detail: {
        tags: ['auth'],
        summary: 'Reset password',
        description: 'Reset user password using reset token',
      },
    }
  )

  // Enable 2FA
  .post(
    '/auth/2fa/enable',
    async ({ bearer }) => {
      if (!bearer) {
        return {
          success: false,
          error: 'Unauthorized',
        };
      }

      try {
        // Extract userId from token (in real implementation)
        const userId = 'user_id_from_token'; // TODO: Extract from JWT
        const result = await authService.enable2FA(userId);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      detail: {
        tags: ['2fa'],
        summary: 'Enable 2FA',
        description: 'Enable two-factor authentication',
      },
    }
  )

  // Verify 2FA setup
  .post(
    '/auth/2fa/verify',
    async ({ bearer, body }) => {
      if (!bearer) {
        return {
          success: false,
          error: 'Unauthorized',
        };
      }

      try {
        // Extract userId from token (in real implementation)
        const userId = 'user_id_from_token'; // TODO: Extract from JWT
        const result = await authService.verify2FA(userId, body.code);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        code: t.String({ minLength: 6, maxLength: 6 }),
      }),
      detail: {
        tags: ['2fa'],
        summary: 'Verify 2FA setup',
        description: 'Verify and complete 2FA setup',
      },
    }
  )

  // Disable 2FA
  .post(
    '/auth/2fa/disable',
    async ({ bearer, body }) => {
      if (!bearer) {
        return {
          success: false,
          error: 'Unauthorized',
        };
      }

      try {
        // Extract userId from token (in real implementation)
        const userId = 'user_id_from_token'; // TODO: Extract from JWT
        const result = await authService.disable2FA(userId, body.code);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        code: t.String({ minLength: 6, maxLength: 6 }),
      }),
      detail: {
        tags: ['2fa'],
        summary: 'Disable 2FA',
        description: 'Disable two-factor authentication',
      },
    }
  )

  .listen(config.port);

console.log(`🦊 Auth Service is running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 Swagger documentation: http://${app.server?.hostname}:${app.server?.port}/swagger`);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await redis.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await redis.quit();
  process.exit(0);
});
