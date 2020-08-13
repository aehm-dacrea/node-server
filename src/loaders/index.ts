import expressLoader from './express';
import mongooseLoader from './mongoose';
import telegramBot from './telegramBot';

export default async ({ expressApp }) => {
  await expressLoader({ app: expressApp });
  await mongooseLoader();
  await telegramBot();
};
