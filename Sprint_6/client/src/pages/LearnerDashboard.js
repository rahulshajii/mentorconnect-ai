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
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Quiz as QuizIcon,
  CompareArrows as GapIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  Notifications as NotifIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  School as CourseIcon,
  WorkspacePremium as CertificateIcon,
  PlayCircle as PlayIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import { getLearnerSessions } from '../services/sessionService';
import { getNotifications } from '../services/notificationService';
import * as courseService from '../services/courseService';
import * as certificateService from '../services/certificateService';

const LearnerDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [myCertificates, setMyCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [sessData, notifData, coursesData, certsData] = await Promise.all([
          getLearnerSessions().catch(() => []),
          getNotifications().catch(() => ({ notifications: [] })),
          courseService.getMyCourses().catch(() => []),
          certificateService.getMyCertificates().catch(() => []),
        ]);

        setSessions(sessData || []);
        setNotifications(notifData.notifications || []);
        setMyCourses(coursesData || []);
        setMyCertificates(certsData || []);
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
        {/* Hero Banner */}
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
                sx={{ width: 84, height: 84, border: '3px solid #ffffff' }}
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Welcome back, {user?.name || 'Learner'}!
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 1 }}>
                  Target Career Goal: <strong>{profile?.careerGoal || 'Full-Stack Software Engineer'}</strong>
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label="Learner Account" size="small" sx={{ bgcolor: '#ffffff', color: '#0a66c2', fontWeight: 700 }} />
                  <Chip label={`${myCourses.length} Enrolled Courses`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 600 }} />
                  <Chip label={`${myCertificates.length} Certificates`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 600 }} />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* Quick Hub Navigation Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={2.4}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<CourseIcon />}
              onClick={() => navigate('/my-courses')}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
            >
              My Courses ({myCourses.length})
            </Button>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<CertificateIcon />}
              onClick={() => navigate('/certificates')}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
            >
              Certificates ({myCertificates.length})
            </Button>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<CalendarIcon />}
              onClick={() => navigate('/sessions')}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
            >
              Sessions ({upcomingSessions.length})
            </Button>
          </Grid>
          <Grid item xs={6} sm={2.4}>
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
          <Grid item xs={12} sm={2.4}>
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

        {/* Enrolled Courses & Progress Section */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CourseIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                My Courses & Learning Progress
              </Typography>
            </Stack>
            <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/my-courses')} sx={{ fontWeight: 700 }}>
              View All Courses
            </Button>
          </Stack>
          <Divider sx={{ mb: 2.5 }} />

          {loading ? (
            <CircularProgress size={24} sx={{ my: 2 }} />
          ) : myCourses.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                You have not enrolled in any technical courses yet.
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<PlayIcon />}
                onClick={() => navigate('/courses')}
                sx={{ mt: 1.5, borderRadius: 6, fontWeight: 700 }}
              >
                Explore Course Catalog
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {myCourses.slice(0, 2).map((item) => {
                const c = item.courseId;
                if (!c) return null;
                const totalLessons = c.curriculum?.length || 1;
                const completedCount = item.completedLessons?.length || 0;

                return (
                  <Grid item xs={12} sm={6} key={item._id}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                        <Chip label={c.category} size="small" color="primary" sx={{ fontWeight: 600 }} />
                        <Chip
                          label={item.status === 'completed' ? 'Completed' : `${item.progress}%`}
                          size="small"
                          color={item.status === 'completed' ? 'success' : 'default'}
                          sx={{ fontWeight: 700 }}
                        />
                      </Stack>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        {c.title}
                      </Typography>

                      <Box sx={{ my: 1.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={item.progress || 0}
                          sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0' }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {completedCount} of {totalLessons} lessons completed
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 'auto', pt: 1 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/courses/${c._id}/learn`)}
                          sx={{ borderRadius: 2 }}
                        >
                          {item.status === 'completed' ? 'Review Lessons' : 'Continue Learning'}
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>

        <Grid container spacing={4}>
          {/* Upcoming Mentoring Sessions Widget */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Upcoming Mentoring Sessions
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
                    const mentorImg =
                      sess.mentorProfile?.profileImage ||
                      sess.mentorId?.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentorName}`;

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
                              sx={{ fontWeight: 700 }}
                            />
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
              {profile?.skills && profile.skills.length > 0 ? (
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {profile.skills.map((s, idx) => (
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
              ) : (
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                    No skills configured yet. Complete the skill assessment or add your skills in profile settings.
                  </Typography>
                  <Stack direction="row" spacing={1.5} justifyContent="center">
                    <Button size="small" variant="contained" onClick={() => navigate('/quiz')} sx={{ borderRadius: 6, fontWeight: 700 }}>
                      Take Quiz
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => navigate('/profile')} sx={{ borderRadius: 6, fontWeight: 700 }}>
                      Add Skills
                    </Button>
                  </Stack>
                </Box>
              )}
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
                    <Box
                      key={n._id}
                      onClick={() => n.link && navigate(n.link)}
                      sx={{
                        p: 1.5,
                        bgcolor: n.isRead ? '#f8fafc' : '#f0f9ff',
                        borderRadius: 2,
                        borderLeft: '4px solid #0a66c2',
                        cursor: n.link ? 'pointer' : 'default',
                      }}
                    >
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
