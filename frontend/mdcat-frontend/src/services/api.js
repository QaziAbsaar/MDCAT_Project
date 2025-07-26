import axios from 'axios';

// Create an axios instance with default config
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL, // FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      // Server responded with an error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API service functions
const apiService = {
  // Auth endpoints
  login: (credentials) => {
    // Convert to form data for FastAPI OAuth2
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    return api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  register: (userData) => api.post('/auth/register', userData),
  
  // User endpoints
  getUserProfile: () => api.get('/auth/me'),
  updateUserProfile: (data) => api.put('/auth/me', data),
  
  // MDCAT exam endpoints
  getSubjects: () => api.get('/subjects'),
  getTopicsBySubject: (subjectId) => api.get(`/subjects/${subjectId}/topics`),
  getQuestionsByTopic: (topicId) => api.get(`/topics/${topicId}/questions`),
  
  // Practice tests
  createPracticeTest: (data) => api.post('/practice-tests', data),
  getPracticeTest: (testId) => api.get(`/practice-tests/${testId}`),
  submitPracticeTest: (testId, answers) => api.post(`/practice-tests/${testId}/submit`, answers),
  
  // Mock exams
  getMockExams: () => api.get('/mock-exams'),
  getMockExam: (examId) => api.get(`/mock-exams/${examId}`),
  startMockExam: (examId) => api.post(`/mock-exams/${examId}/start`),
  submitMockExam: (examId, answers) => api.post(`/mock-exams/${examId}/submit`, answers),
  
  // Progress tracking
  getUserProgress: () => api.get('/progress'),
  getSubjectProgress: (subjectId) => api.get(`/progress/subjects/${subjectId}`),
  
  // Study resources
  getStudyResources: () => api.get('/resources'),
  getResourcesBySubject: (subjectId) => api.get(`/resources/subjects/${subjectId}`),
  
  // Flashcards
  getFlashcardDecks: () => api.get('/flashcards'),
  getFlashcardsByDeck: (deckId) => api.get(`/flashcards/${deckId}`),
  createFlashcard: (data) => api.post('/flashcards', data),
  updateFlashcard: (cardId, data) => api.put(`/flashcards/${cardId}`, data),
  deleteFlashcard: (cardId) => api.delete(`/flashcards/${cardId}`),
};

export default apiService;