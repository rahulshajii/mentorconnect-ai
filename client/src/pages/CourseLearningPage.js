import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon,
  PlayCircle as PlayIcon,
  WorkspacePremium as CertificateIcon,
  Quiz as QuizIcon,
  Download as DownloadIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import AnimatedSuccessCheckmark from '../components/AnimatedSuccessCheckmark';
import * as courseService from '../services/courseService';
import * as certificateService from '../services/certificateService';

const CourseLearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);

  // Assessment modal states
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentAnswers, setAssessmentAnswers] = useState({});
  const [submittingExam, setSubmittingExam] = useState(false);
  const [completionResult, setCompletionResult] = useState(null);

  const fetchCourseAndEnrollment = async () => {
    setLoading(true);
    try {
      const courseData = await courseService.getCourseById(id);
      setCourse(courseData);

      const myCourses = await courseService.getMyCourses();
      const currentEnrollment = myCourses.find(
        (e) => (e.courseId?._id || e.courseId).toString() === courseData._id.toString()
      );

      if (!currentEnrollment) {
        toast.error('You are not currently enrolled in this course.');
        navigate(`/courses/${courseData._id}`);
        return;
      }

      setEnrollment(currentEnrollment);
    } catch (err) {
      console.error('Error fetching course learning data:', err);
      toast.error('Could not load course workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCourseAndEnrollment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const curriculum = course?.curriculum || [];
  const currentLesson = curriculum[currentLessonIdx] || null;
  const completedLessons = new Set(enrollment?.completedLessons || []);
  const isCurrentLessonComplete = currentLesson && completedLessons.has(currentLesson.lessonId);
  const allLessonsCompleted =
    curriculum.length > 0 && curriculum.every((l) => completedLessons.has(l.lessonId));

  // Toggle lesson complete state
  const handleToggleLessonComplete = async () => {
    if (!currentLesson) return;

    setSavingProgress(true);
    const newStatus = !isCurrentLessonComplete;
    try {
      const res = await courseService.updateLessonProgress(course._id, currentLesson.lessonId, newStatus);
      setEnrollment((prev) => ({
        ...prev,
        progress: res.progress,
        completedLessons: res.completedLessons,
      }));

      if (newStatus) {
        toast.success(`Lesson marked as completed! (+${Math.round(100 / curriculum.length)}%)`);
        // If not last lesson, automatically advance
        if (currentLessonIdx < curriculum.length - 1) {
          setCurrentLessonIdx(currentLessonIdx + 1);
        }
      } else {
        toast('Lesson marked as incomplete');
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      toast.error('Failed to update progress');
    } finally {
      setSavingProgress(false);
    }
  };

  // Submit course final assessment
  const handleAssessmentSubmit = async () => {
    setSubmittingExam(true);
    try {
      const result = await courseService.completeCourse(course._id, assessmentAnswers);
      setCompletionResult(result);
      setEnrollment((prev) => ({ ...prev, status: 'completed', progress: 100 }));
      toast.success('Course assessment passed and certificate generated!');
    } catch (err) {
      console.error('Course completion failed:', err);
      const msg = err.response?.data?.message || err.message || 'Assessment submission failed';
      toast.error(msg);
    } finally {
      setSubmittingExam(false);
    }
  };

  // Download PDF Certificate
  const handleDownloadCertificate = async (certificateId) => {
    try {
      await certificateService.downloadCertificatePdf(certificateId);
      toast.success('Certificate PDF downloaded successfully!');
    } catch (err) {
      toast.error('Error downloading certificate PDF');
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

  if (!course || !currentLesson) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Unable to load course modules
          </Typography>
          <Button variant="contained" component={Link} to="/my-courses">
            Back to My Courses
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ bgcolor: '#0f172a', color: '#ffffff', py: 2, borderBottom: '1px solid #1e293b' }}>
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" useFlexGap>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                size="small"
                startIcon={<BackIcon />}
                onClick={() => navigate('/my-courses')}
                sx={{ color: '#ffffff', borderColor: '#334155' }}
              >
                My Courses
              </Button>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                {course.title}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Overall Progress: {enrollment?.progress || 0}%
              </Typography>
              <Box sx={{ width: 140 }}>
                <LinearProgress
                  variant="determinate"
                  value={enrollment?.progress || 0}
                  sx={{ height: 6, borderRadius: 3, bgcolor: '#334155' }}
                />
              </Box>

              {enrollment?.status === 'completed' && (
                <Chip label="COMPLETED" color="success" size="small" sx={{ fontWeight: 700 }} />
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main Workspace: Lesson Sidebar + Video Viewer */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Video & Content Viewer */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 0, overflow: 'hidden', borderRadius: 3, bgcolor: '#000000', mb: 3 }}>
              {/* Responsive Video Container */}
              <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: '#000000' }}>
                <iframe
                  src={currentLesson.videoUrl || 'https://www.youtube.com/embed/SqcY0GlETPk'}
                  title={currentLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </Box>
            </Paper>

            {/* Lesson Title & Controls Bar */}
            <Paper sx={{ p: 3.5, borderRadius: 3, mb: 4 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0a66c2' }}>
                    LESSON {currentLessonIdx + 1} OF {curriculum.length}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {currentLesson.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Duration: {currentLesson.duration}
                  </Typography>
                </Box>

                {/* Mark as Complete Button */}
                <Button
                  variant={isCurrentLessonComplete ? 'outlined' : 'contained'}
                  color={isCurrentLessonComplete ? 'secondary' : 'primary'}
                  disabled={savingProgress}
                  startIcon={isCurrentLessonComplete ? <CheckIcon /> : <PlayIcon />}
                  onClick={handleToggleLessonComplete}
                  sx={{ borderRadius: 2, px: 3, py: 1 }}
                >
                  {isCurrentLessonComplete ? 'Completed (Undo)' : 'Mark as Complete'}
                </Button>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#334155' }}>
                Module Overview:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {currentLesson.description ||
                  'Engage with the comprehensive lecture video above. Follow along with code patterns, take notes, and complete all required lessons to unlock your verified Certificate of Completion.'}
              </Typography>
            </Paper>

            {/* Certificate Unlock Banner */}
            {allLessonsCompleted && (
              <Alert
                icon={<CertificateIcon sx={{ fontSize: 28 }} />}
                severity="success"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  alignItems: 'center',
                  '& .MuiAlert-message': { width: '100%' },
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
                  <Box sx={{ mb: { xs: 1.5, sm: 0 } }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      All Lessons Complete!
                    </Typography>
                    <Typography variant="body2">
                      Pass the final course assessment to verify proficiency and claim your official certificate.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<QuizIcon />}
                    onClick={() => setShowAssessment(true)}
                    sx={{ borderRadius: 2, fontWeight: 700, whiteSpace: 'nowrap' }}
                  >
                    Take Assessment
                  </Button>
                </Stack>
              </Alert>
            )}
          </Grid>

          {/* Curriculum Sidebar */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                Curriculum Lessons
              </Typography>

              <List disablePadding>
                {curriculum.map((lesson, idx) => {
                  const isDone = completedLessons.has(lesson.lessonId);
                  const isActive = idx === currentLessonIdx;

                  return (
                    <ListItem key={lesson.lessonId} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        selected={isActive}
                        onClick={() => setCurrentLessonIdx(idx)}
                        sx={{
                          borderRadius: 2,
                          py: 1.5,
                          border: isActive ? '1.5px solid #0a66c2' : '1px solid transparent',
                          bgcolor: isActive ? 'rgba(10, 102, 194, 0.08) !important' : 'inherit',
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {isDone ? (
                            <CheckIcon sx={{ color: '#057642', fontSize: 20 }} />
                          ) : (
                            <UncheckedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${idx + 1}. ${lesson.title}`}
                          secondary={lesson.duration}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? '#0a66c2' : '#1e293b',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>

              <Divider sx={{ my: 2.5 }} />

              {/* Assessment Action */}
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  fullWidth
                  variant={allLessonsCompleted ? 'contained' : 'outlined'}
                  color="secondary"
                  disabled={!allLessonsCompleted}
                  startIcon={<QuizIcon />}
                  onClick={() => setShowAssessment(true)}
                  sx={{ py: 1.2, borderRadius: 2, fontWeight: 700 }}
                >
                  {enrollment?.status === 'completed' ? 'Review Assessment' : 'Final Assessment & Certificate'}
                </Button>
                {!allLessonsCompleted && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Complete all lessons to unlock final assessment
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* ASSESSMENT DIALOG */}
      <Dialog
        open={showAssessment}
        onClose={() => setShowAssessment(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>
          {course.title} — Course Assessment
        </DialogTitle>
        <DialogContent dividers>
          {completionResult ? (
            /* Assessment Passed Celebration */
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <AnimatedSuccessCheckmark size={100} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#057642', mb: 1 }}>
                Assessment Passed!
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', mb: 2 }}>
                You scored <strong>{completionResult.score}%</strong>. Your verified Certificate of Completion has been issued!
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0a66c2', mb: 3 }}>
                Certificate ID: <code>{completionResult.certificateId}</code>
              </Typography>

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownloadCertificate(completionResult.certificateId)}
                  sx={{ py: 1.2, px: 3, borderRadius: 2 }}
                >
                  Download Certificate (PDF)
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowAssessment(false);
                    navigate('/certificates');
                  }}
                  sx={{ py: 1.2, px: 3, borderRadius: 2 }}
                >
                  View All Certificates
                </Button>
              </Stack>
            </Box>
          ) : (
            /* Assessment Questions */
            <Box>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Answer the technical questions below. You must score at least <strong>70%</strong> to pass and qualify for your platform credential.
              </Alert>

              {(course.assessment || []).map((q, idx) => (
                <Box key={q.questionId} sx={{ mb: 3.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 1.5 }}>
                    Question {idx + 1}: {q.question}
                  </Typography>

                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={assessmentAnswers[q.questionId] || ''}
                      onChange={(e) =>
                        setAssessmentAnswers({
                          ...assessmentAnswers,
                          [q.questionId]: e.target.value,
                        })
                      }
                    >
                      {q.options.map((opt, optIdx) => (
                        <FormControlLabel
                          key={optIdx}
                          value={opt}
                          control={<Radio />}
                          label={opt}
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            border: '1px solid #e2e8f0',
                            mb: 1,
                            '&:hover': { bgcolor: '#f8fafc' },
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          {!completionResult && (
            <>
              <Button onClick={() => setShowAssessment(false)}>Cancel</Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={submittingExam}
                onClick={handleAssessmentSubmit}
                startIcon={submittingExam && <CircularProgress size={18} color="inherit" />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {submittingExam ? 'Grading Assessment...' : 'Submit & Claim Certificate'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default CourseLearningPage;
