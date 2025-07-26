import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FlipToBack as FlipIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  School as SchoolIcon,
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

const mockFlashcardDecks = [
  {
    id: 1,
    title: 'Cell Biology Essentials',
    description: 'Key concepts in cell biology including organelles, membranes, and cellular processes.',
    subject: 1,
    cardCount: 42,
    createdBy: 'Dr. Sarah Khan',
    lastUpdated: '2023-05-15',
    difficulty: 'Intermediate',
    tags: ['Cell Biology', 'Organelles', 'Cellular Processes'],
    progress: 65,
    isFavorite: true,
  },
  {
    id: 2,
    title: 'Organic Chemistry Reactions',
    description: 'Common organic chemistry reactions and mechanisms for MDCAT preparation.',
    subject: 2,
    cardCount: 38,
    createdBy: 'Prof. Ahmed Ali',
    lastUpdated: '2023-06-22',
    difficulty: 'Advanced',
    tags: ['Organic Chemistry', 'Reactions', 'Mechanisms'],
    progress: 42,
    isFavorite: false,
  },
  {
    id: 3,
    title: 'Physics Formulas',
    description: 'Essential physics formulas and their applications for problem-solving.',
    subject: 3,
    cardCount: 30,
    createdBy: 'Dr. Imran Malik',
    lastUpdated: '2023-04-10',
    difficulty: 'Intermediate',
    tags: ['Formulas', 'Problem Solving', 'Mechanics'],
    progress: 80,
    isFavorite: true,
  },
  {
    id: 4,
    title: 'Medical Terminology',
    description: 'Important medical terms and definitions for MDCAT English section.',
    subject: 4,
    cardCount: 75,
    createdBy: 'English Language Institute',
    lastUpdated: '2023-07-05',
    difficulty: 'Beginner',
    tags: ['Vocabulary', 'Medical Terms', 'Definitions'],
    progress: 25,
    isFavorite: false,
  },
  {
    id: 5,
    title: 'Human Anatomy Flashcards',
    description: 'Comprehensive flashcards covering human anatomy systems and structures.',
    subject: 1,
    cardCount: 120,
    createdBy: 'MDCAT Prep Team',
    lastUpdated: '2023-08-12',
    difficulty: 'Advanced',
    tags: ['Anatomy', 'Human Body', 'Systems'],
    progress: 35,
    isFavorite: true,
  },
  {
    id: 6,
    title: 'Psychological Disorders',
    description: 'Overview of common psychological disorders, symptoms, and treatments.',
    subject: 5,
    cardCount: 45,
    createdBy: 'Dr. Nadia Hussain',
    lastUpdated: '2023-07-28',
    difficulty: 'Intermediate',
    tags: ['Disorders', 'Symptoms', 'Psychology'],
    progress: 50,
    isFavorite: false,
  },
];

const mockFlashcards = [
  {
    id: 1,
    deckId: 1,
    front: 'What is the function of the mitochondria?',
    back: 'Mitochondria are known as the "powerhouse of the cell" because they generate most of the cell\'s supply of adenosine triphosphate (ATP), which is used as a source of chemical energy.',
    tags: ['Organelles', 'Energy'],
    difficulty: 'Beginner',
  },
  {
    id: 2,
    deckId: 1,
    front: 'What is the difference between passive and active transport across cell membranes?',
    back: 'Passive transport does not require energy and moves molecules from high to low concentration (e.g., diffusion, osmosis). Active transport requires energy (ATP) and can move molecules against their concentration gradient (e.g., sodium-potassium pump).',
    tags: ['Cell Membrane', 'Transport'],
    difficulty: 'Intermediate',
  },
  {
    id: 3,
    deckId: 1,
    front: 'What is the function of the Golgi apparatus?',
    back: 'The Golgi apparatus modifies, sorts, and packages proteins and lipids for storage in the cell or secretion outside the cell. It acts like a cellular post office, receiving, processing, and shipping cellular products.',
    tags: ['Organelles', 'Protein Processing'],
    difficulty: 'Intermediate',
  },
  {
    id: 4,
    deckId: 1,
    front: 'What is the structure and function of the nuclear envelope?',
    back: 'The nuclear envelope is a double membrane that surrounds the nucleus. It contains nuclear pores that allow for the selective transport of molecules between the nucleus and cytoplasm. Its main function is to protect the genetic material and regulate the flow of molecules in and out of the nucleus.',
    tags: ['Nucleus', 'Cell Structure'],
    difficulty: 'Intermediate',
  },
  {
    id: 5,
    deckId: 1,
    front: 'What is the role of lysosomes in the cell?',
    back: 'Lysosomes are membrane-bound organelles containing digestive enzymes. They function in intracellular digestion, breaking down waste materials, cellular debris, and foreign substances. They also participate in autophagy (self-eating) and apoptosis (programmed cell death).',
    tags: ['Organelles', 'Digestion'],
    difficulty: 'Intermediate',
  },
];

const Flashcards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [viewMode, setViewMode] = useState('decks'); // 'decks' or 'study'
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [bookmarkedCards, setBookmarkedCards] = useState({});
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newDeckData, setNewDeckData] = useState({
    title: '',
    description: '',
    subject: '',
  });
  
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

  const handleDifficultyFilterChange = (event) => {
    setDifficultyFilter(event.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSubjectFilter('');
    setDifficultyFilter('');
  };

  const handleOpenDeck = (deck) => {
    setSelectedDeck(deck);
    setViewMode('study');
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleBackToDecks = () => {
    setViewMode('decks');
    setSelectedDeck(null);
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCardIndex < mockFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleBookmarkCard = (cardId) => {
    setBookmarkedCards({
      ...bookmarkedCards,
      [cardId]: !bookmarkedCards[cardId],
    });
  };

  const handleCreateDeck = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleNewDeckInputChange = (e) => {
    const { name, value } = e.target;
    setNewDeckData({
      ...newDeckData,
      [name]: value,
    });
  };

  const handleSubmitNewDeck = () => {
    // In a real app, call API to create new deck
    // For demo, just close the dialog
    setOpenCreateDialog(false);
    setNewDeckData({
      title: '',
      description: '',
      subject: '',
    });
  };

  // Filter flashcard decks based on search query and filters
  const filteredDecks = mockFlashcardDecks.filter((deck) => {
    // Filter by tab (favorites)
    if (tabValue === 1 && !deck.isFavorite) return false;
    
    // Filter by search query
    if (searchQuery && !deck.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !deck.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by subject if selected
    if (subjectFilter && deck.subject !== subjectFilter) return false;
    
    // Filter by difficulty if selected
    if (difficultyFilter && deck.difficulty !== difficultyFilter) return false;
    
    return true;
  });

  const breadcrumbs = [
    { label: 'Flashcards', path: '/flashcards' },
    ...(selectedDeck ? [{ label: selectedDeck.title, path: `/flashcards/${selectedDeck.id}` }] : []),
  ];

  if (loading) {
    return <LoadingSpinner message="Loading flashcards..." />;
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={viewMode === 'decks' ? 'Flashcards' : selectedDeck?.title}
        subtitle={viewMode === 'decks' 
          ? 'Create and study flashcards to memorize key concepts' 
          : `${mockFlashcards.length} cards • ${selectedDeck?.difficulty} difficulty`
        }
        breadcrumbs={breadcrumbs}
      />

      {viewMode === 'decks' ? (
        // Flashcard Decks View
        <>
          <Box sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="flashcard tabs"
            >
              <Tab label="All Decks" />
              <Tab label="Favorites" />
            </Tabs>
          </Box>

          <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search flashcard decks..."
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
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateDeck}
            >
              Create New Deck
            </Button>
          </Box>

          <Grid container spacing={3}>
            {filteredDecks.map((deck) => {
              const subjectName = mockSubjects.find(s => s.id === deck.subject)?.name || 'General';
              
              return (
                <Grid item xs={12} sm={6} md={4} key={deck.id}>
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="h2">
                          {deck.title}
                        </Typography>
                        <IconButton 
                          color={deck.isFavorite ? 'primary' : 'default'}
                          size="small"
                          aria-label="favorite"
                        >
                          {deck.isFavorite ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SchoolIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {subjectName}
                        </Typography>
                        <Chip 
                          label={deck.difficulty} 
                          size="small" 
                          color={
                            deck.difficulty === 'Beginner' ? 'success' :
                            deck.difficulty === 'Intermediate' ? 'primary' : 'error'
                          }
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {deck.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {deck.cardCount} cards
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Updated: {deck.lastUpdated}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Progress: {deck.progress}%
                        </Typography>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <Box
                            sx={{
                              height: 8,
                              borderRadius: 5,
                              bgcolor: 'grey.300',
                              position: 'relative',
                            }}
                          >
                            <Box
                              sx={{
                                height: '100%',
                                borderRadius: 5,
                                bgcolor: deck.progress > 70 ? 'success.main' : 'primary.main',
                                width: `${deck.progress}%`,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {deck.tags.map((tag, index) => (
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
                    <Divider />
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDeck(deck)}
                        startIcon={<FlipIcon />}
                      >
                        Study
                      </Button>
                      <Box>
                        <IconButton size="small" color="primary" sx={{ mr: 1 }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          
          {filteredDecks.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No flashcard decks found matching your criteria.
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
        </>
      ) : (
        // Study Mode View
        <Box>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToDecks}
            >
              Back to Decks
            </Button>
            <Box>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                sx={{ mr: 1 }}
                onClick={() => {
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
              >
                Restart
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
              >
                Add Card
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body1">
              Card {currentCardIndex + 1} of {mockFlashcards.length}
            </Typography>
          </Box>
          
          <Paper 
            elevation={3} 
            sx={{
              height: 400,
              maxWidth: 700,
              mx: 'auto',
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
              position: 'relative',
              cursor: 'pointer',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              ...(isFlipped && {
                transform: 'rotateY(180deg)',
              }),
            }}
            onClick={handleFlipCard}
          >
            <Box 
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 1,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkCard(mockFlashcards[currentCardIndex].id);
              }}
            >
              <IconButton 
                color={bookmarkedCards[mockFlashcards[currentCardIndex].id] ? 'primary' : 'default'}
                size="small"
              >
                {bookmarkedCards[mockFlashcards[currentCardIndex].id] ? 
                  <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Box>
            
            <Box 
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                ...(isFlipped && {
                  transform: 'rotateY(180deg)',
                  visibility: 'hidden',
                }),
              }}
            >
              <Typography variant="h5" gutterBottom textAlign="center">
                {mockFlashcards[currentCardIndex].front}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Click to flip
              </Typography>
            </Box>
            
            <Box 
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                transform: 'rotateY(180deg)',
                ...(!isFlipped && {
                  visibility: 'hidden',
                }),
              }}
            >
              <Typography variant="body1" paragraph textAlign="center">
                {mockFlashcards[currentCardIndex].back}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Click to flip back
              </Typography>
            </Box>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNextCard}
              disabled={currentCardIndex === mockFlashcards.length - 1}
            >
              Next
            </Button>
          </Box>
          
          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Card Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Difficulty:</strong> {mockFlashcards[currentCardIndex].difficulty}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Tags:</strong> {mockFlashcards[currentCardIndex].tags.join(', ')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      
      {/* Create New Deck Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Flashcard Deck</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Deck Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newDeckData.title}
            onChange={handleNewDeckInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newDeckData.description}
            onChange={handleNewDeckInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              name="subject"
              value={newDeckData.subject}
              onChange={handleNewDeckInputChange}
              label="Subject"
            >
              {mockSubjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitNewDeck} 
            variant="contained" 
            color="primary"
            disabled={!newDeckData.title || !newDeckData.subject}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Flashcards;