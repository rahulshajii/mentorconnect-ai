import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const dashboardPath = user?.role === 'mentor' ? '/mentor/dashboard' : '/learner/dashboard';

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #e0e0e0', color: 'rgba(0,0,0,0.9)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 64 }}>
          {/* Brand Logo & Title */}
          <Box
            component={Link}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1.2, textDecoration: 'none' }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '6px',
                bgcolor: '#0a66c2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AutoAwesomeIcon sx={{ color: '#ffffff', fontSize: 22 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0a66c2', letterSpacing: '-0.3px', lineHeight: 1 }}>
                MentorConnect <Typography component="span" variant="h6" sx={{ color: 'rgba(0,0,0,0.9)', fontWeight: 800 }}>AI</Typography>
              </Typography>
              <Chip
                label="Powered by AMIE"
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  bgcolor: 'rgba(10, 102, 194, 0.08)',
                  color: '#0a66c2',
                  fontWeight: 700,
                  border: '1px solid rgba(10, 102, 194, 0.2)',
                }}
              />
            </Box>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <Button
                  component={Link}
                  to={dashboardPath}
                  startIcon={<DashboardIcon />}
                  sx={{ color: 'rgba(0,0,0,0.7)', '&:hover': { color: '#0a66c2' } }}
                >
                  Dashboard
                </Button>
                <Button
                  component={Link}
                  to="/profile"
                  startIcon={<PersonIcon />}
                  sx={{ color: 'rgba(0,0,0,0.7)', '&:hover': { color: '#0a66c2' } }}
                >
                  Profile
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                    <Avatar
                      src={profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      sx={{ width: 36, height: 36, border: '2px solid #0a66c2' }}
                    />
                  </IconButton>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1, color: 'rgba(0,0,0,0.9)' }}>
                      {user.name}
                    </Typography>
                    <Chip
                      icon={user.role === 'mentor' ? <WorkIcon sx={{ fontSize: '11px !important' }} /> : <SchoolIcon sx={{ fontSize: '11px !important' }} />}
                      label={user.role === 'mentor' ? 'Mentor' : 'Learner'}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        bgcolor: user.role === 'mentor' ? 'rgba(5, 118, 66, 0.1)' : 'rgba(10, 102, 194, 0.1)',
                        color: user.role === 'mentor' ? '#057642' : '#0a66c2',
                      }}
                    />
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{ sx: { minWidth: 160, borderRadius: 2, mt: 1 } }}
                  >
                    <MenuItem component={Link} to={dashboardPath} onClick={handleMenuClose}>
                      <DashboardIcon fontSize="small" sx={{ mr: 1, color: '#0a66c2' }} /> Dashboard
                    </MenuItem>
                    <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                      <PersonIcon fontSize="small" sx={{ mr: 1, color: '#0a66c2' }} /> Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" variant="text" sx={{ color: 'rgba(0,0,0,0.7)', fontWeight: 600 }}>
                  Sign In
                </Button>
                <Button component={Link} to="/register" variant="outlined" color="primary">
                  Join Now
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250, bgcolor: '#ffffff', height: '100%', p: 2 }}>
          <List>
            {user ? (
              <>
                <ListItem button component={Link} to={dashboardPath} onClick={handleDrawerToggle}>
                  <DashboardIcon sx={{ mr: 1.5, color: '#0a66c2' }} />
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/profile" onClick={handleDrawerToggle}>
                  <PersonIcon sx={{ mr: 1.5, color: '#0a66c2' }} />
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={() => { handleDrawerToggle(); handleLogout(); }}>
                  <LogoutIcon sx={{ mr: 1.5, color: '#d32f2f' }} />
                  <ListItemText primary="Logout" sx={{ color: '#d32f2f' }} />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login" onClick={handleDrawerToggle}>
                  <ListItemText primary="Sign In" />
                </ListItem>
                <ListItem button component={Link} to="/register" onClick={handleDrawerToggle}>
                  <ListItemText primary="Join Now" sx={{ color: '#0a66c2', fontWeight: 700 }} />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
