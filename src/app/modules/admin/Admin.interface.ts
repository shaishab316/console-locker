import { Types } from 'mongoose';

export type TAdmin = {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  otp?: number;
  otpExp?: Date;
};
