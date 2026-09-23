import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Stack,
  Tabs,
  Tab,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  CheckCircle as ConfirmIcon,
  Cancel as CancelIcon,
  Videocam as VideoIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  DoneAll as CompleteIcon,
  Block as RejectIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import {
  getLearnerSessions,
  getMentorSessions,
  updateSessionStatus,
} from '../services/sessionService';

const SessionsPage = () => {
  const { user } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject / Cancel Modal state
  const [actionModal, setActionModal] = useState({ open: false, session: null, action: '' });
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      if (user?.role === 'learner') {
        const data = await getLearnerSessions();
        setSessions(data || []);
      } else {
        const data = await getMentorSessions();
        setSessions(data || []);
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
      toast.error('Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const handleStatusChange = async (sessionId, newStatus, cancellationReason = '') => {
    try {
      await updateSessionStatus(sessionId, newStatus, cancellationReason);
      toast.success(`Session status updated to ${newStatus}`);
      fetchSessions();
      setActionModal({ open: false, session: null, action: '' });
      setReason('');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update session';
      toast.error(msg);
    }
  };

  // Filter sessions based on active tab
  const getFilteredSessions = () => {
    if (user?.role === 'learner') {
      if (tabIndex === 0) return sessions.filter((s) => s.status === 'confirmed' || s.status === 'pending');
      if (tabIndex === 1) return sessions.filter((s) => s.status === 'completed');
      if (tabIndex === 2) return sessions.filter((s) => s.status === 'cancelled' || s.status === 'rejected');
    } else {
      if (tabIndex === 0) return sessions.filter((s) => s.status === 'pending');
      if (tabIndex === 1) return sessions.filter((s) => s.status === 'confirmed');
      if (tabIndex === 2) return sessions.filter((s) => s.status === 'completed');
      if (tabIndex === 3) return sessions.filter((s) => s.status === 'cancelled' || s.status === 'rejected');
    }
    return sessions;
  };

  const filteredSessions = getFilteredSessions();

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {user?.role === 'mentor' ? 'Mentoring Session Requests & Schedule' : 'My Mentoring Sessions'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.5 }}>
              {user?.role === 'mentor'
                ? 'Review learner session requests, confirm schedule, and launch video meetings.'
                : 'Track your upcoming mentoring sessions, view meeting links, and manage bookings.'}
            </Typography>
          </Box>
          <Tooltip title="Refresh Sessions">
            <IconButton onClick={fetchSessions} color="primary" sx={{ bgcolor: '#f1f5f9' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Navigation Tabs */}
        <Paper elevation={0} sx={{ borderRadius: 3, bgcolor: '#ffffff', mb: 4, border: '1px solid #e2e8f0' }}>
          <Tabs
            value={tabIndex}
            onChange={(e, v) => setTabIndex(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            {user?.role === 'learner' ? (
              [
                <Tab key="1" label={`Upcoming & Active (${sessions.filter((s) => s.status === 'confirmed' || s.status === 'pending').length})`} sx={{ fontWeight: 700 }} />,
                <Tab key="2" label={`Completed (${sessions.filter((s) => s.status === 'completed').length})`} sx={{ fontWeight: 700 }} />,
                <Tab key="3" label={`Cancelled / Declined (${sessions.filter((s) => s.status === 'cancelled' || s.status === 'rejected').length})`} sx={{ fontWeight: 700 }} />,
              ]
            ) : (
              [
                <Tab key="1" label={`Pending Requests (${sessions.filter((s) => s.status === 'pending').length})`} sx={{ fontWeight: 700 }} />,
                <Tab key="2" label={`Confirmed Upcoming (${sessions.filter((s) => s.status === 'confirmed').length})`} sx={{ fontWeight: 700 }} />,
                <Tab key="3" label={`Completed (${sessions.filter((s) => s.status === 'completed').length})`} sx={{ fontWeight: 700 }} />,
                <Tab key="4" label={`Cancelled / Rejected (${sessions.filter((s) => s.status === 'cancelled' || s.status === 'rejected').length})`} sx={{ fontWeight: 700 }} />,
              ]
            )}
          </Tabs>
        </Paper>

        {/* Sessions List */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : filteredSessions.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textCenter: 'center', textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 4, border: '1px border-dashed #cbd5e1' }}>
            <CalendarIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
              No Sessions Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              There are no mentoring sessions in this category.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredSessions.map((sess) => {
              const partner = user?.role === 'learner' ? sess.mentorId : sess.learnerId;
              const partnerProf = user?.role === 'learner' ? sess.mentorProfile : sess.learnerProfile;
              const partnerName = partner?.name || (user?.role === 'learner' ? 'Verified Mentor' : 'Learner');
              const partnerImage = partnerProf?.profileImage || partner?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerName}`;

              return (
                <Grid item xs={12} key={sess._id}>
                  <Card elevation={2} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', transition: '0.2s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } }}>
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={2} alignItems="center">
                        {/* Participant info */}
                        <Grid item xs={12} md={4}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={partnerImage} alt={partnerName} sx={{ width: 56, height: 56, border: '2px solid #0a66c2' }} />
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                {partnerName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                {user?.role === 'learner' ? 'Industry Mentor' : 'Active Learner'}
                              </Typography>
                              <Box sx={{ mt: 0.5 }}>
                                <Chip
                                  label={sess.status.toUpperCase()}
                                  size="small"
                                  color={
                                    sess.status === 'confirmed'
                                      ? 'success'
                                      : sess.status === 'pending'
                                      ? 'warning'
                                      : sess.status === 'completed'
                                      ? 'info'
                                      : 'error'
                                  }
                                  sx={{ fontWeight: 800, fontSize: '0.65rem' }}
                                />
                              </Box>
                            </Box>
                          </Stack>
                        </Grid>

                        {/* Session details */}
                        <Grid item xs={12} md={5}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                            Topic: {sess.topic}
                          </Typography>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ color: '#475569', fontSize: '0.875rem' }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <CalendarIcon fontSize="small" color="primary" />
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {sess.date}
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <TimeIcon fontSize="small" color="primary" />
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {sess.startTime} - {sess.endTime}
                              </Typography>
                            </Stack>
                          </Stack>

                          {sess.description && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                              "{sess.description}"
                            </Typography>
                          )}
                        </Grid>

                        {/* Action buttons */}
                        <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                          <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} flexWrap="wrap" gap={1}>
                            {/* Confirmed meeting video launch */}
                            {sess.status === 'confirmed' && sess.meetingLink && (
                              <Button
                                component="a"
                                href={sess.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                color="success"
                                startIcon={<VideoIcon />}
                                size="small"
                                sx={{ borderRadius: 6, fontWeight: 700 }}
                              >
                                Join Video
                              </Button>
                            )}

                            {/* Mentor Pending Accept/Reject */}
                            {user?.role === 'mentor' && sess.status === 'pending' && (
                              <>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  startIcon={<ConfirmIcon />}
                                  onClick={() => handleStatusChange(sess._id, 'confirmed')}
                                  sx={{ borderRadius: 6, fontWeight: 700 }}
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  startIcon={<RejectIcon />}
                                  onClick={() => setActionModal({ open: true, session: sess, action: 'rejected' })}
                                  sx={{ borderRadius: 6, fontWeight: 700 }}
                                >
                                  Decline
                                </Button>
                              </>
                            )}

                            {/* Mentor Mark Completed */}
                            {user?.role === 'mentor' && sess.status === 'confirmed' && (
                              <Button
                                variant="outlined"
                                color="info"
                                size="small"
                                startIcon={<CompleteIcon />}
                                onClick={() => handleStatusChange(sess._id, 'completed')}
                                sx={{ borderRadius: 6, fontWeight: 700 }}
                              >
                                Complete
                              </Button>
                            )}

                            {/* Learner or Mentor Cancel active session */}
                            {(sess.status === 'pending' || sess.status === 'confirmed') && (
                              <Button
                                variant="text"
                                color="error"
                                size="small"
                                startIcon={<CancelIcon />}
                                onClick={() => setActionModal({ open: true, session: sess, action: 'cancelled' })}
                                sx={{ borderRadius: 6, fontWeight: 700 }}
                              >
                                Cancel
                              </Button>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Reason Modal for Decline / Cancel */}
        <Dialog open={actionModal.open} onClose={() => setActionModal({ open: false, session: null, action: '' })} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {actionModal.action === 'rejected' ? 'Decline Session Request' : 'Cancel Session'}
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please state the reason for {actionModal.action === 'rejected' ? 'declining' : 'cancelling'} this session.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setActionModal({ open: false, session: null, action: '' })}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleStatusChange(actionModal.session._id, actionModal.action, reason)}
              sx={{ borderRadius: 6, fontWeight: 700 }}
            >
              Confirm {actionModal.action === 'rejected' ? 'Decline' : 'Cancellation'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
};

export default SessionsPage;
