import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import Admin from './Admin.model';
import bcrypt from 'bcrypt';
import { jwtHelper } from '../../../helpers/jwtHelper';
import config from '../../../config';
import { emailHelper } from '../../../helpers/emailHelper';
import { sendOtpTemplate } from './Admin.template';
import { generateOtp } from './Admin.utils';
import { TAdmin } from './Admin.interface';
import { Request } from 'express';
import deleteFile from '../../../shared/deleteFile';

export const AdminService = {
  async registerAdmin(newAdmin: TAdmin) {
    return await Admin.create(newAdmin);
  },

  async updateAdmin(req: Request) {
    const { admin } = req;
    const { name, phone, avatar } = req.body;

    // Only allow updates to name, phone, and avatar
    const updateData: Partial<TAdmin> = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;

    const imagesToDelete = admin!.avatar!;

    const updatedAdmin = await Admin.findByIdAndUpdate(admin!._id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdmin)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Admin not found');

    if (avatar) await deleteFile(imagesToDelete);

    return updatedAdmin;
  },

  async loginAdmin(email: string, password: string) {
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !(await bcrypt.compare(password, admin.password)))
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');

    const accessToken = jwtHelper.createToken(
      { email: admin.email, adminId: admin._id },
      config.jwt.jwt_secret as string,
      config.jwt.jwt_expire_in as string,
    );

    const refreshToken = jwtHelper.createToken(
      { email: admin.email, adminId: admin._id },
      config.jwt.jwtRefreshSecret as string,
      config.jwt.jwtRefreshExpiresIn as string,
    );

    return {
      token: {
        accessToken,
        refreshToken,
      },
      admin: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        avatar: admin.avatar,
      },
    };
  },

  async sendOtp(email: string) {
    const admin = await Admin.findOne({ email });

    if (!admin)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Admin not found. Check your email and try again.',
      );

    const otp = generateOtp();

    admin.otp = otp;
    admin.otpExp = new Date(Date.now() + 2 * 60 * 1000);

    await admin?.save();

    emailHelper.sendEmail({
      to: email,
      subject: 'Your Console Locker OTP is Here! 🔒',
      html: sendOtpTemplate(admin.name.split(' ')[0], otp),
    });
  },

  async verifyOtp(email: string, otp: number) {
    const admin = await Admin.findOne({ email });

    if (!admin)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Admin not found. Check your email and try again.',
      );

    if (admin.otpExp && new Date(admin.otpExp) < new Date())
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'The OTP has expired. Please request a new one.',
      );

    if (admin.otp !== otp)
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'The OTP you entered is incorrect or expired. Please check your email and try again.',
      );

    /** otp = one time password; Be careful */
    admin.otp = undefined;
    admin.otpExp = undefined;
    await admin.save();

    const resetToken = jwtHelper.createToken(
      { email: admin.email, adminId: admin._id },
      config.jwt.jwt_secret as string,
      '2m',
    );

    return { resetToken };
  },

  async changePassword(admin: any, oldPassword: string, newPassword: string) {
    if (!(await bcrypt.compare(oldPassword, admin.password)))
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid password');

    admin.password = newPassword;
    await admin.save();
  },

  async resetPassword(token: string, password: string) {
    const { email } = jwtHelper.verifyToken(
      token,
      config.jwt.jwt_secret as string,
    );

    const admin = await Admin.findOne({ email });

    if (!admin)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Admin not found. Try again later.',
      );

    admin.password = password;
    await admin.save();

    const accessToken = jwtHelper.createToken(
      { email: admin.email, adminId: admin._id },
      config.jwt.jwt_secret as string,
      config.jwt.jwt_expire_in as string,
    );

    const refreshToken = jwtHelper.createToken(
      { email: admin.email, adminId: admin._id },
      config.jwt.jwtRefreshSecret as string,
      config.jwt.jwtRefreshExpiresIn as string,
    );

    return {
      token: {
        accessToken,
        refreshToken,
      },
      admin: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        avatar: admin.avatar,
      },
    };
  },
};
