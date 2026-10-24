const Notification = require('../models/Notification');

const createNotification = async ({ recipientId, type, title, message, relatedSessionId = null }) => {
  try {
    const notification = await Notification.create({
      recipientId,
      type,
      title,
      message,
      relatedSessionId,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    return null;
  }
};

const getUserNotifications = async (recipientId) => {
  const notifications = await Notification.find({ recipientId })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({ recipientId, isRead: false });

  return {
    unreadCount,
    notifications,
  };
};

const markNotificationAsRead = async (notificationId, recipientId) => {
  const notification = await Notification.findOne({ _id: notificationId, recipientId });
  if (!notification) {
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

const markAllNotificationsAsRead = async (recipientId) => {
  await Notification.updateMany({ recipientId, isRead: false }, { $set: { isRead: true } });
  return { message: 'All notifications marked as read' };
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
