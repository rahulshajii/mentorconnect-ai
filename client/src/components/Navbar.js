import React, { useState, useEffect } from 'react';
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
  Badge,
  Popover,
  Typography,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  CalendarMonth as SessionsIcon,
  DoneAll as MarkReadIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';
import { getNotifications, markAllAsRead, markAsRead } from '../services/notificationService';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Notification states
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNotifOpen = (event) => setNotifAnchor(event.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const res = await getNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      console.warn('Could not fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 15000); // Poll every 15 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSingleClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await markAsRead(notif._id);
        setNotifications(notifications.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }
    handleNotifClose();
    navigate('/sessions');
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const navLinks = [
    { title: 'Mentors', path: '/recommendations' },
    { title: 'Assessments', path: '/quiz' },
    { title: 'Skill Gap', path: '/skill-gap' },
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#ffffff', color: '#191919', borderBottom: '1px solid #e0e0e0', zIndex: 1100 }}>
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
                {/* Notification Bell Badge */}
                <IconButton onClick={handleNotifOpen} sx={{ color: '#475569' }}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <Button
                  component={Link}
                  to="/sessions"
                  variant="outlined"
                  color="primary"
                  startIcon={<SessionsIcon />}
                  sx={{ borderRadius: 6, fontWeight: 700 }}
                >
                  Sessions
                </Button>

                <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                  <Avatar
                    src={profile?.profileImage || profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    alt={user?.name}
                    sx={{ width: 38, height: 38, border: '2px solid #0a66c2' }}
                  />
                </IconButton>

                {/* Profile Dropdown Menu */}
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
                    <DashboardIcon fontSize="small" sx={{ mr: 1.5, color: '#0a66c2' }} /> Workspace
                  </MenuItem>
                  <MenuItem component={Link} to="/sessions" onClick={handleMenuClose}>
                    <SessionsIcon fontSize="small" sx={{ mr: 1.5, color: '#0a66c2' }} /> Sessions
                  </MenuItem>
                  <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                    <PersonIcon fontSize="small" sx={{ mr: 1.5, color: '#0a66c2' }} /> Profile Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Sign Out
                  </MenuItem>
                </Menu>

                {/* Notification Dropdown Popover */}
                <Popover
                  open={Boolean(notifAnchor)}
                  anchorEl={notifAnchor}
                  onClose={handleNotifClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ sx: { width: 340, maxHeight: 420, borderRadius: 3, mt: 1, p: 2 } }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      Notifications
                    </Typography>
                    {unreadCount > 0 && (
                      <Button size="small" startIcon={<MarkReadIcon fontSize="small" />} onClick={handleMarkAllRead} sx={{ fontSize: '0.75rem', textTransform: 'none' }}>
                        Mark all read
                      </Button>
                    )}
                  </Stack>
                  <Divider sx={{ mb: 1 }} />

                  {notifications.length === 0 ? (
                    <Typography variant="caption" color="text.secondary" sx={{ py: 2, display: 'block', textAlign: 'center' }}>
                      No notifications yet.
                    </Typography>
                  ) : (
                    <List disablePadding>
                      {notifications.slice(0, 6).map((n) => (
                        <ListItem
                          key={n._id}
                          disablePadding
                          sx={{
                            mb: 1,
                            bgcolor: n.isRead ? 'transparent' : '#f0f9ff',
                            borderRadius: 2,
                            p: 1,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: '#e2e8f0' },
                          }}
                          onClick={() => handleSingleClick(n)}
                        >
                          <ListItemText
                            primary={n.title}
                            secondary={n.message}
                            primaryTypographyProps={{ fontWeight: n.isRead ? 600 : 800, fontSize: '0.85rem' }}
                            secondaryTypographyProps={{ fontSize: '0.75rem' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Popover>
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
              <Button
                component={Link}
                to="/sessions"
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleDrawerToggle}
              >
                View Sessions
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
