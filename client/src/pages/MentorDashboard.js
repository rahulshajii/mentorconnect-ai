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
  Stack,
  Paper,
  Rating,
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  Edit as EditIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';

const MentorDashboard = () => {
  const { user, profile } = useAuth();

  return (
    <DashboardLayout>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 1. Hero Banner with High-Contrast Unsplash Background */}
        <Card sx={{ mb: 4, overflow: 'hidden', borderRadius: 4, position: 'relative', border: 'none' }}>
          <Box
            sx={{
              height: 180,
              backgroundImage:
                'url(https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Dark Overlay for WCAG Text Contrast */}
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
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip label="Verified Mentor" color="success" size="small" sx={{ fontWeight: 700 }} />
                  <Chip
                    icon={<StarIcon sx={{ fontSize: '14px !important', color: '#f59e0b !important' }} />}
                    label={`${profile?.rating || 5.0} Rating`}
                    size="small"
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontWeight: 700 }}
                  />
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffffff', mb: 0.5 }}>
                  Welcome back, {user?.name}!
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                  Hourly Rate: <strong>${profile?.sessionPrice || profile?.hourlyFee || 50}/hr</strong> • Experience: {profile?.experience || 1} Years
                </Typography>
              </Grid>

              <Grid item>
                <Button
                  component={Link}
                  to="/profile"
                  variant="outlined"
                  sx={{ color: '#ffffff', borderColor: '#ffffff', borderRadius: 6, fontWeight: 700 }}
                  startIcon={<EditIcon />}
                >
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 2. Key Metrics Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, borderLeft: '4px solid #0a66c2' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Active Students</Typography>
                  <PeopleIcon color="primary" />
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#191919' }}>14</Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>+2 new this week</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, borderLeft: '4px solid #eab308' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Pending Sessions</Typography>
                  <EventIcon sx={{ color: '#eab308' }} />
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#191919' }}>3</Typography>
                <Typography variant="caption" color="warning.main" sx={{ fontWeight: 700 }}>Action Required</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, borderLeft: '4px solid #057642' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Active Slots</Typography>
                  <AccessTimeIcon color="success" />
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#191919' }}>{profile?.availability?.length || 1}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Available Schedule</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, borderLeft: '4px solid #14b8a6' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Estimated Revenue</Typography>
                  <AttachMoneyIcon color="primary" />
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0a66c2' }}>$1,850</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Monthly Total</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 3. Main Content Columns */}
        <Grid container spacing={3}>
          {/* Left Column: Today's Schedule & Availability */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 3, p: 1, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#191919' }}>
                  <TimelineIcon color="primary" /> Today's Mentoring Schedule
                </Typography>
                <Stack spacing={2}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', borderLeft: '4px solid #0a66c2' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>System Architecture & Code Review</Typography>
                        <Typography variant="caption" color="text.secondary">Student: Rahul Shaji • 02:00 PM - 03:00 PM PST</Typography>
                      </Box>
                      <Chip label="Upcoming" color="primary" size="small" sx={{ fontWeight: 700 }} />
                    </Stack>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', borderLeft: '4px solid #057642' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Full-Stack Career Guidance</Typography>
                        <Typography variant="caption" color="text.secondary">Student: Sarah Jenkins • 04:30 PM - 05:30 PM PST</Typography>
                      </Box>
                      <Chip label="Confirmed" color="success" size="small" sx={{ fontWeight: 700 }} />
                    </Stack>
                  </Paper>
                </Stack>
              </CardContent>
            </Card>

            {/* Configured Availability */}
            <Card sx={{ borderRadius: 3, p: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#191919' }}>
                  <AccessTimeIcon color="success" /> Configured Availability Windows
                </Typography>
                <Stack spacing={1}>
                  {profile?.availability?.map((slot, idx) => (
                    <Box key={idx} sx={{ p: 1.5, bgcolor: 'rgba(5, 118, 66, 0.08)', borderRadius: 2, border: '1px solid rgba(5, 118, 66, 0.2)', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ color: '#057642', fontSize: 18 }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#191919' }}>{slot}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Recent Student Reviews */}
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 3, p: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#191919' }}>
                  <StarIcon sx={{ color: '#f59e0b' }} /> Recent Student Reviews
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Rating value={5} readOnly size="small" />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>5.0</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#191919', mb: 1 }}>
                      "Extremely knowledgeable mentor! Provided clear architectural feedback on microservices."
                    </Typography>
                    <Typography variant="caption" color="text.secondary">— Verified Student</Typography>
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

export default MentorDashboard;
