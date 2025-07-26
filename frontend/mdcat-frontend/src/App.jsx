import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme';
import { AuthProvider } from './context/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Practice from './pages/Practice';
import Resources from './pages/Resources';
import Flashcards from './pages/Flashcards';
import Profile from './pages/Profile';
import TestInterface from './pages/TestInterface';
import ProgressPage from './pages/ProgressPage';

// Styles
import './App.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/test/:testId" element={<TestInterface />} />
              <Route path="/test/:testId/info" element={<TestInterface />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
