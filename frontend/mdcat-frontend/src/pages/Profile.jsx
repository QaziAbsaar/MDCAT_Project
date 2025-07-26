import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/common/PageHeader';

// Mock user data (replace with actual data from context)
const mockUserData = {
  id: 1,
  name: 'Ahmed Khan',
  email: 'ahmed.khan@example.com',
  phone: '+92 300 1234567',
  location: 'Lahore, Pakistan',
  institution: 'Punjab Medical College',
  bio: 'Pre-medical student preparing for MDCAT. Passionate about biology and healthcare.',
  avatar: '/portrait-placeholder.svg',
  joinDate: 'January 2023',
  lastActive: '2 hours ago',
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Use mock data for demonstration (in a real app, use user from context)
  const userData = mockUserData;
  
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    location: userData.location,
    institution: userData.institution,
    bio: userData.bio,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit mode, reset form data
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        location: userData.location,
        institution: userData.institution,
        bio: userData.bio,
      });
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, call the updateProfile function from context
      // await updateProfile(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, call the API to update password
      // await apiService.updatePassword(passwordData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  const breadcrumbs = [{ label: 'Profile', path: '/profile' }];

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account information and settings"
        breadcrumbs={breadcrumbs}
      />

      <Grid container spacing={4}>
        {/* Left column - Profile summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={userData.avatar}
                  alt={userData.name}
                  sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 0,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.default' },
                  }}
                >
                  <input hidden accept="image/*" type="file" />
                  <PhotoCameraIcon />
                </IconButton>
              </Box>

              <Typography variant="h5" gutterBottom>
                {userData.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {userData.location}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <SchoolIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {userData.institution}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" paragraph>
                  <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  {userData.email}
                </Typography>
                <Typography variant="body2" paragraph>
                  <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  {userData.phone}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" color="text.secondary">
                  Member since: {userData.joinDate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last active: {userData.lastActive}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About Me
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {userData.bio}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right column - Tabs for different settings */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="profile settings tabs"
            >
              <Tab icon={<EditIcon />} label="Edit Profile" iconPosition="start" />
              <Tab icon={<LockIcon />} label="Security" iconPosition="start" />
              <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
              <Tab icon={<HistoryIcon />} label="Activity" iconPosition="start" />
              <Tab icon={<BookmarkIcon />} label="Saved Items" iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Edit Profile Tab */}
          {tabValue === 0 && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Personal Information</Typography>
                  <Button
                    startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                    onClick={handleEditToggle}
                    color={editMode ? 'error' : 'primary'}
                    variant="outlined"
                    size="small"
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      onClick={handleProfileUpdate}
                      disabled={loading}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {tabValue === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      variant="outlined"
                      margin="normal"
                      helperText="Password must be at least 8 characters long"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
                    onClick={handlePasswordUpdate}
                    disabled={loading}
                  >
                    Update Password
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {tabValue === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Notification settings will be implemented in a future update.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Activity Tab */}
          {tabValue === 3 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Activity history will be implemented in a future update.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Saved Items Tab */}
          {tabValue === 4 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Saved Items
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Saved items will be implemented in a future update.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {tabValue === 0 ? 'Profile updated successfully!' : 'Password updated successfully!'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;