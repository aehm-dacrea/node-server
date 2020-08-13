import { IUser } from './IUser';

export interface IMessage {
  _id: string;
  user: IUser;
  content: string;
}
