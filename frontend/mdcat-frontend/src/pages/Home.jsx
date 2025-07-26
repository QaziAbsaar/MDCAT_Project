import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Groups as GroupsIcon,
  EmojiEvents as TrophyIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  PersonalVideo as PersonalVideoIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import HomeLayout from '../components/layout/HomeLayout';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const stats = [
    { number: '50K+', label: 'Students' },
    { number: '95%', label: 'Success Rate' },
    { number: '10K+', label: 'Questions' },
    { number: '24/7', label: 'Support' },
  ];

  const features = [
    {
      icon: <QuizIcon />,
      title: 'Smart Practice',
      description: 'AI-powered question selection based on your performance',
      color: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      icon: <TrendingUpIcon />,
      title: 'Progress Tracking',
      description: 'Detailed analytics to monitor your improvement',
      color: '#10b981',
      bgColor: '#f0fdf4',
    },
    {
      icon: <PsychologyIcon />,
      title: 'Adaptive Learning',
      description: 'Personalized study plans that adapt to your needs',
      color: '#8b5cf6',
      bgColor: '#faf5ff',
    },
    {
      icon: <GroupsIcon />,
      title: 'Expert Support',
      description: '24/7 guidance from medical education specialists',
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
  ];

  const benefits = [
    { icon: <CheckCircleIcon />, text: 'Comprehensive Question Bank' },
    { icon: <SpeedIcon />, text: 'Real-time Performance Analytics' },
    { icon: <PersonalVideoIcon />, text: 'Interactive Learning Experience' },
    { icon: <TrophyIcon />, text: 'Proven Success Track Record' },
  ];

  return (
    <HomeLayout>
      <Box>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
            position: 'relative',
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={7}>
                <Box sx={{ mb: 3 }}>
                  <Chip
                    label="🎯 #1 MDCAT Prep Platform"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      mb: 3,
                    }}
                  />
                </Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                  }}
                >
                  Master Your MDCAT Journey
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    opacity: 0.9,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    mb: 4,
                    maxWidth: '90%',
                  }}
                >
                  Transform your medical dreams into reality with our AI-powered preparation platform.
                  Join thousands of successful students who chose excellence.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  {currentUser ? (
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/dashboard')}
                      sx={{
                        backgroundColor: 'white',
                        color: 'primary.main',
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/register')}
                        sx={{
                          backgroundColor: 'white',
                          color: 'primary.main',
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                        }}
                      >
                        Start Free Trial
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          color: 'white',
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          fontWeight: 500,
                        }}
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </Stack>
                
                {/* Stats Row */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {stat.number}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 400,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 120, opacity: 0.7 }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Powerful Features for Success
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              Everything you need to excel in your MDCAT preparation
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ maxWidth: { md: '800px', lg: 'none' }, mx: 'auto' }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={6} lg={3} key={index} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    height: '100%',
                    width: '100%',
                    border: 'none',
                    borderRadius: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        backgroundColor: feature.bgColor,
                        color: feature.color,
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Benefits Section */}
        <Box sx={{ backgroundColor: 'grey.50', py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: 'text.primary',
                  }}
                >
                  Why Students Choose Us
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.6 }}
                >
                  Our platform combines advanced AI technology with proven educational methods.
                </Typography>
                
                <Stack spacing={3}>
                  {benefits.map((benefit, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: 'primary.main',
                          color: 'white',
                        }}
                      >
                        {benefit.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {benefit.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/subjects')}
                  sx={{
                    mt: 4,
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  Explore Subjects
                </Button>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      backgroundColor: 'white',
                      borderRadius: 3,
                      p: 4,
                      height: 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                  >
                    <TrophyIcon sx={{ fontSize: 120, color: 'primary.main', opacity: 0.7 }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Call to Action */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 4,
              p: { xs: 4, md: 8 },
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                Ready to Begin Your Success Story?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Join thousands of students who have transformed their MDCAT preparation.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/register')}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Start Your Free Trial
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </HomeLayout>
  );
};

export default Home;