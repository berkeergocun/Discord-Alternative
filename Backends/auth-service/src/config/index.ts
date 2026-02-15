export const config = {
  port: parseInt(process.env.AUTH_SERVICE_PORT || '3001'),
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://admin:discord_admin_pass@localhost:27017/discord?authSource=admin',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || 'discord_redis_pass',
  },
  
  bcrypt: {
    saltRounds: 12,
  },
  
  environment: process.env.NODE_ENV || 'development',
};
