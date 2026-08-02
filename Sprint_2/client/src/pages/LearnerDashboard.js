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
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';

const LearnerDashboard = () => {
  const { user, profile } = useAuth();

  return (
    <DashboardLayout>
      {/* 1. Welcome Card */}
      <Card sx={{ mb: 3, overflow: 'hidden' }}>
        <Box sx={{ height: 90, bgcolor: '#0a66c2', background: 'linear-gradient(90deg, #0a66c2 0%, #004182 100%)' }} />
        <CardContent sx={{ pt: 0, pb: 3, px: 3, position: 'relative' }}>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item sx={{ mt: -5 }}>
              <Avatar
                src={profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                alt={user?.name}
                sx={{ width: 90, height: 90, border: '4px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
              />
            </Grid>
            <Grid item xs sx={{ pt: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#191919' }}>
                Welcome back, {user?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                {profile?.careerGoal || 'Software Engineer & Technology Specialist'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.education || 'Computer Science & Software Systems'}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to="/profile"
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                sx={{ borderRadius: 6 }}
              >
                Edit Profile
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* 2. Profile Completion Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ h: '100%', p: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Profile Completion & Readiness
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                  85%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={85} color="primary" sx={{ height: 10, borderRadius: 5, mb: 2.5 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Chip icon={<CheckCircleIcon />} label="Education Set" size="small" color="success" sx={{ width: '100%', fontWeight: 600 }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Chip icon={<CheckCircleIcon />} label="Career Goal" size="small" color="success" sx={{ width: '100%', fontWeight: 600 }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Chip icon={<CheckCircleIcon />} label="Skills Added" size="small" color="success" sx={{ width: '100%', fontWeight: 600 }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Chip label="Assessment Pending" size="small" variant="outlined" color="warning" sx={{ width: '100%', fontWeight: 600 }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 3. Quick Actions Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ h: '100%', p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={1.5}>
                <Button
                  component={Link}
                  to="/profile"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<PersonIcon />}
                  sx={{ justifyContent: 'flex-start', py: 0.8 }}
                >
                  View & Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<SearchIcon />}
                  sx={{ justifyContent: 'flex-start', py: 0.8 }}
                >
                  Browse Mentors
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{ justifyContent: 'flex-start', py: 0.8 }}
                >
                  Submit Project
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 4. Recent Activity Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon color="primary" /> Recent Activity
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Account Profile Updated</Typography>
                    <Typography variant="caption" color="text.secondary">Updated skills & education background</Typography>
                  </Box>
                  <Chip label="Completed" size="small" color="success" />
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Registered on MentorConnect AI</Typography>
                    <Typography variant="caption" color="text.secondary">Learner account authenticated</Typography>
                  </Box>
                  <Chip label="Verified" size="small" color="info" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 5. Notifications Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon color="secondary" /> Notifications & System Alerts
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Welcome to MentorConnect AI!</Typography>
                  <Typography variant="caption" color="text.secondary">Your profile has been created successfully. Explore profile settings and mentor connections.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default LearnerDashboard;
