import { TNotification } from './Notification.interface';
import Notification from './Notification.model';

export const NotificationService = {
  create: async (notificationData: TNotification) =>
    await Notification.create(notificationData),

  async list({ page = '1', limit = '10' }: Record<any, any>) {
    const totalCount = await Notification.countDocuments();

    const notifications = await Notification.find()
      .select('createdAt subject isRead')
      .sort({ isRead: 1, createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    return {
      meta: {
        totalPages: Math.ceil(totalCount / +limit),
        page: +page,
        limit: +limit,
        total: totalCount,
      },
      notifications,
    };
  },

  retrieve: async (notificationId: string) =>
    Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
      },
      {
        new: true,
      },
    ),

  unReadCount: async () => await Notification.countDocuments({ isRead: false }),
};
