import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("Couldn't find .env file");
}

export default {
  port: parseInt(process.env.PORT, 10),
  logs: { level: process.env.LOG_LEVEL || 'silly' },
  databaseURL: process.env.MONGODB_URI,
  testDatabaseURL: process.env.MONGODB_TEST_URI,
  secret: process.env.SECRET,
  jwtSecret: process.env.JWT_SECRET,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenLife: parseInt(process.env.ACCESS_TOKEN_LIFE),
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenLife: parseInt(process.env.REFRESH_TOKEN_LIFE),
};
