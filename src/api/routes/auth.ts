import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import Logger from '../../loaders/logger';
import { Auth } from '../../services/auth';
import { IUserInputDTO } from '../../interfaces/IUser';

const route = Router();

export default (app: Router): void => {
  app.use('/auth', route);

  route.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    Logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
    try {
      const { user, token } = await Auth.SignUp(req.body as IUserInputDTO);
      return res.status(201).json({ user, token });
    } catch (e) {
      Logger.error('error: %o', e);
      return next(e);
    }
  });

  route.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
    Logger.debug('Calling Sign-In endpoint with body: %o', req.body);
    try {
      const { email, password } = req.body;
      const { user, token } = await Auth.SignIn(email, password);
      return res.json({ user, token }).status(200);
    } catch (e) {
      Logger.error('error: %o', e);
      return next(e);
    }
  });

  route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
    Logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
    Logger.debug('Calling Sign-Out endpoint with token: %o', req.token);
    try {
      return res.status(200).end();
    } catch (e) {
      Logger.error('error %o', e);
      return next(e);
    }
  });
};
