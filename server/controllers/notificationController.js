const notificationService = require('../services/notificationService');

const getNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getUserNotifications(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markNotificationAsRead(req.params.id, req.user._id);
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllNotificationsAsRead(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
