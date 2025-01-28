import { Types } from 'mongoose';

export type TCustomer = {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  address: TAddress;
  phone: string;
  avatar: string;
};

export type TAddress = {
  address: string;
  zip_code: string;
  city: string;
  country: string;
};
