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
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';

const MentorDashboard = () => {
  const { user, profile } = useAuth();

  return (
    <DashboardLayout>
      {/* 1. Welcome Card */}
      <Card sx={{ mb: 3, overflow: 'hidden' }}>
        <Box sx={{ height: 90, bgcolor: '#057642', background: 'linear-gradient(90deg, #057642 0%, #024d2a 100%)' }} />
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
              <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                <Chip label="Verified Mentor" color="secondary" size="small" sx={{ fontWeight: 700, height: 22 }} />
                <Chip label={`${profile?.rating || 5.0} ★ Rating`} size="small" sx={{ bgcolor: 'rgba(234, 179, 8, 0.15)', color: '#b45309', fontWeight: 700, height: 22 }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#191919' }}>
                Welcome back, {user?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Hourly Mentoring Rate: <strong>${profile?.hourlyFee || 0} / hr</strong> • Experience: {profile?.experience || 0} Years
              </Typography>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to="/profile"
                variant="outlined"
                color="secondary"
                startIcon={<EditIcon />}
                sx={{ borderRadius: 6 }}
              >
                Edit Credentials
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* 2. Students Summary Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Active Students</Typography>
                <PeopleIcon color="primary" />
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#191919' }}>14</Typography>
              <Typography variant="caption" color="success.main">+2 this week</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 3. Requests Summary Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Pending Requests</Typography>
                <EventIcon color="secondary" />
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#191919' }}>3</Typography>
              <Typography variant="caption" color="warning.main">Action Needed</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 4. Availability Slot Count */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Availability Slots</Typography>
                <AccessTimeIcon color="success" />
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#191919' }}>{profile?.availability?.length || 1}</Typography>
              <Typography variant="caption" color="text.secondary">Active Schedule</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 5. Revenue Summary */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Mentorship Earnings</Typography>
                <AttachMoneyIcon color="primary" />
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0a66c2' }}>$1,850</Typography>
              <Typography variant="caption" color="text.secondary">This month</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 6. Availability Details Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="primary" /> Configured Availability Schedule
              </Typography>
              <Stack spacing={1}>
                {profile?.availability?.map((slot, idx) => (
                  <Box key={idx} sx={{ p: 1.5, bgcolor: 'rgba(5, 118, 66, 0.08)', border: '1px solid rgba(5, 118, 66, 0.2)', borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="small" sx={{ color: '#057642' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{slot}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 7. Notifications Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon color="secondary" /> Notifications & System Alerts
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Mentor Credentials Active</Typography>
                  <Typography variant="caption" color="text.secondary">Your profile is visible to registered learners on MentorConnect AI.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default MentorDashboard;
