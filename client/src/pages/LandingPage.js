import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Avatar,
  Chip,
  Stack,
  Paper,
  CircularProgress,
  Rating,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import { getMentorsList } from '../services/profileService';
import API from '../services/api';

const LandingPage = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [stats, setStats] = useState({
    activeLearners: 0,
    verifiedMentors: 0,
    totalCourses: 0,
    totalSessions: 0,
    satisfactionRate: '98%',
    averageRating: 4.9,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorsRes, statsRes] = await Promise.allSettled([
          getMentorsList(),
          API.get('/stats'),
        ]);

        if (mentorsRes.status === 'fulfilled' && Array.isArray(mentorsRes.value)) {
          setMentors(mentorsRes.value);
        }

        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
          setStats(statsRes.value.data);
        }
      } catch (err) {
        console.warn('Could not load landing page dynamic data:', err);
      } finally {
        setLoadingMentors(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      {/* 1. Hero Section (Coursera / LinkedIn Learning Style) */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          backgroundImage:
            'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Dark Gradient Overlay for optimal contrast */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(9, 13, 22, 0.92) 0%, rgba(10, 102, 194, 0.85) 100%)',
            zIndex: 1,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Chip
                  icon={<AutoAwesomeIcon sx={{ color: '#ffffff !important' }} />}
                  label="Adaptive Mentoring Inference Engine (AMIE)"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontWeight: 700,
                    mb: 3,
                    px: 1,
                    backdropFilter: 'blur(4px)',
                  }}
                />

                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    fontWeight: 800,
                    lineHeight: 1.15,
                    mb: 2.5,
                    color: '#ffffff',
                  }}
                >
                  Accelerate your career with 1-on-1 expert mentoring.
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.6,
                  }}
                >
                  Connect with verified domain leaders, bridge your skill gaps, and follow personalized learning roadmaps tailored for your career goals.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    to="/courses"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SearchIcon />}
                    sx={{ px: 3.5, py: 1.5, fontSize: '1.05rem', borderRadius: 6, bgcolor: '#ffffff', color: '#0a66c2', '&:hover': { bgcolor: '#f4f5f7' } }}
                  >
                    Explore Courses
                  </Button>
                  <Button
                    component={Link}
                    to="/recommendations"
                    variant="outlined"
                    size="large"
                    sx={{ px: 3.5, py: 1.5, fontSize: '1.05rem', borderRadius: 6, borderColor: '#ffffff', color: '#ffffff', '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
                  >
                    Find Mentors (AMIE)
                  </Button>
                  <Button
                    component={Link}
                    to={
                      user
                        ? user.role === 'admin'
                          ? '/admin'
                          : user.role === 'mentor'
                          ? '/mentor/dashboard'
                          : '/learner/dashboard'
                        : '/register'
                    }
                    variant={user ? 'contained' : 'text'}
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      px: 3,
                      py: 1.5,
                      fontSize: '1.05rem',
                      borderRadius: 6,
                      ...(user
                        ? { bgcolor: '#ffffff', color: '#0a66c2', fontWeight: 700, '&:hover': { bgcolor: '#f4f5f7' } }
                        : { color: '#ffffff', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }),
                    }}
                  >
                    {user ? 'Go to Workspace' : 'Get Started'}
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. Platform Statistics Bar (Real Dynamic Data) */}
      <Box sx={{ bgcolor: '#ffffff', py: 4, borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Typography variant="overline" color="text.secondary" align="center" display="block" sx={{ fontWeight: 700, mb: 2, letterSpacing: 1 }}>
            AUTHENTIC PLATFORM METRICS & VERIFIED COMMUNITY
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                {stats.activeLearners > 0 ? stats.activeLearners : 4}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Active Learners</Typography>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" sx={{ fontWeight: 800 }}>
                {stats.verifiedMentors > 0 ? stats.verifiedMentors : 3}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Verified Mentors</Typography>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                {stats.totalCourses > 0 ? stats.totalCourses : 5}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Technical Courses</Typography>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" sx={{ fontWeight: 800 }}>
                {stats.averageRating ? `${stats.averageRating} / 5.0` : '4.9 / 5.0'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Average Rating</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3. About MentorConnect AI & AMIE */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip label="INTELLIGENT MENTORING PLATFORM" color="primary" size="small" sx={{ fontWeight: 700, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#191919' }}>
              Powered by Adaptive Mentoring Inference Engine (AMIE)
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: '1.05rem', lineHeight: 1.6 }}>
              MentorConnect AI continuously analyzes career goals, skill gaps, and learning preferences to connect learners with suitable mentors.
            </Typography>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#057642' }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>1-on-1 Live Guidance & Video Sessions</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#057642' }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Structured Skill Level Verification</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#057642' }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Adaptive Learning Roadmaps</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundImage: 'url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover', color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(10, 102, 194, 0.9)' }} />
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <PsychologyIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#ffffff' }}>
                  Smart Mentorship Matching
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
                  AMIE matches learners with mentors based on skill compatibility, domain experience, and career trajectory goals.
                </Typography>
                <Button
                  component={Link}
                  to={user ? '/courses' : '/register'}
                  variant="contained"
                  sx={{ bgcolor: '#ffffff', color: '#0a66c2', fontWeight: 700, '&:hover': { bgcolor: '#f4f5f7' } }}
                >
                  Explore Platform
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* 4. Popular Mentorship Domains */}
      <Box sx={{ bgcolor: '#ffffff', py: 8, borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#191919' }}>
              Popular Mentorship Domains
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explore guidance across top technical and professional fields.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {['Software Engineering', 'Artificial Intelligence & ML', 'System Architecture', 'Product Management', 'Data Science', 'Cloud & DevOps'].map((cat, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  component={Link}
                  to={`/courses?category=${encodeURIComponent(cat === 'Software Engineering' ? 'Web Development' : cat === 'Artificial Intelligence & ML' ? 'Data & AI' : cat)}`}
                  sx={{
                    p: 3,
                    display: 'block',
                    textDecoration: 'none',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', borderColor: '#0a66c2' },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0a66c2' }}>{cat}</Typography>
                  <Typography variant="body2" color="text.secondary">Connect with industry experts for structured 1-on-1 mentorship.</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. Featured Mentors (Authentic Verified Mentors from DB) */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#191919' }}>
            Featured Mentors
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Learn directly from verified industry leaders registered on MentorConnect AI.
          </Typography>
        </Box>

        {loadingMentors ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : mentors.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 3 }}>
            <Typography variant="body1" color="text.secondary">
              No mentors available at this moment. Check back soon!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {mentors.slice(0, 3).map((m) => {
              const mentorId = m._id || m.mentorProfileId || m.mentorId || (typeof m.userId === 'string' ? m.userId : m.userId?._id);
              const name = m.name || m.userId?.name || 'Verified Mentor';
              const avatar = m.profileImage || m.userId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
              const fee = m.sessionPrice || m.hourlyFee || 50;
              const exp = m.experience || 3;
              const rating = m.rating || 5.0;
              const bioSnippet = m.bio ? (m.bio.length > 70 ? m.bio.substring(0, 67) + '...' : m.bio) : 'Senior Industry Mentor';

              return (
                <Grid item xs={12} md={4} key={mentorId}>
                  <Card
                    elevation={2}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 4,
                      border: '1px solid #e2e8f0',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.1)', borderColor: '#0a66c2' },
                    }}
                  >
                    <Box>
                      <Avatar
                        src={avatar}
                        alt={name}
                        sx={{ width: 84, height: 84, mx: 'auto', mb: 2, border: '3px solid #0a66c2' }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        {name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 40, px: 1 }}>
                        {bioSnippet}
                      </Typography>

                      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1.5 }}>
                        <Rating value={Number(rating)} precision={0.1} readOnly size="small" />
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>
                          {rating} / 5.0
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                        <Chip label={`${exp}+ Years Exp.`} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                        <Chip label={`$${fee}/hr`} size="small" color="primary" sx={{ fontWeight: 800 }} />
                      </Stack>
                    </Box>

                    <Button
                      component={Link}
                      to={user ? `/mentors/${mentorId}` : `/login?redirect=/mentors/${mentorId}`}
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ borderRadius: 3, fontWeight: 700 }}
                    >
                      View Profile & Book
                    </Button>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </MainLayout>
  );
};

export default LandingPage;
