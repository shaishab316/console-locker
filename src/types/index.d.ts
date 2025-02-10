import { TAdmin } from '../app/modules/admin/Admin.interface';

declare global {
  namespace Express {
    interface Request {
      // user: JwtPayload;
      admin?: Partial<TAdmin>;
    }
  }
}
