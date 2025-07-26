import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Container,
  Grid,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Biotech as BiotechIcon,
  Science as ScienceIcon,
  MenuBook as MenuBookIcon,
  Psychology as PsychologyIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useFetch from '../hooks/useFetch';
import apiService from '../services/api';

// Mock data (replace with actual API calls)
const mockSubjects = [
  {
    id: 1,
    name: 'Biology',
    description: 'Study of living organisms, their structure, function, growth, and evolution.',
    topics: 42,
    questions: 1250,
    progress: 75,
    image: '/biology-bg.svg',
    icon: <BiotechIcon />,
    color: '#4caf50',
  },
  {
    id: 2,
    name: 'Chemistry',
    description: 'Study of matter, its properties, composition, structure, and the changes it undergoes.',
    topics: 38,
    questions: 1100,
    progress: 62,
    image: '/chemistry-bg.svg',
    icon: <ScienceIcon />,
    color: '#2196f3',
  },
  {
    id: 3,
    name: 'Physics',
    description: 'Study of matter, energy, and the interaction between them.',
    topics: 35,
    questions: 980,
    progress: 58,
    image: '/physics-bg.svg',
    icon: <ScienceIcon />,
    color: '#ff9800',
  },
  {
    id: 4,
    name: 'English',
    description: 'Study of language, literature, and communication skills.',
    topics: 25,
    questions: 750,
    progress: 82,
    image: '/english-bg.svg',
    icon: <MenuBookIcon />,
    color: '#9c27b0',
  },
  {
    id: 5,
    name: 'Psychology',
    description: 'Study of the mind and behavior, including conscious and unconscious phenomena.',
    topics: 30,
    questions: 850,
    progress: 45,
    image: '/psychology-bg.svg',
    icon: <PsychologyIcon />,
    color: '#e91e63',
  },
  {
    id: 6,
    name: 'Medical Ethics',
    description: 'Study of moral principles and values as they apply to medicine.',
    topics: 20,
    questions: 600,
    progress: 38,
    image: '/medical-generic-bg.svg',
    icon: <LocalHospitalIcon />,
    color: '#607d8b',
  },
];

const Subjects = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // In a real app, replace with actual API calls
  // const { data: subjects, loading } = useFetch(apiService.getSubjects, [], true);

  // For demo purposes, using mock data
  const subjects = mockSubjects;

  if (loading) {
    return <LoadingSpinner message="Loading subjects..." />;
  }

  const breadcrumbs = [{ label: 'Subjects', path: '/subjects' }];

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="MDCAT Subjects"
        subtitle="Explore all subjects covered in the MDCAT exam"
        breadcrumbs={breadcrumbs}
      />

      <Grid container spacing={4}>
        {subjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={subject.image}
                alt={subject.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                    color: subject.color,
                  }}
                >
                  {subject.icon}
                  <Typography variant="h5" component="h2" sx={{ ml: 1 }}>
                    {subject.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {subject.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${subject.topics} Topics`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`${subject.questions} Questions`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Your Progress:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={subject.progress}
                        sx={{ height: 8, borderRadius: 5 }}
                        color={subject.progress > 70 ? 'success' : 'primary'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {subject.progress}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/subjects/${subject.id}/topics`)}
                >
                  View Topics
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate(`/practice?subject=${subject.id}`)}
                >
                  Practice
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate(`/resources?subject=${subject.id}`)}
                >
                  Resources
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Subjects;