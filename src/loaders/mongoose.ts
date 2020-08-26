import mongoose from 'mongoose';
import { Db } from 'mongodb';

export default async (databaseURL: string): Promise<Db> => {
  const connection = await mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  return connection.connection.db;
};
