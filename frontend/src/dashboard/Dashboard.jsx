import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  People as PeopleIcon,
  Help as HelpIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import Questions from './Questions';
import Users from './Users';
import Exams from './Exams';
import Results from './Results';
import Courses from './Courses';

const drawerWidth = 240;

const Dashboard = () => {
  const { user, isAdmin, isTeacher, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBackToMain = () => {
    navigate('/main');
  };

  const menuItems = [
    ...(isAdmin ? [{ text: 'Users', icon: <PeopleIcon />, path: '/users' }] : []),
    ...(isAdmin || isTeacher ? [
      { text: 'Questions', icon: <HelpIcon />, path: '/questions' },
      { text: 'Courses', icon: <MenuBookIcon />, path: '/courses' }
    ] : []),
    { text: 'Exams', icon: <AssignmentIcon />, path: '/exams' },
    { text: 'Results', icon: <AssessmentIcon />, path: '/results' },
  ];

  const drawer = (
    <div style={{height: '100%', background: 'linear-gradient(135deg, #338af3 0%, #5ee7df 100%)', borderTopRightRadius: 24, borderBottomRightRadius: 24}}>
      <Toolbar sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 80 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="/logo192.png" alt="Logo" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, color: '#fff', letterSpacing: 1 }}>
            DanhGiaNL
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={`/dashboard${item.path}`}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  bgcolor: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.28)',
                  },
                  boxShadow: isActive ? 2 : 0,
                }}
              >
                <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ '.MuiTypography-root': { fontWeight: 600 } }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List sx={{ mt: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton onClick={handleBackToMain} sx={{ mx: 2, borderRadius: 2, color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' } }}>
            <ListItemIcon sx={{ color: '#fff' }}><HomeIcon /></ListItemIcon>
            <ListItemText primary="Back to Main" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={logout} sx={{ mx: 2, borderRadius: 2, color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' } }}>
            <ListItemIcon sx={{ color: '#fff' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Routes>
          {isAdmin && (
            <>
              <Route path="/questions" element={<Questions />} />
              <Route path="/users" element={<Users />} />
              <Route path="/courses" element={<Courses />} />
            </>
          )}
          {isTeacher && (
            <>
              <Route path="/questions" element={<Questions />} />
              <Route path="/courses" element={<Courses />} />
            </>
          )}
          <Route path="/exams" element={<Exams />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<Navigate to="/dashboard/users" />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;

