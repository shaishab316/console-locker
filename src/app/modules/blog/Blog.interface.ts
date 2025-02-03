import { Types } from 'mongoose';

export type TBlog = {
  image: string;
  title: string;
  description: string;
  admin: Types.ObjectId;
};
