import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  LinearProgress,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  PlayCircle as ContinueIcon,
  CheckCircle as CompletedIcon,
  WorkspacePremium as CertificateIcon,
  School as CourseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import * as courseService from '../services/courseService';
import { LoadingScreen, EmptyState } from '../components/common';

const MyCoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        const data = await courseService.getMyCourses();
        setEnrollments(data || []);
      } catch (err) {
        console.error('Error fetching learner courses:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            My Enrolled Courses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your lesson progress, continue coursework, and access verified completion certificates.
          </Typography>
        </Box>

        {loading ? (
          <LoadingScreen message="Loading your enrolled courses..." fullPage={false} />
        ) : enrollments.length === 0 ? (
          <EmptyState
            icon={<CourseIcon sx={{ fontSize: 32 }} />}
            title="You have not enrolled in any courses yet"
            description="Explore our industry-aligned catalog and start your personalized learning journey today."
            actionLabel="Browse Course Catalog"
            onAction={() => navigate('/courses')}
          />
        ) : (
          <Grid container spacing={3.5}>
            {enrollments.map((item) => {
              const course = item.courseId;
              if (!course) return null;

              const totalLessons = course.curriculum?.length || 1;
              const completedCount = item.completedLessons?.length || 0;
              const remainingCount = Math.max(0, totalLessons - completedCount);
              const isCompleted = item.status === 'completed';

              return (
                <Grid item xs={12} md={6} key={item._id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={course.thumbnail}
                        alt={course.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <Chip
                        label={isCompleted ? 'COMPLETED' : `${item.progress || 0}% PROGRESS`}
                        color={isCompleted ? 'success' : 'primary'}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          fontWeight: 700,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        }}
                      />
                      <Chip
                        label={course.category}
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 12,
                          left: 12,
                          bgcolor: 'rgba(15, 23, 42, 0.85)',
                          color: '#ffffff',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                        {course.title}
                      </Typography>

                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                        Enrolled on {new Date(item.enrolledAt).toLocaleDateString()} • {item.paymentStatus === 'paid' ? 'Paid ($' + course.price + ')' : 'Free Enrollment'}
                      </Typography>

                      {/* Progress Bar */}
                      <Box sx={{ mb: 2 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                            Course Progress
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#0a66c2' }}>
                            {completedCount} / {totalLessons} lessons ({item.progress || 0}%)
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={item.progress || 0}
                          sx={{ height: 8, borderRadius: 4, bgcolor: '#e2e8f0' }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {isCompleted
                          ? '🎉 All curriculum requirements satisfied and assessment passed.'
                          : `${remainingCount} lesson(s) remaining to qualify for certification.`}
                      </Typography>

                      {/* Action Buttons */}
                      <Box sx={{ mt: 'auto' }}>
                        <Divider sx={{ mb: 2 }} />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                          <Button
                            fullWidth
                            variant="contained"
                            color={isCompleted ? 'secondary' : 'primary'}
                            startIcon={isCompleted ? <CompletedIcon /> : <ContinueIcon />}
                            onClick={() => navigate(`/courses/${course._id}/learn`)}
                            sx={{ borderRadius: 2 }}
                          >
                            {isCompleted ? 'Review Course' : 'Continue Learning'}
                          </Button>

                          {isCompleted && (
                            <Button
                              fullWidth
                              variant="outlined"
                              color="primary"
                              startIcon={<CertificateIcon />}
                              onClick={() => navigate('/certificates')}
                              sx={{ borderRadius: 2 }}
                            >
                              Certificate
                            </Button>
                          )}
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default MyCoursesPage;
