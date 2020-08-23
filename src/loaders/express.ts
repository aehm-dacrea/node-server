import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api';

export default ({ app }: { app: express.Application }): void => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.set('trust proxy', 1);

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
