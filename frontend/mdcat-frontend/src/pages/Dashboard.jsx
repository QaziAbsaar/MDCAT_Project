import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Grid,
  Typography,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useFetch from '../hooks/useFetch';
import apiService from '../services/api';

// Mock data (replace with actual API calls)
const mockProgress = {
  overall: 68,
  subjects: [
    { name: 'Biology', progress: 75 },
    { name: 'Chemistry', progress: 62 },
    { name: 'Physics', progress: 58 },
    { name: 'English', progress: 82 },
  ],
};

const mockRecentActivity = [
  { id: 1, type: 'test', title: 'Biology Practice Test', score: '85%', date: '2 days ago' },
  { id: 2, type: 'exam', title: 'Mock Exam 1', score: '78%', date: '1 week ago' },
  { id: 3, type: 'resource', title: 'Chemistry Notes', action: 'Viewed', date: 'Yesterday' },
];

const mockRecommendations = [
  {
    id: 1,
    title: 'Physics: Forces and Motion',
    description: 'Based on your recent test results, we recommend focusing on this topic.',
    path: '/subjects/physics/forces',
  },
  {
    id: 2,
    title: 'Take Biology Mock Test',
    description: 'You\'re doing well in Biology. Test your knowledge with this mock test.',
    path: '/mock-exams/biology',
  },
];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // In a real app, replace with actual API calls
  // const { data: progressData, loading: progressLoading } = useFetch(
  //   apiService.getUserProgress,
  //   [],
  //   true
  // );

  // For demo purposes, using mock data
  const progressData = mockProgress;
  const progressLoading = false;

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={`Welcome back, ${currentUser?.name || 'Student'}!`}
        subtitle="Track your progress and continue your MDCAT preparation"
      />

      {/* Progress Overview */}
      <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>Overall Progress</Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/progress')}
            sx={{ borderRadius: 2 }}
          >
            View Details
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3, 
            p: 3, 
            backgroundColor: 'white', 
            borderRadius: 2, 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            <Typography variant="h6" sx={{ mr: 3, minWidth: 120, fontWeight: 500 }}>
              Overall:
            </Typography>
            <Box sx={{ width: '100%', mr: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progressData.overall}
                sx={{ 
                  height: 12, 
                  borderRadius: 6,
                  backgroundColor: '#e0e7ff',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
                  }
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', minWidth: 50 }}>
              {progressData.overall}%
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
            Subject Progress
          </Typography>

          <Grid container spacing={3}>
            {progressData.subjects.map((subject) => (
              <Grid item xs={12} sm={6} key={subject.name}>
                <Box sx={{ 
                  p: 3, 
                  backgroundColor: 'white', 
                  borderRadius: 2, 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {subject.name}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: subject.progress > 70 ? 'success.main' : 'primary.main' 
                    }}>
                      {subject.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={subject.progress}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: '#f1f5f9',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: subject.progress > 70 
                          ? 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)'
                          : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
                      }
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 4, 
            height: '100%',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
              Recent Activity
            </Typography>
            <List sx={{ mb: 2 }}>
              {mockRecentActivity.map((activity) => (
                <ListItem 
                  key={activity.id} 
                  divider
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      transform: 'translateX(4px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ListItemIcon>
                    {activity.type === 'test' || activity.type === 'exam' ? (
                      <AssignmentIcon color="primary" />
                    ) : (
                      <SchoolIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {activity.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {activity.score && `Score: ${activity.score} • `}
                        {activity.action && `${activity.action} • `}
                        {activity.date}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => navigate('/activity')}
              sx={{ 
                mt: 2,
                borderRadius: 2,
                borderWidth: 2,
                fontWeight: 600,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                }
              }}
            >
              View All Activity
            </Button>
          </Paper>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 4, 
            height: '100%',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
              Personalized Recommendations
            </Typography>
            <List sx={{ mb: 2 }}>
              {mockRecommendations.map((recommendation) => (
                <ListItem 
                  key={recommendation.id} 
                  divider
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      transform: 'translateX(4px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {recommendation.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {recommendation.description}
                      </Typography>
                    }
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(recommendation.path)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
                      }
                    }}
                  >
                    Start
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  color: 'white',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mx: 'auto', 
                    mb: 2 
                  }}>
                    <AssignmentIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Practice Tests
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Take subject-specific practice tests
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/practice')}
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                      fontWeight: 600
                    }}
                  >
                    Start Practice
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                  color: 'white',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mx: 'auto', 
                    mb: 2 
                  }}>
                    <TimelineIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Mock Exams
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Full-length MDCAT simulation exams
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/mock-exams')}
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                      fontWeight: 600
                    }}
                  >
                    Take Exam
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                  color: 'white',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)'
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mx: 'auto', 
                    mb: 2 
                  }}>
                    <SchoolIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Study Resources
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Access notes, videos, and references
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/resources')}
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                      fontWeight: 600
                    }}
                  >
                    Browse Resources
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                  color: 'white',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: '0 8px 25px rgba(156, 39, 176, 0.3)'
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mx: 'auto', 
                    mb: 2 
                  }}>
                    <NotificationsIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Study Plans
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Create and manage study schedules
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/progress')}
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                      fontWeight: 600
                    }}
                  >
                    Create Plan
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;