import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import Logo from '../components/Logo';

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email address is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const redirectPath =
        user.role === 'admin'
          ? '/admin'
          : user.role === 'mentor'
          ? '/mentor/dashboard'
          : '/learner/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data.email, data.password);
      const userRole = res.role || res.user?.role;
      let redirectPath = '/learner/dashboard';
      if (userRole === 'admin') {
        redirectPath = '/admin';
      } else if (userRole === 'mentor') {
        redirectPath = '/mentor/dashboard';
      }
      navigate(redirectPath);
    } catch (err) {
      // Handled in AuthContext with toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', py: 6 }}>
        <Container maxWidth="lg">
          <Paper
            elevation={4}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: '#ffffff',
            }}
          >
            <Grid container>
              {/* Left Side: Unsplash Background with High Contrast Dark Overlay */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  position: 'relative',
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 6,
                  color: '#ffffff',
                }}
              >
                {/* Gradient Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(10, 102, 194, 0.88) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    zIndex: 1,
                  }}
                />

                {/* Content over overlay */}
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Box sx={{ mb: 4 }}>
                    <Logo size="large" colorMode="light" />
                  </Box>

                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#ffffff', lineHeight: 1.2 }}>
                    Empowering professional skill growth through expert mentorship.
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.05rem', fontWeight: 500 }}>
                    Connect 1-on-1 with verified industry leaders and accelerate your career path with AMIE AI.
                  </Typography>
                </Box>

                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleIcon sx={{ color: '#14b8a6', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                      Structured Skill Assessment & Career Readiness
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Right Side: Form */}
              <Grid item xs={12} md={6} sx={{ p: { xs: 4, sm: 6 }, display: 'flex', alignItems: 'center' }}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  sx={{ width: '100%' }}
                >
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#191919', mb: 1 }}>
                      Sign In
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stay updated on your professional learning workspace
                    </Typography>
                  </Box>

                  <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      autoComplete="email"
                      autoFocus
                      {...registerField('email')}
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...registerField('password')}
                      error={Boolean(errors.password)}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 1 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            color="primary"
                          />
                        }
                        label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Remember Me</Typography>}
                      />
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      startIcon={<LoginIcon />}
                      sx={{ py: 1.4, fontSize: '1rem', fontWeight: 700, borderRadius: 6, mb: 3 }}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        New to MentorConnect AI?{' '}
                        <MuiLink component={Link} to="/register" color="primary" underline="hover" sx={{ fontWeight: 700 }}>
                          Join now
                        </MuiLink>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default LoginPage;
