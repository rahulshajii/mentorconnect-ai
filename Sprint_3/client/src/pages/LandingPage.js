import React from 'react';
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
import MainLayout from '../layouts/MainLayout';

const LandingPage = () => {
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
                    to="/register"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SearchIcon />}
                    sx={{ px: 3.5, py: 1.5, fontSize: '1.05rem', borderRadius: 6, bgcolor: '#ffffff', color: '#0a66c2', '&:hover': { bgcolor: '#f4f5f7' } }}
                  >
                    Search Mentors
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ px: 3.5, py: 1.5, fontSize: '1.05rem', borderRadius: 6, borderColor: '#ffffff', color: '#ffffff', '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
                  >
                    Become a Mentor
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. Trusted by Professionals Bar */}
      <Box sx={{ bgcolor: '#ffffff', py: 4, borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Typography variant="overline" color="text.secondary" align="center" display="block" sx={{ fontWeight: 700, mb: 2, letterSpacing: 1 }}>
            TRUSTED BY LEARNERS AND MENTORS WORLDWIDE
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>10,000+</Typography>
              <Typography variant="body2" color="text.secondary">Active Learners</Typography>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" sx={{ fontWeight: 800 }}>1,200+</Typography>
              <Typography variant="body2" color="text.secondary">Verified Mentors</Typography>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>98%</Typography>
              <Typography variant="body2" color="text.secondary">Satisfaction Rate</Typography>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" sx={{ fontWeight: 800 }}>4.9 / 5.0</Typography>
              <Typography variant="body2" color="text.secondary">Average Rating</Typography>
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
                <Button component={Link} to="/register" variant="contained" sx={{ bgcolor: '#ffffff', color: '#0a66c2', fontWeight: 700, '&:hover': { bgcolor: '#f4f5f7' } }}>
                  Explore Platform
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* 4. Popular Mentorship Categories */}
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
                <Card sx={{ p: 3, '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s' } }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0a66c2' }}>{cat}</Typography>
                  <Typography variant="body2" color="text.secondary">Connect with industry experts for structured 1-on-1 mentorship.</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. Featured Mentors */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#191919' }}>
            Featured Mentors
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Learn directly from top industry leaders.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            { name: 'Sarah Jenkins', title: 'Senior Tech Lead', experience: '8 Years', rate: '$75/hr', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
            { name: 'Dr. Alex Rivera', title: 'AI Staff Researcher', experience: '10 Years', rate: '$90/hr', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
            { name: 'Michael Chang', title: 'Principal System Architect', experience: '12 Years', rate: '$110/hr', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
          ].map((m, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Avatar src={m.img} sx={{ width: 80, height: 80, mx: 'auto', mb: 2, border: '3px solid #0a66c2' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{m.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{m.title} • {m.experience}</Typography>
                <Chip label={m.rate} size="small" color="primary" sx={{ fontWeight: 700, mb: 2 }} />
                <Button component={Link} to="/register" fullWidth variant="outlined" color="primary">
                  View Profile & Book
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default LandingPage;
