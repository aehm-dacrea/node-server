import expressLoader from './express';
import mongooseLoader from './mongoose';
import Logger from './logger';
import config from '../config';

export default async ({ expressApp }) => {
  await expressLoader({ app: expressApp });
  Logger.info('Express Loaded');
  await mongooseLoader(config.databaseURL);
  Logger.info('Mongoose Loaded');
};
