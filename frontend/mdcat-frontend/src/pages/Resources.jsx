import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Container,
  Grid,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Rating,
} from '@mui/material';
import {
  Search as SearchIcon,
  MenuBook as BookIcon,
  VideoLibrary as VideoIcon,
  Quiz as QuizIcon,
  Article as ArticleIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
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

const mockResources = [
  {
    id: 1,
    title: 'Complete Biology Notes',
    description: 'Comprehensive notes covering all MDCAT biology topics with diagrams and examples.',
    type: 'notes',
    subject: 1,
    format: 'PDF',
    size: '4.2 MB',
    pages: 85,
    author: 'Dr. Sarah Khan',
    rating: 4.7,
    downloads: 1250,
    image: '/biology-bg.svg',
    tags: ['Cell Biology', 'Genetics', 'Ecology', 'Complete Notes'],
  },
  {
    id: 2,
    title: 'Chemistry Formula Sheet',
    description: 'Quick reference guide with all important chemistry formulas and equations.',
    type: 'notes',
    subject: 2,
    format: 'PDF',
    size: '1.8 MB',
    pages: 12,
    author: 'Prof. Ahmed Ali',
    rating: 4.9,
    downloads: 2100,
    image: '/chemistry-bg.svg',
    tags: ['Formulas', 'Quick Reference', 'Equations'],
  },
  {
    id: 3,
    title: 'Physics Problem Solving Techniques',
    description: 'Video tutorial explaining step-by-step approaches to solve complex physics problems.',
    type: 'video',
    subject: 3,
    format: 'MP4',
    duration: '45 minutes',
    author: 'Dr. Imran Malik',
    rating: 4.5,
    views: 8500,
    image: '/physics-bg.svg',
    tags: ['Problem Solving', 'Mechanics', 'Dynamics'],
  },
  {
    id: 4,
    title: 'English Vocabulary Builder',
    description: 'Interactive flashcards to improve your medical and scientific vocabulary.',
    type: 'flashcards',
    subject: 4,
    cards: 200,
    author: 'English Language Institute',
    rating: 4.3,
    users: 950,
    image: '/english-bg.svg',
    tags: ['Vocabulary', 'Medical Terms', 'Interactive'],
  },
  {
    id: 5,
    title: 'MDCAT Biology Past Papers',
    description: 'Collection of last 5 years MDCAT biology questions with detailed solutions.',
    type: 'practice',
    subject: 1,
    format: 'PDF',
    size: '3.5 MB',
    questions: 250,
    author: 'MDCAT Prep Team',
    rating: 4.8,
    downloads: 3200,
    image: '/exam-bg.svg',
    tags: ['Past Papers', 'Solutions', 'Practice Questions'],
  },
  {
    id: 6,
    title: 'Medical Ethics Case Studies',
    description: 'Analysis of real-world medical ethics scenarios with discussion questions.',
    type: 'notes',
    subject: 6,
    format: 'PDF',
    size: '2.7 MB',
    pages: 42,
    author: 'Dr. Fatima Zaidi',
    rating: 4.6,
    downloads: 780,
    image: '/medical-generic-bg.svg',
    tags: ['Ethics', 'Case Studies', 'Decision Making'],
  },
  {
    id: 7,
    title: 'Chemistry Video Lectures Series',
    description: 'Complete series of video lectures covering organic and inorganic chemistry.',
    type: 'video',
    subject: 2,
    format: 'Playlist',
    videos: 24,
    duration: '12 hours total',
    author: 'Chemistry Academy',
    rating: 4.7,
    views: 15000,
    image: '/laboratory-bg.svg',
    tags: ['Video Lectures', 'Organic Chemistry', 'Inorganic Chemistry'],
  },
  {
    id: 8,
    title: 'Psychology Concept Maps',
    description: 'Visual concept maps connecting key psychology theories and principles.',
    type: 'notes',
    subject: 5,
    format: 'PDF',
    size: '5.1 MB',
    pages: 30,
    author: 'Dr. Nadia Hussain',
    rating: 4.4,
    downloads: 650,
    image: '/psychology-bg.svg',
    tags: ['Concept Maps', 'Visual Learning', 'Psychology Theories'],
  },
];

const Resources = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubjectFilterChange = (event) => {
    setSubjectFilter(event.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSubjectFilter('');
  };

  // Get resource type icon
  const getResourceIcon = (type) => {
    switch (type) {
      case 'notes':
        return <ArticleIcon />;
      case 'video':
        return <VideoIcon />;
      case 'flashcards':
        return <QuizIcon />;
      case 'practice':
        return <BookIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  // Filter resources based on selected tab, search query, and subject filter
  const filteredResources = mockResources.filter((resource) => {
    // Filter by resource type (tab)
    if (tabValue === 1 && resource.type !== 'notes') return false;
    if (tabValue === 2 && resource.type !== 'video') return false;
    if (tabValue === 3 && resource.type !== 'flashcards') return false;
    if (tabValue === 4 && resource.type !== 'practice') return false;
    
    // Filter by search query
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by subject if selected
    if (subjectFilter && resource.subject !== subjectFilter) return false;
    
    return true;
  });

  const breadcrumbs = [{ label: 'Resources', path: '/resources' }];

  if (loading) {
    return <LoadingSpinner message="Loading resources..." />;
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Study Resources"
        subtitle="Access high-quality study materials to prepare for your MDCAT exam"
        breadcrumbs={breadcrumbs}
      />

      <Box sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          aria-label="resource tabs"
        >
          <Tab icon={<FilterIcon />} label="All Resources" iconPosition="start" />
          <Tab icon={<ArticleIcon />} label="Notes" iconPosition="start" />
          <Tab icon={<VideoIcon />} label="Videos" iconPosition="start" />
          <Tab icon={<QuizIcon />} label="Flashcards" iconPosition="start" />
          <Tab icon={<BookIcon />} label="Practice Materials" iconPosition="start" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              onClick={clearFilters}
              startIcon={<FilterIcon />}
              size="medium"
              fullWidth
              sx={{ height: '40px' }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredResources.map((resource) => {
          const subjectName = mockSubjects.find(s => s.id === resource.subject)?.name || 'General';
          
          return (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
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
                <CardMedia
                  component="img"
                  height="140"
                  image={resource.image}
                  alt={resource.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      icon={getResourceIcon(resource.type)} 
                      label={resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      size="small"
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={subjectName} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="h6" component="h2" gutterBottom>
                    {resource.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={resource.rating} 
                      precision={0.1} 
                      size="small" 
                      readOnly 
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {resource.rating}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    {resource.format && (
                      <Typography variant="body2" color="text.secondary">
                        Format: {resource.format}
                        {resource.size && ` • ${resource.size}`}
                        {resource.pages && ` • ${resource.pages} pages`}
                        {resource.duration && ` • ${resource.duration}`}
                        {resource.videos && ` • ${resource.videos} videos`}
                        {resource.cards && ` • ${resource.cards} cards`}
                        {resource.questions && ` • ${resource.questions} questions`}
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    By: {resource.author}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {resource.tags.length > 3 && (
                      <Chip 
                        label={`+${resource.tags.length - 3} more`} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={() => navigate(`/resources/${resource.id}`)}
                  >
                    Download
                  </Button>
                  <Button 
                    size="small"
                    startIcon={<BookmarkIcon />}
                  >
                    Save
                  </Button>
                  <IconButton size="small" aria-label="share">
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      {filteredResources.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No resources found matching your criteria.
          </Typography>
          <Button 
            variant="outlined" 
            onClick={clearFilters}
            sx={{ mt: 2 }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Resources;