import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  Stack,
  Divider,
  Grid,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Logout as LogoutIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';

const AuthenticatedView = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                bgcolor: 'rgba(5, 118, 66, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircleIcon sx={{ color: '#057642', fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#191919' }}>
                Authentication Successful
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You are securely logged into the MentorConnect AI platform.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* User Details Card */}
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
              <Avatar
                src={profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                alt={user?.name}
                sx={{ width: 100, height: 100, mx: 'auto', border: '3px solid #0a66c2', mb: 1.5 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#191919' }}>
                {user?.name}
              </Typography>
              <Chip
                icon={user?.role === 'mentor' ? <WorkIcon fontSize="small" /> : <SchoolIcon fontSize="small" />}
                label={user?.role === 'mentor' ? 'Mentor Role' : 'Learner Role'}
                color={user?.role === 'mentor' ? 'secondary' : 'primary'}
                sx={{ fontWeight: 700, mt: 0.5 }}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <Stack spacing={2}>
                <Box sx={{ p: 2, bgcolor: '#f4f5f7', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                    REGISTERED EMAIL ADDRESS
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#191919' }}>
                    {user?.email}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, bgcolor: '#f4f5f7', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                    JWT AUTHENTICATION TOKEN
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#0a66c2', wordBreak: 'break-all' }}>
                    <VpnKeyIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Active Bearer Token Stored in LocalStorage
                  </Typography>
                </Box>

                <Box sx={{ p: 2, bgcolor: '#f4f5f7', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                    DATABASE USER ID (MONGODB)
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#191919' }}>
                    <SecurityIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {user?._id}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0', textAlign: 'right' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ borderRadius: 6, fontWeight: 700, px: 3 }}
            >
              Sign Out / Logout
            </Button>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default AuthenticatedView;
