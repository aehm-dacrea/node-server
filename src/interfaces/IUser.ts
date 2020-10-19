import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
  password: string;
  salt: string;
  refreshToken: string;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  role: string;
  password: string;
}
