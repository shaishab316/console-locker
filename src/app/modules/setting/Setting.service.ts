import Setting from './Setting.model';

export const SettingService = {
  modify: async (name: string, value: string) =>
    await Setting.updateOne({ name }, { value }, { upsert: true }),
};
