import { Router, Request, Response, NextFunction } from 'express';

const route = Router();

export default (app: Router) => {
  app.use(route);

  route.post('/auth', async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('[auth]', req.body);
      return res.status(201);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  });
};
