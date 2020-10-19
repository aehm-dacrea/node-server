/* eslint-disable @typescript-eslint/no-unused-vars */
import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IMessage } from '../../interfaces/IMessage';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
      token: unknown;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type MessageModel = Model<IMessage & Document>;
  }
}
