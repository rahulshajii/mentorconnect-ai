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
  TextField,
  Chip,
  Stack,
  InputAdornment,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Rating,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  School as CourseIcon,
  AccessTime as TimeIcon,
  PlayCircle as PlayIcon,
  CheckCircle as EnrolledIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import * as courseService from '../services/courseService';

const CATEGORIES = ['All', 'Web Development', 'System Design', 'Data & AI', 'Cloud & DevOps'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const PRICE_FILTERS = ['All', 'Free', 'Paid'];

const CourseCatalogPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourses({
        search,
        category: category !== 'All' ? category : '',
        level: level !== 'All' ? level : '',
        price: priceFilter,
      });
      setCourses(data.courses || []);

      // If learner logged in, fetch their enrolled course IDs
      if (user && user.role === 'learner') {
        try {
          const myCourses = await courseService.getMyCourses();
          const enrolledSet = new Set(myCourses.map((e) => (e.courseId?._id || e.courseId).toString()));
          setEnrolledCourseIds(enrolledSet);
        } catch (e) {
          console.warn('Could not load user enrollments:', e);
        }
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, level, priceFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: '#f4f5f7', minHeight: '100vh', pb: 8 }}>
        {/* Hero Banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
            color: '#ffffff',
            py: { xs: 6, md: 8 },
            mb: 4,
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.5px' }}>
              Explore Career-Advancing Courses
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 700, mb: 4 }}>
              Industry-aligned technical courses designed by leading engineering mentors. Learn at your own pace, complete verified assessments, and earn cryptographic certificates.
            </Typography>

            {/* Search Bar */}
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                p: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                maxWidth: 650,
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
            >
              <TextField
                fullWidth
                placeholder="Search courses by topic, skill, or instructor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 1.5 }}>
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ ml: 1, flex: 1 }}
              />
              <Button type="submit" variant="contained" sx={{ px: 3, borderRadius: 2 }}>
                Search
              </Button>
            </Paper>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {/* Category Tabs */}
          <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
            <Tabs
              value={category}
              onChange={(e, val) => setCategory(val)}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
              sx={{ px: 2, minHeight: 52 }}
            >
              {CATEGORIES.map((cat) => (
                <Tab key={cat} label={cat} value={cat} sx={{ fontWeight: 600, py: 2 }} />
              ))}
            </Tabs>
          </Paper>

          {/* Secondary Filters Bar */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 4 }}
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b', mr: 1 }}>
                Level:
              </Typography>
              {LEVELS.map((lvl) => (
                <Chip
                  key={lvl}
                  label={lvl}
                  clickable
                  color={level === lvl ? 'primary' : 'default'}
                  variant={level === lvl ? 'filled' : 'outlined'}
                  onClick={() => setLevel(lvl)}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b', mr: 1 }}>
                Price:
              </Typography>
              {PRICE_FILTERS.map((p) => (
                <Chip
                  key={p}
                  label={p}
                  clickable
                  color={priceFilter === p ? 'secondary' : 'default'}
                  variant={priceFilter === p ? 'filled' : 'outlined'}
                  onClick={() => setPriceFilter(p)}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Stack>
          </Stack>

          {/* Courses Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress size={48} />
            </Box>
          ) : courses.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <CourseIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                No Courses Found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search query, category, or filter criteria.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setLevel('All');
                  setPriceFilter('All');
                }}
              >
                Reset All Filters
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3.5}>
              {courses.map((course) => {
                const isEnrolled = enrolledCourseIds.has(course._id);
                return (
                  <Grid item xs={12} sm={6} md={4} key={course._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                        },
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
                          label={course.isFree ? 'FREE' : `$${course.price}`}
                          color={course.isFree ? 'success' : 'primary'}
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
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

                      <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Rating value={course.rating || 4.9} precision={0.1} size="small" readOnly />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
                            ({course.rating || 4.9})
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            • {course.level}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="h6"
                          component={Link}
                          to={`/courses/${course._id}`}
                          sx={{
                            fontWeight: 700,
                            color: '#0f172a',
                            textDecoration: 'none',
                            mb: 1,
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            '&:hover': { color: '#0a66c2' },
                          }}
                        >
                          {course.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {course.description}
                        </Typography>

                        <Box sx={{ mt: 'auto' }}>
                          <Divider sx={{ my: 1.5 }} />
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <TimeIcon sx={{ fontSize: 16, color: '#64748b' }} />
                              <Typography variant="caption" color="text.secondary">
                                {course.duration || '6 Hours'}
                              </Typography>
                            </Stack>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                              By {course.instructorName || 'MentorConnect Faculty'}
                            </Typography>
                          </Stack>

                          {isEnrolled ? (
                            <Button
                              fullWidth
                              variant="outlined"
                              color="secondary"
                              startIcon={<EnrolledIcon />}
                              onClick={() => navigate(`/courses/${course._id}/learn`)}
                              sx={{ borderRadius: 2 }}
                            >
                              Continue Learning
                            </Button>
                          ) : (
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              startIcon={<PlayIcon />}
                              onClick={() => navigate(`/courses/${course._id}`)}
                              sx={{ borderRadius: 2 }}
                            >
                              View Course & Enroll
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>
    </MainLayout>
  );
};

export default CourseCatalogPage;
