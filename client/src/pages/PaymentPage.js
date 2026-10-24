import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  CardMedia,
} from '@mui/material';
import {
  Lock as LockIcon,
  ArrowForward as ArrowIcon,
  CreditCard as PaymentIcon,
  Shield as ShieldIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import AnimatedSuccessCheckmark from '../components/AnimatedSuccessCheckmark';
import * as paymentService from '../services/paymentService';

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orderSummary, setOrderSummary] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  // Initialize or fetch pending demo order on mount
  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        navigate(`/login?redirect=/payment/${courseId}`);
        return;
      }

      setLoadingOrder(true);
      try {
        const orderData = await paymentService.createDemoOrder(courseId);
        if (orderData.alreadyEnrolled) {
          toast.success('You are already enrolled in this course.');
          navigate(`/courses/${courseId}/learn`);
          return;
        }
        setOrderSummary(orderData);
      } catch (err) {
        console.error('Error initiating order:', err);
        const msg = err.response?.data?.message || err.message || 'Could not initiate payment order';
        toast.error(msg);
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [courseId, user, navigate]);

  // Execute One-Click Demo Payment through backend API
  const handleExecutePayment = async () => {
    if (!orderSummary || !orderSummary.orderId) return;

    setProcessing(true);
    try {
      const result = await paymentService.confirmDemoPayment(orderSummary.orderId);
      setPaymentSuccessData(result);
      toast.success('Demo payment confirmed successfully!');
    } catch (err) {
      console.error('Payment confirmation error:', err);
      const msg = err.response?.data?.message || err.message || 'Payment processing failed';
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  if (loadingOrder) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <CircularProgress size={48} />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            Preparing secure demo order summary...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  if (!orderSummary) {
    return (
      <MainLayout>
        <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Unable to Load Payment Order
          </Typography>
          <Button variant="contained" component={Link} to="/courses">
            Return to Courses
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ bgcolor: '#f4f5f7', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="md">
          {/* Header Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              {paymentSuccessData ? 'Payment Confirmed' : 'Complete Your Course Enrollment'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {paymentSuccessData
                ? 'Your simulated transaction has been verified and recorded.'
                : 'Review your order summary and confirm using the academic demo payment engine.'}
            </Typography>
          </Box>

          {/* Conditional Rendering: Success Screen vs Checkout Form */}
          {paymentSuccessData ? (
            /* PAYMENT SUCCESS SCREEN WITH ANIMATED GREEN CHECKMARK */
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, sm: 5 },
                borderRadius: 4,
                textAlign: 'center',
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
              }}
            >
              {/* Smooth Animated Green Checkmark */}
              <AnimatedSuccessCheckmark size={120} />

              <Typography variant="h4" sx={{ fontWeight: 800, color: '#057642', mb: 1 }}>
                Payment Successful!
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                {paymentSuccessData.courseTitle || orderSummary.course?.title}
              </Typography>

              {/* Transaction Summary Card */}
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 4,
                  bgcolor: '#f8fafc',
                  borderRadius: 3,
                  maxWidth: 550,
                  mx: 'auto',
                  textAlign: 'left',
                }}
              >
                <Grid container spacing={1.5} sx={{ fontSize: '0.95rem' }}>
                  <Grid item xs={5} sx={{ color: '#64748b' }}>
                    Order Reference:
                  </Grid>
                  <Grid item xs={7} sx={{ fontWeight: 700, color: '#0f172a' }}>
                    <code>{paymentSuccessData.orderId}</code>
                  </Grid>

                  <Grid item xs={5} sx={{ color: '#64748b' }}>
                    Transaction Ref:
                  </Grid>
                  <Grid item xs={7} sx={{ fontWeight: 700, color: '#057642' }}>
                    <code>{paymentSuccessData.transactionReference}</code>
                  </Grid>

                  <Grid item xs={5} sx={{ color: '#64748b' }}>
                    Amount Recorded:
                  </Grid>
                  <Grid item xs={7} sx={{ fontWeight: 800, color: '#0f172a' }}>
                    ${paymentSuccessData.amount} {paymentSuccessData.currency || 'USD'} (DEMO)
                  </Grid>

                  <Grid item xs={5} sx={{ color: '#64748b' }}>
                    Payment Type:
                  </Grid>
                  <Grid item xs={7}>
                    <Chip label="DEMO SIMULATION" size="small" color="success" sx={{ fontWeight: 700 }} />
                  </Grid>

                  <Grid item xs={5} sx={{ color: '#64748b' }}>
                    Enrollment Status:
                  </Grid>
                  <Grid item xs={7} sx={{ fontWeight: 700, color: '#057642' }}>
                    Confirmed & Active
                  </Grid>
                </Grid>
              </Paper>

              {/* Email Status Indicator */}
              <Alert
                icon={<EmailIcon fontSize="inherit" />}
                severity="info"
                sx={{ maxWidth: 550, mx: 'auto', mb: 4, textAlign: 'left', borderRadius: 2 }}
              >
                <strong>Automatic Email:</strong> A confirmation email and simulated payment receipt have been queued and logged for <strong>{user?.email}</strong>.
              </Alert>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate(`/courses/${courseId}/learn`)}
                  sx={{ py: 1.5, px: 4, borderRadius: 2, fontWeight: 700 }}
                >
                  Start Learning Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/my-courses')}
                  sx={{ py: 1.5, px: 3, borderRadius: 2 }}
                >
                  Go to My Courses
                </Button>
              </Stack>
            </Paper>
          ) : (
            /* CHECKOUT ORDER SUMMARY AND DEMO PAYMENT BUTTON */
            <Grid container spacing={4}>
              {/* Left Column: Order Items & Learner Info */}
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3.5, borderRadius: 3, mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#0f172a' }}>
                    Order Details
                  </Typography>

                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <CardMedia
                      component="img"
                      src={orderSummary.course?.thumbnail}
                      alt={orderSummary.course?.title}
                      sx={{ width: 90, height: 90, borderRadius: 2, objectFit: 'cover' }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Chip label={orderSummary.course?.category} size="small" sx={{ mb: 0.5, fontWeight: 600 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {orderSummary.course?.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Instructor: {orderSummary.course?.instructorName || 'MentorConnect Faculty'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2.5 }} />

                  {/* Learner Info */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#64748b' }}>
                    Learner Account
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {orderSummary.learner?.name} ({orderSummary.learner?.email})
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Order Reference: <code>{orderSummary.orderId}</code>
                  </Typography>
                </Paper>

                {/* Academic Demonstration Warning */}
                <Alert
                  severity="warning"
                  icon={<ShieldIcon />}
                  sx={{ borderRadius: 3, border: '1px solid #fef08a' }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Demo Payment Simulation Notice
                  </Typography>
                  <Typography variant="body2">
                    This platform uses a simulated demo payment mechanism for academic and evaluation purposes. <strong>No real money will be charged</strong> and no real credit card details are collected or stored.
                  </Typography>
                </Alert>
              </Grid>

              {/* Right Column: Price Summary & Pay Button */}
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 3.5, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#0f172a' }}>
                    Summary
                  </Typography>

                  <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Course Tuition
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${orderSummary.amount} {orderSummary.currency}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Academic Demo Discount
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#057642', fontWeight: 600 }}>
                        $0.00
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Total Amount
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0a66c2' }}>
                        ${orderSummary.amount} {orderSummary.currency}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Prominent Demo Payment Action Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled={processing}
                    startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                    onClick={handleExecutePayment}
                    sx={{
                      py: 1.8,
                      borderRadius: 2.5,
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 14px rgba(5, 118, 66, 0.3)',
                      mb: 2,
                    }}
                  >
                    {processing ? 'Processing Simulated Payment...' : 'Pay with Demo Payment'}
                  </Button>

                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    <LockIcon sx={{ fontSize: 16, color: '#64748b' }} />
                    <Typography variant="caption" color="text.secondary">
                      Instant simulated verification & automatic email dispatch
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </MainLayout>
  );
};

export default PaymentPage;
