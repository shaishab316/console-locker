import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelper } from '../../helpers/jwtHelper';
import catchAsync from '../../shared/catchAsync';
import Admin from '../modules/admin/Admin.model';

const verifyAdmin = catchAsync(async (req, _, next) => {
  const token = req.headers.authorization?.split(' ')[1]; //get accessToken form Bearer

  if (!token) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Access Denied: No token provided',
    );
  }

  const { email } = jwtHelper.verifyToken(
    token,
    config.jwt.jwt_secret as string,
  );

  const admin = await Admin.findOne({ email });

  if (!admin) throw new ApiError(StatusCodes.NOT_FOUND, 'Admin not found.');

  req.admin = admin;

  next();
});

export default verifyAdmin;
