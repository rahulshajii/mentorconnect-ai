import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const navLinks = [
    { title: 'Mentors', path: '/register' },
    { title: 'Categories', path: '/' },
    { title: 'About AMIE', path: '/' },
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#ffffff', color: '#191919', borderBottom: '1px solid #e0e0e0' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
          {/* SaaS Logo Component */}
          <Logo size="medium" />

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            {navLinks.map((link) => (
              <Button
                key={link.title}
                component={Link}
                to={link.path}
                sx={{
                  color: '#5e5e5e',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  '&:hover': { color: '#0a66c2', bgcolor: 'transparent' },
                }}
              >
                {link.title}
              </Button>
            ))}
          </Box>

          {/* Desktop Auth Buttons / User Profile Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            {user ? (
              <>
                <Button
                  component={Link}
                  to={user.role === 'mentor' ? '/mentor/dashboard' : '/learner/dashboard'}
                  variant="outlined"
                  color="primary"
                  startIcon={<DashboardIcon />}
                  sx={{ borderRadius: 6 }}
                >
                  Workspace
                </Button>

                <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                  <Avatar
                    src={profile?.profileImage || profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    alt={user?.name}
                    sx={{ width: 38, height: 38, border: '2px solid #0a66c2' }}
                  />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{ sx: { minWidth: 180, borderRadius: 2, mt: 1 } }}
                >
                  <MenuItem
                    component={Link}
                    to={user.role === 'mentor' ? '/mentor/dashboard' : '/learner/dashboard'}
                    onClick={handleMenuClose}
                  >
                    <DashboardIcon fontSize="small" sx={{ mr: 1.5, color: '#0a66c2' }} /> Dashboard
                  </MenuItem>
                  <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                    <PersonIcon fontSize="small" sx={{ mr: 1.5, color: '#0a66c2' }} /> Profile Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{ color: '#0a66c2', fontWeight: 700 }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 6, fontWeight: 700, px: 2.5 }}
                >
                  Join Now
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Icon Toggle */}
          <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 280, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Logo size="small" />
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <List>
            {navLinks.map((link) => (
              <ListItem key={link.title} disablePadding sx={{ mb: 1 }}>
                <ListItemButton component={Link} to={link.path} onClick={handleDrawerToggle}>
                  <ListItemText primary={link.title} primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {user ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                component={Link}
                to={user.role === 'mentor' ? '/mentor/dashboard' : '/learner/dashboard'}
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleDrawerToggle}
              >
                Go to Workspace
              </Button>
              <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>
                Sign Out
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button component={Link} to="/login" variant="outlined" color="primary" fullWidth onClick={handleDrawerToggle}>
                Sign In
              </Button>
              <Button component={Link} to="/register" variant="contained" color="primary" fullWidth onClick={handleDrawerToggle}>
                Join Now
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
