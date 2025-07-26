import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Grid,
  Typography,
  Tabs,
  Tab,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  QuestionAnswer as QuestionIcon,
  Timer as TimerIcon,
  Equalizer as StatsIcon,
  Bookmark as BookmarkIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Mock data (replace with actual API calls)
const mockSubjects = [
  { id: 1, name: 'Biology' },
  { id: 2, name: 'Chemistry' },
  { id: 3, name: 'Physics' },
  { id: 4, name: 'English' },
  { id: 5, name: 'Psychology' },
  { id: 6, name: 'Medical Ethics' },
];

const mockPracticeTests = [
  {
    id: 1,
    title: 'Biology Fundamentals',
    description: 'Test your knowledge of basic biological concepts and principles.',
    questions: 25,
    timeLimit: 30,
    difficulty: 'Beginner',
    subject: 1,
    type: 'quiz',
    tags: ['Cell Biology', 'Genetics', 'Ecology'],
  },
  {
    id: 2,
    title: 'Advanced Chemistry',
    description: 'Challenge yourself with complex chemical reactions and concepts.',
    questions: 30,
    timeLimit: 45,
    difficulty: 'Advanced',
    subject: 2,
    type: 'quiz',
    tags: ['Organic Chemistry', 'Biochemistry', 'Thermodynamics'],
  },
  {
    id: 3,
    title: 'Physics Problem Solving',
    description: 'Practice solving physics problems related to mechanics and dynamics.',
    questions: 20,
    timeLimit: 40,
    difficulty: 'Intermediate',
    subject: 3,
    type: 'quiz',
    tags: ['Mechanics', 'Dynamics', 'Problem Solving'],
  },
  {
    id: 4,
    title: 'English Comprehension',
    description: 'Improve your reading comprehension and vocabulary skills.',
    questions: 35,
    timeLimit: 40,
    difficulty: 'Intermediate',
    subject: 4,
    type: 'quiz',
    tags: ['Reading Comprehension', 'Vocabulary', 'Grammar'],
  },
  {
    id: 5,
    title: 'Full MDCAT Mock Test',
    description: 'Complete mock test covering all MDCAT subjects with timed sections.',
    questions: 200,
    timeLimit: 180,
    difficulty: 'Advanced',
    subject: null,
    type: 'mock',
    tags: ['Full Test', 'All Subjects', 'Timed'],
  },
  {
    id: 6,
    title: 'Biology & Chemistry Combined',
    description: 'Test covering key topics from both Biology and Chemistry.',
    questions: 50,
    timeLimit: 60,
    difficulty: 'Intermediate',
    subject: null,
    type: 'mock',
    tags: ['Biology', 'Chemistry', 'Combined'],
  },
  {
    id: 7,
    title: 'Quick Biology Review',
    description: 'Short quiz to review essential biology concepts.',
    questions: 15,
    timeLimit: 15,
    difficulty: 'Beginner',
    subject: 1,
    type: 'quiz',
    tags: ['Quick Review', 'Fundamentals', 'Biology'],
  },
  {
    id: 8,
    title: 'Medical Ethics Case Studies',
    description: 'Practice with real-world medical ethics scenarios and questions.',
    questions: 20,
    timeLimit: 30,
    difficulty: 'Intermediate',
    subject: 6,
    type: 'quiz',
    tags: ['Ethics', 'Case Studies', 'Decision Making'],
  },
];

const Practice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  
  // Parse subject from URL query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subjectParam = params.get('subject');
    if (subjectParam) {
      setSubjectFilter(parseInt(subjectParam, 10));
    }
  }, [location]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubjectFilterChange = (event) => {
    setSubjectFilter(event.target.value);
  };

  const handleDifficultyFilterChange = (event) => {
    setDifficultyFilter(event.target.value);
  };

  const clearFilters = () => {
    setSubjectFilter('');
    setDifficultyFilter('');
  };

  // Filter tests based on selected tab and filters
  const filteredTests = mockPracticeTests.filter((test) => {
    // Filter by test type (tab)
    if (tabValue === 0 && test.type !== 'quiz') return false;
    if (tabValue === 1 && test.type !== 'mock') return false;
    
    // Filter by subject if selected
    if (subjectFilter && test.subject !== subjectFilter) return false;
    
    // Filter by difficulty if selected
    if (difficultyFilter && test.difficulty !== difficultyFilter) return false;
    
    return true;
  });

  const breadcrumbs = [{ label: 'Practice', path: '/practice' }];

  if (loading) {
    return <LoadingSpinner message="Loading practice tests..." />;
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Practice Tests"
        subtitle="Prepare for your MDCAT exam with our practice tests and quizzes"
        breadcrumbs={breadcrumbs}
      />

      <Box sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="practice test tabs"
        >
          <Tab 
            icon={<QuestionIcon />} 
            label="Subject Quizzes" 
            iconPosition="start"
          />
          <Tab 
            icon={<TimerIcon />} 
            label="Mock Tests" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} /> Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Subject</InputLabel>
              <Select
                value={subjectFilter}
                onChange={handleSubjectFilterChange}
                label="Subject"
              >
                <MenuItem value="">All Subjects</MenuItem>
                {mockSubjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficultyFilter}
                onChange={handleDifficultyFilterChange}
                label="Difficulty"
              >
                <MenuItem value="">All Difficulties</MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={clearFilters}
              startIcon={<FilterIcon />}
              size="medium"
              sx={{ height: '40px' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {filteredTests.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          No tests found matching your filters. Try adjusting your filter criteria.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredTests.map((test) => {
            const subjectName = test.subject 
              ? mockSubjects.find(s => s.id === test.subject)?.name 
              : 'Multiple Subjects';
              
            return (
              <Grid item xs={12} sm={6} md={4} key={test.id}>
                <Card 
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: test.type === 'mock' ? 'secondary.main' : 'primary.main'
                      }}
                    >
                      {test.type === 'mock' ? <TimerIcon sx={{ mr: 1 }} /> : <QuestionIcon sx={{ mr: 1 }} />}
                      {test.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {test.description}
                    </Typography>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Subject:</strong> {subjectName}
                      </Typography>
                      <Chip 
                        label={test.difficulty} 
                        size="small" 
                        color={
                          test.difficulty === 'Beginner' ? 'success' :
                          test.difficulty === 'Intermediate' ? 'primary' : 'error'
                        }
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        <QuestionIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        {test.questions} Questions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <TimerIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        {test.timeLimit} Minutes
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {test.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="primary"
                      onClick={() => navigate(`/test/${test.id}`)}
                      fullWidth
                    >
                      Start Test
                    </Button>
                    <Button 
                      size="small"
                      onClick={() => navigate(`/test/${test.id}/info`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="small"
                      startIcon={<BookmarkIcon />}
                    >
                      Save
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Practice;