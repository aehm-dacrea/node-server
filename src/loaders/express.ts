import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import routes from '../api';
import config from '../config';

export default ({ app }: { app: express.Application }): void => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(cors());
  app.use(bodyParser.json());
  app.set('trust proxy', 1);
  app.use(
    session({
      secret: config.secret,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(routes());

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
