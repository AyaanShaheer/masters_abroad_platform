import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  School,
  Psychology,
  TrendingUp,
  Chat,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Landing = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();

  const features = [
    {
      icon: <School sx={{ fontSize: 60, color: '#1976d2' }} />,
      title: 'Smart Program Search',
      description: 'Browse 1000+ graduate programs worldwide with advanced filtering',
    },
    {
      icon: <Psychology sx={{ fontSize: 60, color: '#2e7d32' }} />,
      title: 'AI-Powered Chatbot',
      description: 'Get instant answers about programs, scholarships, and requirements',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 60, color: '#ed6c02' }} />,
      title: 'Personalized Recommendations',
      description: 'AI matches you with programs based on your profile and preferences',
    },
    {
      icon: <Chat sx={{ fontSize: 60, color: '#9c27b0' }} />,
      title: 'Application Tracking',
      description: 'Manage and track all your applications in one place',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: mode === 'dark' 
      ? 'linear-gradient(135deg, #0a1929 0%, #1a2027 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    }}>
      {/* AppBar */}
      <AppBar position="static" elevation={0} sx={{ background: 'transparent' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Masters Abroad
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2, bgcolor: 'white', color: '#667eea', '&:hover': { bgcolor: '#f0f0f0' } }}
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: 'center', py: 10, color: 'white' }}
        >
          <Typography variant="h1" gutterBottom sx={{ fontWeight: 800 }}>
            Your Journey to
            <br />
            <span style={{ 
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent' 
            }}>
              Masters Abroad
            </span>
          </Typography>
          <Typography variant="h5" sx={{ mt: 3, mb: 5, opacity: 0.9 }}>
            AI-powered platform to find your perfect graduate program
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: '#f0f0f0', transform: 'scale(1.05)' },
                transition: 'all 0.3s',
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'white',
                color: 'white',
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Learn More
            </Button>
          </Box>
        </MotionBox>

        {/* Features */}
        <Box sx={{ py: 8 }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ color: 'white', mb: 6 }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    {feature.icon}
                    <Typography variant="h5" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          sx={{
            textAlign: 'center',
            py: 8,
            mb: 4,
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
            Ready to Find Your Dream Program?
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, mb: 4 }}>
            Join thousands of students finding their perfect match
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              fontSize: '1.2rem',
              px: 6,
              py: 2,
              '&:hover': { bgcolor: '#f0f0f0' },
            }}
          >
            Get Started Now
          </Button>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Landing;
