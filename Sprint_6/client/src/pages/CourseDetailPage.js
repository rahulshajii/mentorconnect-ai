import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Rating,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayCircle as PlayIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon,
  School as CourseIcon,
  WorkspacePremium as CertificateIcon,
  Check as ObjectiveIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import * as courseService from '../services/courseService';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const courseData = await courseService.getCourseById(id);
        setCourse(courseData);

        if (user && user.role === 'learner') {
          const myCourses = await courseService.getMyCourses();
          const existing = myCourses.find(
            (e) => (e.courseId?._id || e.courseId).toString() === courseData._id.toString()
          );
          setEnrollment(existing || null);
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
        toast.error('Could not load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, user]);

  const handleEnrollAction = async () => {
    if (!user) {
      toast.error('Please sign in or create an account to enroll');
      navigate(`/login?redirect=/courses/${course._id}`);
      return;
    }

    if (user.role !== 'learner') {
      toast.error('Only learners can enroll in courses');
      return;
    }

    // If paid course -> Go to Demo Payment Page
    if (course.price > 0) {
      navigate(`/payment/${course._id}`);
      return;
    }

    // Free course -> 1-click enroll
    setEnrolling(true);
    try {
      const res = await courseService.enrollInCourse(course._id);
      toast.success(res.message || 'Enrolled successfully!');
      navigate(`/courses/${course._id}/learn`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Enrollment failed';
      toast.error(msg);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={48} />
        </Box>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Course Not Found
          </Typography>
          <Button variant="contained" component={Link} to="/courses">
            Back to Course Catalog
          </Button>
        </Container>
      </MainLayout>
    );
  }

  const isEnrolledAndActive =
    enrollment && (enrollment.paymentStatus === 'paid' || enrollment.paymentStatus === 'free');

  return (
    <MainLayout>
      <Box sx={{ bgcolor: '#f4f5f7', minHeight: '100vh', pb: 8 }}>
        {/* Course Header Banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
            color: '#ffffff',
            py: { xs: 5, md: 7 },
            mb: 4,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={course.category}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 600 }}
                  />
                  <Chip
                    label={course.level}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 600 }}
                  />
                  <Chip
                    label={course.isFree ? 'FREE' : `$${course.price} USD`}
                    sx={{ bgcolor: '#10b981', color: '#ffffff', fontWeight: 700 }}
                  />
                </Stack>

                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
                  {course.title}
                </Typography>

                <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem', mb: 3 }}>
                  {course.description}
                </Typography>

                <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={course.rating || 4.9} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {course.rating || 4.9} ({course.enrolledCount || 120}+ students)
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <TimeIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">{course.duration}</Typography>
                  </Stack>
                  <Typography variant="body2">
                    Instructor: <strong>{course.instructorName || 'MentorConnect Faculty'}</strong>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Left Column: Course Content */}
            <Grid item xs={12} md={8}>
              {/* Learning Objectives */}
              {course.learningObjectives && course.learningObjectives.length > 0 && (
                <Paper sx={{ p: 3.5, mb: 4, borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                    What You Will Learn
                  </Typography>
                  <Grid container spacing={2}>
                    {course.learningObjectives.map((obj, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <ObjectiveIcon sx={{ color: '#10b981', fontSize: 22, mt: 0.3 }} />
                          <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                            {obj}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}

              {/* Curriculum Breakdown */}
              <Paper sx={{ p: 3.5, mb: 4, borderRadius: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    Course Curriculum
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.curriculum?.length || 0} Lessons • {course.duration} Total
                  </Typography>
                </Stack>

                <Box sx={{ mt: 2 }}>
                  {(course.curriculum || []).map((lesson, idx) => (
                    <Accordion
                      key={lesson.lessonId}
                      defaultExpanded={idx === 0}
                      sx={{
                        mb: 1.5,
                        borderRadius: '8px !important',
                        border: '1px solid #e2e8f0',
                        boxShadow: 'none',
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%', pr: 2 }}>
                          <PlayIcon sx={{ color: '#0a66c2', fontSize: 22 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                            Lesson {idx + 1}: {lesson.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {lesson.duration}
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ pl: 4.7 }}>
                          {lesson.description || 'Comprehensive interactive video module and guided practical exercise.'}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Paper>

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <Paper sx={{ p: 3.5, mb: 4, borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                    Prerequisites
                  </Typography>
                  <List dense disablePadding>
                    {course.prerequisites.map((p, i) => (
                      <ListItem key={i} disableGutters>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckIcon sx={{ fontSize: 18, color: '#0a66c2' }} />
                        </ListItemIcon>
                        <ListItemText primary={p} primaryTypographyProps={{ variant: 'body2', color: '#475569' }} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}

              {/* Instructor Bio */}
              <Paper sx={{ p: 3.5, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                  About the Instructor
                </Typography>
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Avatar
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      course.instructorName || 'Mentor'
                    )}`}
                    sx={{ width: 64, height: 64, border: '2px solid #0a66c2' }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {course.instructorName || 'MentorConnect Faculty'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {course.instructorTitle || 'Principal Technical Mentor'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dedicated domain leader mentoring engineers and architects across modern system domains.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* Right Column: Sticky Action Card */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3.5,
                  borderRadius: 3,
                  position: { md: 'sticky' },
                  top: { md: 90 },
                }}
              >
                <Box
                  component="img"
                  src={course.thumbnail}
                  alt={course.title}
                  sx={{
                    width: '100%',
                    height: 190,
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 2.5,
                  }}
                />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {course.isFree ? 'Free Enrollment' : `$${course.price} USD`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {course.isFree ? 'Full lifetime access included' : 'One-time demo payment with lifetime access'}
                  </Typography>
                </Box>

                {isEnrolledAndActive ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<ArrowIcon />}
                    onClick={() => navigate(`/courses/${course._id}/learn`)}
                    sx={{ py: 1.5, borderRadius: 2, fontSize: '1rem', mb: 2 }}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={enrolling}
                    endIcon={enrolling ? <CircularProgress size={20} color="inherit" /> : <ArrowIcon />}
                    onClick={handleEnrollAction}
                    sx={{ py: 1.5, borderRadius: 2, fontSize: '1rem', mb: 2 }}
                  >
                    {course.isFree ? 'Enroll for Free' : `Enroll Now • $${course.price}`}
                  </Button>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>
                  This course includes:
                </Typography>

                <List dense disablePadding>
                  <ListItem disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <TimeIcon sx={{ fontSize: 18, color: '#64748b' }} />
                    </ListItemIcon>
                    <ListItemText primary={`${course.duration} on-demand video & content`} />
                  </ListItem>
                  <ListItem disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CourseIcon sx={{ fontSize: 18, color: '#64748b' }} />
                    </ListItemIcon>
                    <ListItemText primary={`${course.curriculum?.length || 0} modular lessons`} />
                  </ListItem>
                  <ListItem disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CertificateIcon sx={{ fontSize: 18, color: '#64748b' }} />
                    </ListItemIcon>
                    <ListItemText primary="Verified Certificate of Completion" />
                  </ListItem>
                  <ListItem disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckIcon sx={{ fontSize: 18, color: '#64748b' }} />
                    </ListItemIcon>
                    <ListItemText primary="Automatic email confirmations" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default CourseDetailPage;
