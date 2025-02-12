import fs from 'fs';

export const createDir = (dirPath: string) =>
  !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
