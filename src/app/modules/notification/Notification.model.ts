import { model, Schema } from 'mongoose';
import { TNotification } from './Notification.interface';

const NotificationSchema = new Schema<TNotification>(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

const Notification = model<TNotification>('Notification', NotificationSchema);

export default Notification;
