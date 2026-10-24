import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  AutoAwesome as AutoAwesomeIcon,
  People as PeopleIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';
import Logo from '../components/Logo';

const drawerWidth = 260;

const DashboardLayout = ({ children }) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const isLearner = user?.role === 'learner';
  const isAdmin = user?.role === 'admin';

  let menuItems = [];
  if (isAdmin) {
    menuItems = [
      { text: 'Admin Portal', icon: <DashboardIcon />, path: '/admin' },
      { text: 'Course Catalog', icon: <SchoolIcon />, path: '/courses' },
      { text: 'Session Management', icon: <EventIcon />, path: '/sessions' },
      { text: 'Profile Settings', icon: <PersonIcon />, path: '/profile' },
    ];
  } else if (isLearner) {
    menuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/learner/dashboard' },
      { text: 'Course Catalog', icon: <SchoolIcon />, path: '/courses' },
      { text: 'My Courses', icon: <SchoolIcon />, path: '/my-courses' },
      { text: 'Certificates', icon: <AutoAwesomeIcon />, path: '/certificates' },
      { text: 'Mentoring Sessions', icon: <EventIcon />, path: '/sessions' },
      { text: 'Skill Assessment', icon: <PsychologyIcon />, path: '/quiz' },
      { text: 'Skill Gap Analysis', icon: <TrendingUpIcon />, path: '/skill-gap' },
      { text: 'AMIE Mentors', icon: <PeopleIcon />, path: '/recommendations' },
      { text: 'Profile Settings', icon: <PersonIcon />, path: '/profile' },
    ];
  } else {
    menuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/mentor/dashboard' },
      { text: 'Course Catalog', icon: <SchoolIcon />, path: '/courses' },
      { text: 'Mentoring Sessions', icon: <EventIcon />, path: '/sessions' },
      { text: 'Profile Settings', icon: <PersonIcon />, path: '/profile' },
    ];
  }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center' }}>
        <Logo size="medium" />
      </Box>

      <Divider sx={{ borderColor: '#e0e0e0' }} />

      {/* User Badge Info */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#f8fafc' }}>
        <Avatar
          src={profile?.profileImage || profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
          alt={user?.name}
          sx={{ width: 42, height: 42, border: `2px solid ${isLearner ? '#0a66c2' : '#057642'}` }}
        />
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: '#191919' }}>
            {user?.name}
          </Typography>
          <Chip
            icon={isLearner ? <SchoolIcon sx={{ fontSize: '11px !important' }} /> : <WorkIcon sx={{ fontSize: '11px !important' }} />}
            label={isLearner ? 'Learner Account' : isAdmin ? 'Administrator' : 'Mentor Account'}
            size="small"
            sx={{
              height: 18,
              fontSize: '0.65rem',
              fontWeight: 700,
              bgcolor: isLearner ? 'rgba(10, 102, 194, 0.1)' : isAdmin ? 'rgba(124, 58, 237, 0.1)' : 'rgba(5, 118, 66, 0.1)',
              color: isLearner ? '#0a66c2' : isAdmin ? '#7c3aed' : '#057642',
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#e0e0e0' }} />

      {/* Sidebar Navigation Items */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? 'rgba(10, 102, 194, 0.08)' : 'transparent',
                  color: active ? '#0a66c2' : '#5e5e5e',
                  '&:hover': {
                    bgcolor: 'rgba(10, 102, 194, 0.04)',
                    color: '#0a66c2',
                  },
                }}
              >
                <ListItemIcon sx={{ color: active ? '#0a66c2' : '#5e5e5e', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '0.9rem' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#e0e0e0' }} />

      {/* Logout Item */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: '#d32f2f',
            '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' },
          }}
        >
          <ListItemIcon sx={{ color: '#d32f2f', minWidth: 38 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f5f7' }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: '#ffffff',
          color: '#191919',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
            {isLearner ? 'Learner Workspace' : 'Mentor Portal'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
              <Avatar
                src={profile?.profileImage || profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                alt={user?.name}
                sx={{ width: 36, height: 36, border: '2px solid #0a66c2' }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{ sx: { minWidth: 180, borderRadius: 2, mt: 1 } }}
            >
              <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                <PersonIcon fontSize="small" sx={{ mr: 1.5, color: '#0a66c2' }} /> Profile Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="xl" sx={{ flexGrow: 1, p: 0 }}>
          {children}
        </Container>
        <Footer />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
