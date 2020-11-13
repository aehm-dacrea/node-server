/* eslint-disable @typescript-eslint/no-unused-vars */
import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IMessage } from '../../interfaces/IMessage';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
      token: {
        _id: string;
        role: string;
        name: string;
        iat: string;
        exp: string;
      };
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type MessageModel = Model<IMessage & Document>;
  }
}
