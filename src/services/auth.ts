import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import Logger from '../loaders/logger';
import UserModel from '../models/user';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import config from '../config';

export default class AuthService {
  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; accessToken: string }> {
    try {
      const salt = randomBytes(32);

      Logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      const user = {
        _id: new mongoose.Types.ObjectId(),
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword,
        refreshToken: '',
      };
      Logger.silly('Generating JWT');
      const accessToken = this.generateToken(user, false);
      user.refreshToken = this.generateToken(user, true);

      Logger.silly('Creating user db record');
      const userRecord = await UserModel.create(user);
      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      Reflect.deleteProperty(user, 'refreshToken');
      return { user, accessToken };
    } catch (err) {
      Logger.error(err);
      throw err;
    }
  }
  public async SignIn(email: string, password: string): Promise<{ user: IUser; accessToken: string }> {
    try {
      const userRecord = await UserModel.findOne({ email });
      if (!userRecord) {
        throw new Error('User not registered');
      }
      Logger.silly('Checking password');
      const validPassword = await argon2.verify(userRecord.password, password);
      if (validPassword) {
        Logger.silly('Password is valid!');
        Logger.silly('Generating JWT');
        const accessToken = this.generateToken(userRecord, false);
        userRecord.refreshToken = this.generateToken(userRecord, true);
        await userRecord.save();

        const user = userRecord.toObject();
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        Reflect.deleteProperty(user, 'refreshToken');
        return { user, accessToken };
      } else {
        throw new Error('Invalid password');
      }
    } catch (err) {
      Logger.error(err);
      throw err;
    }
  }

  public async LogOut(userInputDTO: IUserInputDTO): Promise<void> {
    try {
      const email = userInputDTO.email;
      Logger.debug(email);
      const userRecord = await UserModel.findOne({ email });
      if (!userRecord) {
        throw new Error('[LogOut] No such user, something went wrong');
      }
      userRecord.refreshToken = '';
      await userRecord.save();
    } catch (err) {
      Logger.error('[LogOut Service]', err);
      throw err;
    }
  }

  public generateToken(user: IUser, isRefreshToken: boolean) {
    const payload = {
      _id: user._id,
      role: user.role,
      name: user.name,
    };
    const expiresIn = isRefreshToken ? config.refreshTokenLife : config.accessTokenLife;
    const secret = isRefreshToken ? config.refreshTokenSecret : config.accessTokenSecret;

    Logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: expiresIn });
  }
}

export const Auth = new AuthService();
