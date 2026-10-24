const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createDemoOrder,
  confirmDemoPayment,
  getMyPayments,
  getOrderDetails,
} = require('../controllers/paymentController');

// All payment routes are protected for learners
router.post('/demo/create', protect, authorizeRoles('learner'), createDemoOrder);
router.post('/demo/confirm', protect, authorizeRoles('learner'), confirmDemoPayment);
router.get('/my', protect, authorizeRoles('learner'), getMyPayments);
router.get('/order/:orderId', protect, authorizeRoles('learner'), getOrderDetails);

module.exports = router;
