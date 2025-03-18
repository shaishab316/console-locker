import { model, Schema } from 'mongoose';
import { TConfigAttr } from './ConfigAttr.interface';

const configAttrSchema = new Schema<TConfigAttr>(
  {
    model: {
      type: String,
      required: true,
    },
    controller: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    memory: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

const ConfigAttr = model<TConfigAttr>('ConfigAttr', configAttrSchema);

export default ConfigAttr;
