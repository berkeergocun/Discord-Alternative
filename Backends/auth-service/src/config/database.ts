import mongoose from 'mongoose';
import Redis from 'ioredis';

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:discord_admin_pass@localhost:27017/discord?authSource=admin';
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB connected successfully');
    
    // Event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const connectRedis = () => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || 'discord_redis_pass',
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
  });

  redis.on('close', () => {
    console.warn('⚠️  Redis connection closed');
  });

  return redis;
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
};
