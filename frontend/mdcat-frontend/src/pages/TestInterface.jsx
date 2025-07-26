import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Radio,
  RadioGroup,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Flag as FlagIcon,
  Timer as TimerIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Help as HelpIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Mock test data (replace with actual API calls)
const mockTest = {
  id: 1,
  title: 'Biology Fundamentals',
  description: 'Test your knowledge of basic biological concepts and principles.',
  timeLimit: 30, // minutes
  subject: 'Biology',
  questions: [
    {
      id: 1,
      text: 'Which of the following is NOT a function of the cell membrane?',
      options: [
        { id: 'a', text: 'Regulating the passage of materials into and out of the cell' },
        { id: 'b', text: 'Providing structural support to the cell' },
        { id: 'c', text: 'Protein synthesis and translation' },
        { id: 'd', text: 'Cell-to-cell recognition and communication' },
        { id: 'e', text: 'Protection of the cell from its surroundings' },
      ],
      correctAnswer: 'c',
      explanation: 'Protein synthesis and translation occur in the ribosomes, not in the cell membrane. The cell membrane is responsible for regulating passage of materials, providing some structural support, cell recognition, and protection.',
    },
    {
      id: 2,
      text: 'Which organelle is known as the "powerhouse of the cell"?',
      options: [
        { id: 'a', text: 'Nucleus' },
        { id: 'b', text: 'Mitochondria' },
        { id: 'c', text: 'Endoplasmic Reticulum' },
        { id: 'd', text: 'Golgi Apparatus' },
        { id: 'e', text: 'Lysosome' },
      ],
      correctAnswer: 'b',
      explanation: 'Mitochondria are known as the "powerhouse of the cell" because they generate most of the cell\'s supply of adenosine triphosphate (ATP), which is used as a source of chemical energy.',
    },
    {
      id: 3,
      text: 'Which of the following is a characteristic of DNA but not RNA?',
      options: [
        { id: 'a', text: 'Contains nucleotides' },
        { id: 'b', text: 'Can carry genetic information' },
        { id: 'c', text: 'Contains the sugar deoxyribose' },
        { id: 'd', text: 'Can form a double helix' },
        { id: 'e', text: 'Contains phosphate groups' },
      ],
      correctAnswer: 'c',
      explanation: 'DNA contains the sugar deoxyribose, while RNA contains the sugar ribose. Both DNA and RNA contain nucleotides, can carry genetic information, can form helical structures (though RNA is usually single-stranded), and contain phosphate groups.',
    },
    {
      id: 4,
      text: 'Which of the following processes occurs in the mitochondria?',
      options: [
        { id: 'a', text: 'Photosynthesis' },
        { id: 'b', text: 'Protein synthesis' },
        { id: 'c', text: 'Lipid synthesis' },
        { id: 'd', text: 'Krebs cycle' },
        { id: 'e', text: 'DNA replication' },
      ],
      correctAnswer: 'd',
      explanation: 'The Krebs cycle (also known as the citric acid cycle or TCA cycle) occurs in the mitochondria. Photosynthesis occurs in chloroplasts, protein synthesis occurs on ribosomes, lipid synthesis primarily occurs in the smooth endoplasmic reticulum, and DNA replication occurs in the nucleus.',
    },
    {
      id: 5,
      text: 'Which of the following is NOT a component of the cell theory?',
      options: [
        { id: 'a', text: 'All living organisms are composed of one or more cells' },
        { id: 'b', text: 'The cell is the basic unit of life' },
        { id: 'c', text: 'All cells arise from pre-existing cells' },
        { id: 'd', text: 'Cells contain genetic material passed to daughter cells' },
        { id: 'e', text: 'All cells are identical in structure and function' },
      ],
      correctAnswer: 'e',
      explanation: 'The statement "All cells are identical in structure and function" is NOT a component of the cell theory. In fact, cells vary widely in structure and function depending on their type and the organism they belong to. The cell theory states that all living organisms are composed of cells, the cell is the basic unit of life, and all cells arise from pre-existing cells.',
    },
  ],
};

const TestInterface = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  
  // Load test data
  useEffect(() => {
    // In a real app, fetch test data from API
    // const fetchTest = async () => {
    //   try {
    //     const data = await apiService.getTest(testId);
    //     setTest(data);
    //     setTimeRemaining(data.timeLimit * 60); // Convert minutes to seconds
    //   } catch (error) {
    //     console.error('Error fetching test:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchTest();
    
    // For demo purposes, use mock data
    setTimeout(() => {
      setTest(mockTest);
      setTimeRemaining(mockTest.timeLimit * 60); // Convert minutes to seconds
      setLoading(false);
    }, 1000);
    
    return () => {
      // Cleanup if needed
    };
  }, [testId]);
  
  // Timer countdown
  useEffect(() => {
    if (!loading && timeRemaining > 0 && !testCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [loading, timeRemaining, testCompleted]);
  
  if (loading) {
    return <LoadingSpinner message="Loading test..." />;
  }
  
  if (!test) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Test not found
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/practice')}
        >
          Back to Practice Tests
        </Button>
      </Container>
    );
  }
  
  const currentQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAnswerChange = (event) => {
    const { value } = event.target;
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };
  
  const handleFlagQuestion = () => {
    setFlagged({
      ...flagged,
      [currentQuestion.id]: !flagged[currentQuestion.id],
    });
  };
  
  const handleBookmarkQuestion = () => {
    setBookmarked({
      ...bookmarked,
      [currentQuestion.id]: !bookmarked[currentQuestion.id],
    });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };
  
  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowExplanation(false);
  };
  
  const handleToggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };
  
  const handleSubmitTest = () => {
    setTestCompleted(true);
    // In a real app, send answers to API
    // apiService.submitTest(testId, answers);
  };
  
  const handleConfirmSubmit = () => {
    setConfirmSubmit(true);
  };
  
  const handleConfirmExit = () => {
    setConfirmExit(true);
  };
  
  const handleExitTest = () => {
    navigate('/practice');
  };
  
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;
  
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 2 }}>
      {/* Test header */}
      <Container maxWidth="lg">
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            mb: 2, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Typography variant="h6" component="h1">
              {test.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {test.subject} • {totalQuestions} Questions
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<TimerIcon />} 
              label={formatTime(timeRemaining)}
              color={timeRemaining < 300 ? 'error' : 'default'}
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
            
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleConfirmExit}
              startIcon={<CloseIcon />}
            >
              Exit
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleConfirmSubmit}
              startIcon={<CheckIcon />}
              disabled={testCompleted}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Container>
      
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Main content - Question */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </Typography>
                  <Box>
                    <IconButton 
                      color={flagged[currentQuestion.id] ? 'error' : 'default'}
                      onClick={handleFlagQuestion}
                      title="Flag for review"
                    >
                      <FlagIcon />
                    </IconButton>
                    <IconButton 
                      color={bookmarked[currentQuestion.id] ? 'primary' : 'default'}
                      onClick={handleBookmarkQuestion}
                      title="Bookmark question"
                    >
                      {bookmarked[currentQuestion.id] ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Box>
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ mb: 3, height: 8, borderRadius: 5 }} 
                />
                
                <Typography variant="h6" gutterBottom>
                  {currentQuestion.text}
                </Typography>
                
                <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
                  <RadioGroup
                    name={`question-${currentQuestion.id}`}
                    value={answers[currentQuestion.id] || ''}
                    onChange={handleAnswerChange}
                  >
                    {currentQuestion.options.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.id}
                        control={<Radio />}
                        label={
                          <Typography variant="body1">
                            {option.id.toUpperCase()}. {option.text}
                          </Typography>
                        }
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                          ...(testCompleted && option.id === currentQuestion.correctAnswer && {
                            bgcolor: 'success.light',
                          }),
                          ...(testCompleted && 
                            answers[currentQuestion.id] === option.id && 
                            option.id !== currentQuestion.correctAnswer && {
                              bgcolor: 'error.light',
                            }),
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                
                {testCompleted && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleToggleExplanation}
                      startIcon={<HelpIcon />}
                    >
                      {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </Button>
                    
                    {showExplanation && (
                      <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.light' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Explanation:
                        </Typography>
                        <Typography variant="body2">
                          {currentQuestion.explanation}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
            
            {/* Navigation buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1}
              >
                Next
              </Button>
            </Box>
          </Grid>
          
          {/* Sidebar - Question navigation */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Test Progress
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">
                    Answered: {answeredCount}/{totalQuestions}
                  </Typography>
                  <Typography variant="body2" color="error">
                    Flagged: {flaggedCount}
                  </Typography>
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={(answeredCount / totalQuestions) * 100} 
                  sx={{ mb: 3, height: 8, borderRadius: 5 }} 
                />
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Question Navigator
                </Typography>
                
                <Grid container spacing={1}>
                  {test.questions.map((question, index) => {
                    const isAnswered = Boolean(answers[question.id]);
                    const isFlagged = Boolean(flagged[question.id]);
                    const isCurrentQuestion = index === currentQuestionIndex;
                    
                    let bgColor = 'grey.200';
                    if (isCurrentQuestion) bgColor = 'primary.main';
                    else if (isAnswered) bgColor = 'success.light';
                    if (isFlagged) bgColor = 'error.light';
                    
                    return (
                      <Grid item key={question.id}>
                        <Button
                          variant={isCurrentQuestion ? 'contained' : 'outlined'}
                          sx={{
                            minWidth: '40px',
                            height: '40px',
                            p: 0,
                            bgcolor: isCurrentQuestion ? 'primary.main' : 'transparent',
                            borderColor: isFlagged ? 'error.main' : (isAnswered ? 'success.main' : 'grey.300'),
                            color: isCurrentQuestion ? 'white' : (isFlagged ? 'error.main' : (isAnswered ? 'success.main' : 'text.primary')),
                          }}
                          onClick={() => handleJumpToQuestion(index)}
                        >
                          {index + 1}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Legend:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: 'grey.300', borderRadius: 1, mr: 1 }} />
                      <Typography variant="body2">Unanswered</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: 'success.light', borderRadius: 1, mr: 1 }} />
                      <Typography variant="body2">Answered</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: 'error.light', borderRadius: 1, mr: 1 }} />
                      <Typography variant="body2">Flagged</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: 'primary.main', borderRadius: 1, mr: 1 }} />
                      <Typography variant="body2">Current</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            {testCompleted && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Test Completed
                  </Typography>
                  <Typography variant="body2" paragraph>
                    You have completed this test. You can review your answers and explanations.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<HomeIcon />}
                    onClick={handleExitTest}
                  >
                    Return to Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
      
      {/* Confirmation dialogs */}
      <Dialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
      >
        <DialogTitle>Submit Test?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have answered {answeredCount} out of {totalQuestions} questions.
            {unansweredCount > 0 && ` There are still ${unansweredCount} unanswered questions.`}
            Are you sure you want to submit your test?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmSubmit(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setConfirmSubmit(false);
              handleSubmitTest();
            }} 
            color="primary" 
            variant="contained"
            autoFocus
          >
            Submit Test
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={confirmExit}
        onClose={() => setConfirmExit(false)}
      >
        <DialogTitle>Exit Test?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your progress will be lost if you exit now. Are you sure you want to exit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmExit(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleExitTest} 
            color="error" 
            variant="contained"
          >
            Exit Test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestInterface;