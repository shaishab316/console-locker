import { Types } from 'mongoose';

export type TNewsLetter = {
  _id?: Types.ObjectId;

  email: string;

  createdAt?: Date;
  updatedAt?: Date;
};
