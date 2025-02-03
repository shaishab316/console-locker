import fs from 'fs';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../errors/ApiError';
import { ErrorRequestHandler } from 'express';
import deleteFile from '../../shared/deleteFile';

const imageUploader = () => {
  const baseUploadDir = path.join(process.cwd(), 'uploads');

  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = path.join(baseUploadDir, 'images');
      createDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  const fileFilter = (_req: any, file: any, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ApiError(StatusCodes.BAD_REQUEST, 'Only image files are allowed'));
    }
  };

  const upload = multer({
    storage,
    fileFilter,
  }).fields([{ name: 'images', maxCount: 5 }]); // Allow up to 5 images

  return upload;
};

/** Middleware to ensure image rollbacks if an error occurs during the request handling */
export const imagesUploadRollback: ErrorRequestHandler = (
  err,
  req,
  _res,
  next,
) => {
  if (req.files && 'images' in req.files && Array.isArray(req.files.images))
    req.files.images.forEach(
      async ({ filename }) => await deleteFile(`/images/${filename}`),
    );

  next(err);
};

export default imageUploader;
