/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import { createDir } from '../util/createDir';
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(
  ({
    level,
    message,
    label,
    timestamp,
  }: {
    level: string;
    message: string;
    label: string;
    timestamp: Date;
  }) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
  },
);

const logDir = path.resolve(process.cwd(), 'winston');

createDir(logDir);

const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'bdCalling' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(logDir, 'success', '%DATE%-success.log'),
      datePattern: 'DD-MM-YYYY-HH',
      maxSize: '20m',
      maxFiles: '1d',
    }),
  ],
});

const errorLogger = createLogger({
  level: 'error',
  format: combine(label({ label: 'bdCalling' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(logDir, 'error', '%DATE%-error.log'),
      datePattern: 'DD-MM-YYYY-HH',
      maxSize: '20m',
      maxFiles: '1d',
    }),
  ],
});

export { errorLogger, logger };
