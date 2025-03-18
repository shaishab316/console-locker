import { TConfigAttr } from './ConfigAttr.interface';
import ConfigAttr from './ConfigAttr.model';

export const ConfigAttrServices = {
  async set(data: TConfigAttr) {
    return ConfigAttr.findOneAndUpdate({}, data, { upsert: true, new: true });
  },

  async get() {
    return ConfigAttr.findOne();
  },
};
