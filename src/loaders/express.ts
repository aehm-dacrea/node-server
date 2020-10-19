import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routes from '../api';
import Logger from './logger';
import middlewares from '../api/middlewares';

export default ({ app }: { app: express.Application }): void => {
  app.get('/status', middlewares.isAuth, (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.set('trust proxy', 1);

  app.use(routes());

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(async (err, req: Request, res: Response, next: NextFunction) => {
    if (err.message == 'jwt must be provided') {
      err.status = 403;
    } else if (err.name == ('JsonWebTokenError' || 'NotBeforeError')) {
      err.status = 401;
    }
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err,
      },
    });
    Logger.debug(err);
  });
};
