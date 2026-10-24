const paymentService = require('../services/paymentService');

// @desc    Create a demo payment order (server-calculated price)
// @route   POST /api/payments/demo/create
// @access  Private (Learner)
const createDemoOrder = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required to create payment order' });
    }

    const orderData = await paymentService.createDemoOrder(req.user._id, courseId);
    res.status(201).json(orderData);
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm demo payment transaction (idempotent)
// @route   POST /api/payments/demo/confirm
// @access  Private (Learner)
const confirmDemoPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required to confirm payment' });
    }

    const result = await paymentService.confirmDemoPayment(req.user._id, orderId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current learner's payment orders
// @route   GET /api/payments/my
// @access  Private (Learner)
const getMyPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getLearnerOrders(req.user._id);
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details by orderId
// @route   GET /api/payments/order/:orderId
// @access  Private (Learner)
const getOrderDetails = async (req, res, next) => {
  try {
    const order = await paymentService.getOrderById(req.user._id, req.params.orderId);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDemoOrder,
  confirmDemoPayment,
  getMyPayments,
  getOrderDetails,
};
