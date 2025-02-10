import { Schema, model } from 'mongoose';
import { TSetting } from './Setting.interface';

const SettingSchema = new Schema<TSetting>({
  name: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

const Setting = model<TSetting>('Setting', SettingSchema);

export default Setting;
