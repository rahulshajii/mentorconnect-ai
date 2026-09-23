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
  LinearProgress,
  Card,
  CardContent,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Quiz as QuizIcon,
  CompareArrows as GapIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  CalendarMonth as CalendarIcon,
  Notifications as NotifIcon,
  CheckCircle as CheckIcon,
  Videocam as VideoIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import { getLearnerSessions } from '../services/sessionService';
import { getNotifications } from '../services/notificationService';

const LearnerDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [sessData, notifData] = await Promise.all([
          getLearnerSessions().catch(() => []),
          getNotifications().catch(() => ({ notifications: [] })),
        ]);

        setSessions(sessData || []);
        setNotifications(notifData.notifications || []);
      } catch (err) {
        console.error('Error loading learner dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const upcomingSessions = sessions.filter((s) => s.status === 'confirmed' || s.status === 'pending');

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
            backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80)',
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
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(10, 102, 194, 0.85) 100%)',
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
                  Target Goal: <strong>{profile?.careerGoal || 'Full-Stack Engineer'}</strong> | Education: <strong>{profile?.education || 'Computer Science'}</strong>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* Quick Action Chips */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/recommendations')}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
            >
              AMIE Mentors
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<CalendarIcon />}
              onClick={() => navigate('/sessions')}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
            >
              My Sessions ({upcomingSessions.length})
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<QuizIcon />}
              onClick={() => navigate('/quiz')}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
            >
              Take Quiz
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<GapIcon />}
              onClick={() => navigate('/skill-gap')}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
            >
              Skill Gap
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Upcoming Mentoring Sessions Widget */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Upcoming & Active Sessions
                </Typography>
                <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/sessions')} sx={{ fontWeight: 700 }}>
                  View All
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <CircularProgress size={24} sx={{ my: 2 }} />
              ) : upcomingSessions.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    No upcoming mentoring sessions.
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/recommendations')}
                    sx={{ mt: 1.5, borderRadius: 6, fontWeight: 700 }}
                  >
                    Find a Mentor & Book
                  </Button>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {upcomingSessions.slice(0, 3).map((sess) => {
                    const mentorName = sess.mentorId?.name || 'Verified Mentor';
                    const mentorImg = sess.mentorProfile?.profileImage || sess.mentorId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentorName}`;

                    return (
                      <Paper key={sess._id} elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={mentorImg} alt={mentorName} sx={{ width: 48, height: 48, border: '2px solid #0a66c2' }} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                {mentorName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                                {sess.date} @ {sess.startTime} — "{sess.topic}"
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={sess.status.toUpperCase()}
                              size="small"
                              color={sess.status === 'confirmed' ? 'success' : 'warning'}
                              sx={{ fontWeight: 800, fontSize: '0.65rem' }}
                            />
                            {sess.status === 'confirmed' && sess.meetingLink && (
                              <Button
                                component="a"
                                href={sess.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<VideoIcon />}
                                sx={{ borderRadius: 6, fontWeight: 700 }}
                              >
                                Join
                              </Button>
                            )}
                          </Stack>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Paper>

            {/* Active Skills Overview */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
                Verified Skill Portfolio
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {profile?.skills?.map((s, idx) => (
                  <Chip
                    key={idx}
                    icon={<CheckIcon sx={{ fontSize: '14px !important' }} />}
                    label={`${typeof s === 'string' ? s : s.name} (${typeof s === 'string' ? 'Intermediate' : s.level || 'Intermediate'})`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Right Column: Recent Notifications & Quick Actions */}
          <Grid item xs={12} md={5}>
            {/* Recent Notifications Widget */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <NotifIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    Recent Notifications
                  </Typography>
                </Stack>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {notifications.length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', py: 2 }}>
                  No recent notifications.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {notifications.slice(0, 4).map((n) => (
                    <Box key={n._id} sx={{ p: 1.5, bgcolor: n.isRead ? '#f8fafc' : '#f0f9ff', borderRadius: 2, borderLeft: '4px solid #0a66c2' }}>
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

export default LearnerDashboard;
