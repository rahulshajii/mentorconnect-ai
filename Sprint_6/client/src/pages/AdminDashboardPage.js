import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  School as CourseIcon,
  People as PeopleIcon,
  CreditCard as PaymentIcon,
  WorkspacePremium as CertificateIcon,
  Email as EmailIcon,
  Replay as RetryIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import * as adminService from '../services/adminService';
import * as courseService from '../services/courseService';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // New Course Modal
  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '6 Hours',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    curriculum: [
      {
        lessonId: `l1-${Date.now()}`,
        title: 'Core Fundamentals & Architecture',
        duration: '45 mins',
        videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
      },
    ],
  });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [coursesRes, enrollmentsRes, paymentsRes, certsRes, emailsRes] = await Promise.all([
        courseService.getCourses({ includeUnpublished: true, limit: 50 }),
        adminService.getAllEnrollments(),
        adminService.getAllPayments(),
        adminService.getAllCertificates(),
        adminService.getAllEmailLogs(),
      ]);

      setCourses(coursesRes.courses || []);
      setEnrollments(enrollmentsRes || []);
      setPayments(paymentsRes || []);
      setCertificates(certsRes || []);
      setEmailLogs(emailsRes || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      toast.error('Could not load administrative data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const handleCreateCourse = async () => {
    if (!courseForm.title || !courseForm.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      await adminService.createCourse(courseForm);
      toast.success('Course created successfully!');
      setOpenCourseModal(false);
      loadAdminData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      await adminService.updateCourse(course._id, { published: !course.published });
      toast.success(`Course ${course.published ? 'unpublished' : 'published'} successfully`);
      loadAdminData();
    } catch (err) {
      toast.error('Failed to update course status');
    }
  };

  const handleRetryEmail = async (emailLogId) => {
    try {
      await adminService.retryEmail(emailLogId);
      toast.success('Email delivery retried');
      loadAdminData();
    } catch (err) {
      toast.error('Failed to retry email delivery');
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Platform Administration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage courses, review learner enrollments, demo payments, certificates, and email delivery.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadAdminData}>
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCourseModal(true)}
              sx={{ borderRadius: 2 }}
            >
              Add Course
            </Button>
          </Stack>
        </Stack>

        {/* Tab Navigation */}
        <Paper sx={{ mb: 4, borderRadius: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            <Tab icon={<CourseIcon />} iconPosition="start" label={`Courses (${courses.length})`} />
            <Tab icon={<PeopleIcon />} iconPosition="start" label={`Enrollments (${enrollments.length})`} />
            <Tab icon={<PaymentIcon />} iconPosition="start" label={`Demo Payments (${payments.length})`} />
            <Tab icon={<CertificateIcon />} iconPosition="start" label={`Certificates (${certificates.length})`} />
            <Tab icon={<EmailIcon />} iconPosition="start" label={`Email Logs (${emailLogs.length})`} />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={48} />
          </Box>
        ) : (
          <>
            {/* TAB 0: COURSES MANAGEMENT */}
            {activeTab === 0 && (
              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Enrolled</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses.map((c) => (
                      <TableRow key={c._id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{c.title}</TableCell>
                        <TableCell>{c.category}</TableCell>
                        <TableCell>{c.level}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: c.price === 0 ? '#057642' : '#0a66c2' }}>
                          {c.price === 0 ? 'FREE' : `$${c.price}`}
                        </TableCell>
                        <TableCell>{c.enrolledCount || 0}</TableCell>
                        <TableCell>
                          <Chip
                            label={c.published ? 'Published' : 'Draft'}
                            color={c.published ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleTogglePublish(c)}
                            sx={{ mr: 1 }}
                          >
                            {c.published ? 'Unpublish' : 'Publish'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* TAB 1: ENROLLMENTS */}
            {activeTab === 1 && (
              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Learner</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Enrolled Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Progress</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {enrollments.map((enr) => (
                      <TableRow key={enr._id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {enr.learnerId?.name} ({enr.learnerId?.email})
                        </TableCell>
                        <TableCell>{enr.courseId?.title}</TableCell>
                        <TableCell>{new Date(enr.enrolledAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={enr.paymentStatus?.toUpperCase()}
                            color={enr.paymentStatus === 'paid' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{enr.progress}%</TableCell>
                        <TableCell>
                          <Chip
                            label={enr.status?.toUpperCase()}
                            color={enr.status === 'completed' ? 'secondary' : 'primary'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* TAB 2: DEMO PAYMENTS */}
            {activeTab === 2 && (
              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Transaction Ref</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Learner</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Simulated Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((p) => (
                      <TableRow key={p._id} hover>
                        <TableCell sx={{ fontWeight: 700 }}><code>{p.orderId}</code></TableCell>
                        <TableCell><code>{p.transactionReference || 'N/A'}</code></TableCell>
                        <TableCell>{p.learnerId?.name}</TableCell>
                        <TableCell>{p.courseId?.title}</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#057642' }}>
                          ${p.amount} {p.currency} (DEMO)
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={p.status?.toUpperCase()}
                            color={p.status === 'succeeded' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* TAB 3: CERTIFICATES */}
            {activeTab === 3 && (
              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Certificate ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Learner Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Course Title</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Issued Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {certificates.map((cert) => (
                      <TableRow key={cert._id} hover>
                        <TableCell sx={{ fontWeight: 700, color: '#0a66c2' }}>
                          <code>{cert.certificateId}</code>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{cert.learnerName}</TableCell>
                        <TableCell>{cert.courseTitle}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{cert.score}%</TableCell>
                        <TableCell>{new Date(cert.issuedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip label={cert.status.toUpperCase()} color="success" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* TAB 4: EMAIL LOGS */}
            {activeTab === 4 && (
              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Recipient</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Event Type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Sent / Logged At</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {emailLogs.map((log) => (
                      <TableRow key={log._id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{log.recipient}</TableCell>
                        <TableCell>
                          <Chip label={log.eventType} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{log.subject}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.status === 'simulated_dev' ? 'Simulated (Dev)' : log.status.toUpperCase()}
                            color={
                              log.status === 'sent'
                                ? 'success'
                                : log.status === 'failed'
                                ? 'error'
                                : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(log.sentAt || log.createdAt).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="View Email Details">
                              <IconButton onClick={() => setSelectedEmail(log)} color="info" size="small">
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {log.status === 'failed' && (
                              <Tooltip title="Retry email delivery">
                                <IconButton onClick={() => handleRetryEmail(log._id)} color="primary" size="small">
                                  <RetryIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {/* CREATE COURSE MODAL */}
        <Dialog open={openCourseModal} onClose={() => setOpenCourseModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>Create New Course</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Course Title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                required
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Course Description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                required
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  >
                    {['Web Development', 'System Design', 'Data & AI', 'Cloud & DevOps', 'Cybersecurity'].map(
                      (cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    label="Level"
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                  >
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <MenuItem key={lvl} value={lvl}>
                        {lvl}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price in USD ($0 for free)"
                    type="number"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Estimated Duration"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenCourseModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateCourse}>
              Create Course
            </Button>
          </DialogActions>
        </Dialog>

        {/* EMAIL DETAILS MODAL */}
        <Dialog open={Boolean(selectedEmail)} onClose={() => setSelectedEmail(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="primary" /> Email Delivery Details
          </DialogTitle>
          <DialogContent dividers>
            {selectedEmail && (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    EVENT TYPE
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={selectedEmail.eventType} color="primary" variant="outlined" size="small" />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    RECIPIENT
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedEmail.recipientName ? `${selectedEmail.recipientName} (${selectedEmail.recipient})` : selectedEmail.recipient}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    SUBJECT
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {selectedEmail.subject}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    DELIVERY STATUS
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedEmail.status === 'simulated_dev' ? 'Simulated Dev Mode (Logged)' : selectedEmail.status.toUpperCase()}
                      color={selectedEmail.status === 'sent' ? 'success' : selectedEmail.status === 'failed' ? 'error' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    MESSAGE PREVIEW
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, mt: 0.5 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: '#334155', fontFamily: 'monospace' }}>
                      {selectedEmail.bodyPreview || 'No preview available.'}
                    </Typography>
                  </Paper>
                </Box>

                {selectedEmail.meta && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      METADATA
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#f1f5f9', borderRadius: 2, mt: 0.5 }}>
                      <Typography variant="caption" component="pre" sx={{ margin: 0, overflowX: 'auto' }}>
                        {JSON.stringify(selectedEmail.meta, null, 2)}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    TIMESTAMP
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(selectedEmail.sentAt || selectedEmail.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setSelectedEmail(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
