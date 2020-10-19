import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },

    password: String,

    salt: String,

    role: {
      type: String,
      default: 'user',
    },
    refreshToken: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('User', UserSchema);
