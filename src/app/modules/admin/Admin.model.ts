import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { TAdmin } from './Admin.interface';

const adminSchema = new Schema<TAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, required: true },
    otp: Number,
    otpExp: Date,
  },
  {
    timestamps: true,
  },
);

// Hash the password before saving the admin
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Admin = model<TAdmin>('Admin', adminSchema);

export default Admin;
