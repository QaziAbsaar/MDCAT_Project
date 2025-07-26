import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  Biotech as BiotechIcon,
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  LocalHospital as LocalHospitalIcon,
  Analytics as AnalyticsIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ open }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Subjects', icon: <SchoolIcon />, path: '/subjects' },
    { text: 'Practice Tests', icon: <QuizIcon />, path: '/practice' },
    { text: 'Mock Exams', icon: <AssignmentIcon />, path: '/mock-exams' },
    { text: 'Study Resources', icon: <MenuBookIcon />, path: '/resources' },
    { text: 'Flashcards', icon: <BookmarkIcon />, path: '/flashcards' },
    { text: 'Progress Tracking', icon: <AnalyticsIcon />, path: '/progress' },
  ];

  const subjectItems = [
    { text: 'Biology', icon: <BiotechIcon />, path: '/subjects/biology' },
    { text: 'Chemistry', icon: <ScienceIcon />, path: '/subjects/chemistry' },
    { text: 'Physics', icon: <ScienceIcon />, path: '/subjects/physics' },
    { text: 'English', icon: <MenuBookIcon />, path: '/subjects/english' },
    { text: 'Psychology', icon: <PsychologyIcon />, path: '/subjects/psychology' },
    { text: 'Medical Ethics', icon: <LocalHospitalIcon />, path: '/subjects/ethics' },
  ];

  const supportItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help & Support', icon: <HelpIcon />, path: '/help' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const drawer = (
    <>
      <Box sx={{ p: 2, height: 64, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          MDCAT Prep
        </Typography>
      </Box>
      <Divider />
      <List>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, pt: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          SUBJECTS
        </Typography>
      </Box>
      <List>
        {subjectItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {supportItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: open ? drawerWidth : 0 }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, pt: 0 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;