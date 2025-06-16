import { Schema, model } from 'mongoose';
import { TNewsLetter } from './NewsLetter.interface';

const newsLetterSchema = new Schema<TNewsLetter>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
  },
  { timestamps: true, versionKey: false },
);

const NewsLetter = model<TNewsLetter>('NewsLetter', newsLetterSchema);

export default NewsLetter;
