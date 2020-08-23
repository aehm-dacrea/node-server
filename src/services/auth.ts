import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import Logger from '../loaders/logger';
import UserModel from '../models/user';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import config from '../config';

export default class AuthService {
  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
    try {
      const salt = randomBytes(32);

      Logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      Logger.silly('Creating user db record');
      const userRecord = await UserModel.create({
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword,
      });
      Logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new Error('User cannot be created');
      }
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user, token };
    } catch (err) {
      Logger.error(err);
      throw err;
    }
  }
  public async SignIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
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
        const token = this.generateToken(userRecord);

        const user = userRecord.toObject();
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        return { user, token };
      } else {
        throw new Error('Invalid password');
      }
    } catch (err) {
      Logger.error(err);
      throw err;
    }
  }
  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60000);
    const payload = {
      _id: user._id,
      role: user.role,
      name: user.name,
      exp: exp.getTime() / 1000,
    };

    Logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(payload, config.jwtSecret, { algorithm: 'HS256' });
  }
}

export const Auth = new AuthService();
