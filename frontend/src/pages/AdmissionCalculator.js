import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  Calculate,
  TrendingUp,
  CheckCircle,
  Warning,
  Info,
  ExpandMore,
} from '@mui/icons-material';
import { admissionAPI } from '../services/api';

const MotionCard = motion(Card);

const AdmissionCalculator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    handleAnalyze();
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await admissionAPI.analyze();
      setAnalysis(response.data);
      setMessage('✅ Analysis complete!');
    } catch (error) {
      setMessage('❌ Please complete your profile first to get predictions.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'warning';
    return 'error';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Safety':
        return <CheckCircle color="success" />;
      case 'Target':
        return <TrendingUp color="primary" />;
      case 'Reach':
        return <Warning color="warning" />;
      default:
        return <Info />;
    }
  };

  const ProgramCard = ({ program }) => (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 6 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {program.program_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {program.university_name} • {program.country}
            </Typography>
          </Box>
          <Chip
            icon={getCategoryIcon(program.category)}
            label={program.category}
            color={
              program.category === 'Safety'
                ? 'success'
                : program.category === 'Target'
                ? 'primary'
                : 'warning'
            }
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Admission Probability</Typography>
            <Typography variant="body2" fontWeight={600}>
              {program.admission_probability}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={program.admission_probability}
            color={getScoreColor(program.admission_probability)}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Typography variant="caption" color="text.secondary">
          Confidence: {program.confidence_score}%
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Calculate sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Admission Calculator
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {message && (
          <Alert
            severity={message.includes('❌') ? 'error' : 'success'}
            sx={{ mb: 3 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Analyzing your profile...
            </Typography>
          </Box>
        ) : analysis ? (
          <>
            {/* Overall Score */}
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{ mb: 3 }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
                    {analysis.overall_profile_score}%
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Overall Profile Strength
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Based on GPA, test scores, and experience
                  </Typography>
                </Box>
              </CardContent>
            </MotionCard>

            {/* General Suggestions */}
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              sx={{ mb: 3 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  💡 Recommendations to Improve Your Chances
                </Typography>
                <List>
                  {analysis.general_suggestions.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </MotionCard>

            {/* Program Categories */}
            <Grid container spacing={3}>
              {/* Safety Programs */}
              <Grid item xs={12} md={4}>
                <MotionCard
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Safety Schools
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      High chance of admission (70%+)
                    </Typography>

                    {analysis.safety_programs.length === 0 ? (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        No safety schools found. Consider improving your profile.
                      </Alert>
                    ) : (
                      analysis.safety_programs.map((program) => (
                        <ProgramCard key={program.program_id} program={program} />
                      ))
                    )}
                  </CardContent>
                </MotionCard>
              </Grid>

              {/* Target Programs */}
              <Grid item xs={12} md={4}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUp color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Target Schools
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Moderate chance (40-70%)
                    </Typography>

                    {analysis.target_programs.length === 0 ? (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        No target schools found.
                      </Alert>
                    ) : (
                      analysis.target_programs.map((program) => (
                        <ProgramCard key={program.program_id} program={program} />
                      ))
                    )}
                  </CardContent>
                </MotionCard>
              </Grid>

              {/* Reach Programs */}
              <Grid item xs={12} md={4}>
                <MotionCard
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Warning color="warning" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Reach Schools
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Lower chance (&lt;40%)
                    </Typography>

                    {analysis.reach_programs.length === 0 ? (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        No reach schools analyzed.
                      </Alert>
                    ) : (
                      analysis.reach_programs.map((program) => (
                        <ProgramCard key={program.program_id} program={program} />
                      ))
                    )}
                  </CardContent>
                </MotionCard>
              </Grid>
            </Grid>

            {/* Info Section */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">ℹ️ How It Works</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      Our AI model analyzes your academic profile and compares it with historical
                      admission data to predict your chances at different programs.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Factors considered:</strong>
                    </Typography>
                    <List dense>
                      <ListItem>• GPA (30% weight)</ListItem>
                      <ListItem>• GRE Score (30% weight)</ListItem>
                      <ListItem>• TOEFL/IELTS Score (20% weight)</ListItem>
                      <ListItem>• Work Experience (20% weight)</ListItem>
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2">
                      <strong>Model Accuracy:</strong> 87.25% on historical admission data
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>

            {/* Refresh Button */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={handleAnalyze}
                startIcon={<Calculate />}
              >
                Recalculate
              </Button>
            </Box>
          </>
        ) : (
          <Alert severity="info">
            Complete your profile to get admission predictions
          </Alert>
        )}
      </Container>
    </>
  );
};

export default AdmissionCalculator;
