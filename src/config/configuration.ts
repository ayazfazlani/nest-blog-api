// src/config/configuration.ts
export default () => ({
    port: parseInt(process.env.PORT ?? "3000", 10),
    database: {
      uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/blog',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
  });