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
      const { user, accessToken } = await Auth.SignUp(req.body as IUserInputDTO);
      return res
        .cookie('jwt', accessToken, {
          secure: true,
          httpOnly: true,
          expires: new Date(Date.now() + 31556952000),
        })
        .json(user)
        .status(201)
        .send();
    } catch (e) {
      Logger.error('error: %o', e);
      return next(e);
    }
  });

  route.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
    Logger.debug('Calling Sign-In endpoint with body: %o', req.body);
    try {
      const { email, password } = req.body;
      const { user, accessToken } = await Auth.SignIn(email, password);
      return res
        .cookie('jwt', accessToken, {
          secure: true,
          httpOnly: true,
          expires: new Date(Date.now() + 31556952000),
        })
        .json(user)
        .status(200)
        .send();
    } catch (e) {
      Logger.error('error: %o', e);
      return next(e);
    }
  });

  route.post('/logout', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
    Logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
    Logger.debug('Calling Sign-Out endpoint with token: %o', req.token);
    Logger.debug('Calling Sign-Out endpoint with cookies: %o', req.cookies);
    try {
      await Auth.LogOut(req.body as IUserInputDTO);
    } catch (e) {
      Logger.error('error %o', e);
      return next(e);
    }
    return res.clearCookie('jwt', { secure: true, httpOnly: true }).status(200).end();
  });

  route.post('/test', middlewares.isAuth, (req: Request, res: Response) => {
    res.status(200).json({ message: 'middleware check has passed!' });
    Logger.debug('middleware check has passed!');
  });
};
