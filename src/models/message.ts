import { IMessage } from '../interfaces/IMessage';
import { UserSchema } from './user';
import mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema(
  {
    user: {
      type: UserSchema,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IMessage & mongoose.Document>('Message', MessageSchema);
