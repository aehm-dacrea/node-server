import express from 'express';
import config from './config';

(async () => {
  const app = express();

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
      return;
    }
    console.log(`Server listening on port ${config.port}`);
  });
})();
