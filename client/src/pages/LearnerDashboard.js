import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Stack,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  AutoAwesome as AutoAwesomeIcon,
  Event as EventIcon,
  FormatQuote as FormatQuoteIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';

const LearnerDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 1. Hero Welcome Banner with High-Contrast Unsplash Background */}
        <Card sx={{ mb: 4, overflow: 'hidden', borderRadius: 4, position: 'relative', border: 'none' }}>
          <Box
            sx={{
              height: 180,
              backgroundImage:
                'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Subtle Dark Overlay for Optimal WCAG Contrast */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.85) 100%)',
            }}
          />

          <CardContent sx={{ position: 'relative', zIndex: 2, p: { xs: 3, sm: 4 }, mt: -12, color: '#ffffff' }}>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item>
                <Avatar
                  src={profile?.profileImage || profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                  alt={user?.name}
                  sx={{
                    width: 100,
                    height: 100,
                    border: '4px solid #ffffff',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffffff', mb: 0.5, lineHeight: 1.2 }}>
                  Welcome back, {user?.name}!
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                  Target Career Goal: {profile?.careerGoal || 'Full-Stack Engineer & Technology Specialist'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.75)', display: 'block' }}>
                  {profile?.education || 'Computer Science & Software Systems'}
                </Typography>
              </Grid>

              <Grid item>
                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={() => navigate('/recommendations')}
                    sx={{ borderRadius: 6, fontWeight: 700, px: 2.5 }}
                  >
                    View AMIE Mentors
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ color: '#ffffff', borderColor: '#ffffff', borderRadius: 6, fontWeight: 700 }}
                    component={Link}
                    to="/profile"
                    startIcon={<EditIcon />}
                  >
                    Edit Profile
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 2. Quick Actions Row */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              onClick={() => navigate('/quiz')}
              sx={{
                p: 2.5,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 16px rgba(0,0,0,0.1)' },
                borderLeft: '4px solid #0a66c2',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(10, 102, 194, 0.1)', color: '#0a66c2' }}>
                  <PsychologyIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#191919' }}>
                    Skill Assessment
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Test React, Node.js & Architecture
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              onClick={() => navigate('/skill-gap')}
              sx={{
                p: 2.5,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 16px rgba(0,0,0,0.1)' },
                borderLeft: '4px solid #eab308',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#191919' }}>
                    Skill Gap Analysis
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Compare goal readiness
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              onClick={() => navigate('/recommendations')}
              sx={{
                p: 2.5,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 16px rgba(0,0,0,0.1)' },
                borderLeft: '4px solid #14b8a6',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(20, 184, 166, 0.1)', color: '#14b8a6' }}>
                  <AutoAwesomeIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#191919' }}>
                    AMIE Mentors
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Explainable AI matches
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              onClick={() => navigate('/profile')}
              sx={{
                p: 2.5,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 16px rgba(0,0,0,0.1)' },
                borderLeft: '4px solid #057642',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(5, 118, 66, 0.1)', color: '#057642' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#191919' }}>
                    Profile Settings
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Upload avatar & cover
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* 3. Main Dashboard Widgets Grid */}
        <Grid container spacing={3}>
          {/* Readiness & Progress Card */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, p: 1, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#191919' }}>
                    Learning Progress & Goal Readiness
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
                    78% Ready
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={78} sx={{ height: 10, borderRadius: 5, mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Chip icon={<CheckCircleIcon />} label="React (Advanced)" size="small" color="success" sx={{ width: '100%', fontWeight: 700 }} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Chip icon={<CheckCircleIcon />} label="Node.js (Inter)" size="small" color="success" sx={{ width: '100%', fontWeight: 700 }} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Chip label="System Arch (Test)" size="small" variant="outlined" color="warning" sx={{ width: '100%', fontWeight: 700 }} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Chip label="GraphQL (Missing)" size="small" variant="outlined" color="error" sx={{ width: '100%', fontWeight: 700 }} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Recent Activity Log */}
            <Card sx={{ borderRadius: 3, p: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon color="primary" /> Recent Activity Log
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>AMIE Recommendation Match Generated</Typography>
                      <Typography variant="caption" color="text.secondary">89% Match score calculated for System Architecture mentor</Typography>
                    </Box>
                    <Chip label="Recommended" size="small" color="primary" sx={{ fontWeight: 700 }} />
                  </Box>

                  <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Profile Photos & Social Links Updated</Typography>
                      <Typography variant="caption" color="text.secondary">Custom profile picture and cover banner uploaded</Typography>
                    </Box>
                    <Chip label="Updated" size="small" color="success" sx={{ fontWeight: 700 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Sidebar Widgets */}
          <Grid item xs={12} md={4}>
            {/* Calendar & Session Schedule Widget */}
            <Card sx={{ borderRadius: 3, p: 1, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon color="secondary" /> Upcoming Schedule
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', borderLeft: '4px solid #0a66c2' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    1-on-1 System Design Mentorship
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Tomorrow • 10:00 AM PST
                  </Typography>
                  <Chip label="Confirmed" size="small" color="success" sx={{ mt: 1, fontWeight: 700, height: 20 }} />
                </Paper>
              </CardContent>
            </Card>

            {/* Motivational Quote Widget */}
            <Card sx={{ borderRadius: 3, p: 1, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
                  <FormatQuoteIcon sx={{ color: '#057642', fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 600, color: '#14532d' }}>
                      "The expert in anything was once a beginner. Consistent guidance accelerates mastery."
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#057642', mt: 1, display: 'block' }}>
                      — MentorConnect AI Daily Inspiration
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default LearnerDashboard;
