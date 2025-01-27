import fs from 'fs';
import path from 'path';

const unlinkFile = (file: string) => {
  const filePath = path.join(process.cwd(), 'uploads', file);

  console.log('deleted', filePath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export default unlinkFile;
