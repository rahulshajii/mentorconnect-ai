import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  Chip,
  Stack,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as ConfirmIcon,
  Block as RejectIcon,
  Notifications as NotifIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import { getMentorSessions, updateSessionStatus } from '../services/sessionService';
import { getNotifications } from '../services/notificationService';

const MentorDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMentorData = async () => {
    setLoading(true);
    try {
      const [sessData, notifData] = await Promise.all([
        getMentorSessions().catch(() => []),
        getNotifications().catch(() => ({ notifications: [] })),
      ]);
      setSessions(sessData || []);
      setNotifications(notifData.notifications || []);
    } catch (err) {
      console.error('Error loading mentor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMentorData();
    }
  }, [user]);

  const handleAccept = async (sessionId) => {
    try {
      await updateSessionStatus(sessionId, 'confirmed');
      toast.success('Session request accepted!');
      loadMentorData();
    } catch (err) {
      toast.error('Failed to accept session.');
    }
  };

  const handleReject = async (sessionId) => {
    try {
      await updateSessionStatus(sessionId, 'rejected', 'Schedule conflict');
      toast.success('Session request declined.');
      loadMentorData();
    } catch (err) {
      toast.error('Failed to decline session.');
    }
  };

  const pendingRequests = sessions.filter((s) => s.status === 'pending');
  const confirmedSessions = sessions.filter((s) => s.status === 'confirmed');
  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const sessionFee = profile?.sessionPrice || profile?.hourlyFee || 50;

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* Unsplash High-Contrast Hero Banner */}
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 5 },
            mb: 4,
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: 'url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#ffffff',
          }}
        >
          {/* Dark Overlay for WCAG Contrast Compliance */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(124, 58, 237, 0.85) 100%)',
              zIndex: 1,
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar
                src={profile?.profileImage || profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                alt={user?.name}
                sx={{ width: 80, height: 80, border: '3px solid #ffffff', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}
              />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>
                  Welcome back, {user?.name}!
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 500, mt: 0.5 }}>
                  Senior Verified Mentor ({profile?.experience || 3}+ Years Exp.) | Hourly Session Rate: <strong>${sessionFee}/hr</strong>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* Key Metrics Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Pending Requests
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b', mt: 0.5 }}>
                      {pendingRequests.length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#fef3c7', color: '#f59e0b' }}>
                    <CalendarIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Confirmed Sessions
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', mt: 0.5 }}>
                      {confirmedSessions.length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#d1fae5', color: '#10b981' }}>
                    <PeopleIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Completed Sessions
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0a66c2', mt: 0.5 }}>
                      {completedCount}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0a66c2' }}>
                    <StarIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Est. Earnings
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#7c3aed', mt: 0.5 }}>
                      ${(completedCount + confirmedSessions.length) * sessionFee}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#f3e8ff', color: '#7c3aed' }}>
                    <MoneyIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Pending Session Requests Widget */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Pending Learner Requests
                </Typography>
                <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/sessions')} sx={{ fontWeight: 700 }}>
                  Manage All
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <CircularProgress size={24} sx={{ my: 2 }} />
              ) : pendingRequests.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    No pending session requests at this time.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {pendingRequests.map((sess) => {
                    const learnerName = sess.learnerId?.name || 'Active Learner';
                    const learnerImg = sess.learnerProfile?.profileImage || sess.learnerId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${learnerName}`;

                    return (
                      <Paper key={sess._id} elevation={0} sx={{ p: 2, bgcolor: '#fffbe6', borderRadius: 3, border: '1px solid #ffe58f' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={7}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar src={learnerImg} alt={learnerName} sx={{ width: 46, height: 46, border: '2px solid #f59e0b' }} />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                  {learnerName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                                  {sess.date} @ {sess.startTime} — "{sess.topic}"
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} sm={5} sx={{ textAlign: { sm: 'right' } }}>
                            <Stack direction="row" spacing={1} justifyContent={{ sm: 'flex-end' }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<ConfirmIcon />}
                                onClick={() => handleAccept(sess._id)}
                                sx={{ borderRadius: 6, fontWeight: 700 }}
                              >
                                Accept
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<RejectIcon />}
                                onClick={() => handleReject(sess._id)}
                                sx={{ borderRadius: 6, fontWeight: 700 }}
                              >
                                Decline
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Paper>
          </Grid>

          {/* Right Column: Notifications */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <NotifIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Recent Notifications
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {notifications.length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', py: 2 }}>
                  No recent notifications.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {notifications.slice(0, 4).map((n) => (
                    <Box key={n._id} sx={{ p: 1.5, bgcolor: n.isRead ? '#f8fafc' : '#f0f9ff', borderRadius: 2, borderLeft: '4px solid #7c3aed' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                        {n.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                        {n.message}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default MentorDashboard;
