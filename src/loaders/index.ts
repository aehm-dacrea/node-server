import expressLoader from './express';
import mongooseLoader from './mongoose';
import apolloLoader from './apollo';
import Logger from './logger';
import config from '../config';

export default async ({ expressApp }) => {
  await apolloLoader({ app: expressApp });
  Logger.info('Apollo Loaded');
  await expressLoader({ app: expressApp });
  Logger.info('Express Loaded');
  await mongooseLoader(config.databaseURL);
  Logger.info('Mongoose Loaded');
};
