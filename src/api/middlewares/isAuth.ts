import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../../models/user';
import { Auth } from '../../services/auth';
import config from '../../config';
import Logger from '../../loaders/logger';

// const getTokenFromHeader = (req) => {
//   if (
//     (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
//     (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
//   ) {
//     return req.headers.authorization.split(' ')[1];
//   }
//   return null;
// };

const getTokenFromCookie = (req: Request) => {
  if (req.cookies) {
    return req.cookies.jwt;
  }
  return null;
};

const getToken = (req: Request, newToken: string) => {
  if (newToken) {
    return newToken;
  }
  return getTokenFromCookie(req);
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
  callback: (req: Request, res: Response, next: NextFunction, newToken: string) => void,
) => {
  const user = jwt.decode(req.cookies.jwt);
  const userRecord = await UserModel.findById(user._id);
  if (!userRecord) {
    return next(new Error('[RefreshToken] user does not exist'));
  }
  if (!userRecord.refreshToken) {
    return res.status(401).send();
  }
  try {
    jwt.verify(userRecord.refreshToken, config.refreshTokenSecret);
  } catch (err) {
    return res.status(401).json(err);
  }
  const newToken = Auth.generateToken(userRecord, false);
  res.cookie('jwt', newToken, {
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 31556952000),
  });
  callback(req, res, next, newToken);
};

const isAuth = async (req: Request, res: Response, next: NextFunction, newToken = '') => {
  console.log('token: ', getToken(req, newToken));
  console.log('cookies: %o', req.cookies);
  const token = getToken(req, newToken);
  try {
    req.token = jwt.verify(token, config.accessTokenSecret);
  } catch (err) {
    if (err.name == 'TokenExpiredError') {
      Logger.silly('Token expired. Generating new one!');
      return await refreshToken(req, res, next, isAuth);
    }
    next(err);
  }
  next();
};

export default isAuth;
