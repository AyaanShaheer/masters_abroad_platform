import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  TrendingUp,
  School,
  AttachMoney,
  Timer,
  Star,
} from '@mui/icons-material';
import { recommendationsAPI, applicationsAPI } from '../services/api';

const Recommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const response = await recommendationsAPI.getRecommendations(10);
      setRecommendations(response.data);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      if (err.response?.status === 404 || err.response?.data?.detail?.includes('not found')) {
        setError('Please create your profile first to get personalized recommendations.');
      } else {
        setError('Unable to load recommendations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (programId) => {
    try {
      await applicationsAPI.createApplication({
        program_id: programId,
        status: 'INTERESTED',
        notes: 'Added from recommendations',
      });
      alert('Program added to your applications!');
    } catch (error) {
      alert('Error adding program: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Challenging';
  };

  const ScoreBar = ({ label, value, color }) => (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="caption" fontWeight="bold">
          {value}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        color={color}
        sx={{ height: 8, borderRadius: 1 }}
      />
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <TrendingUp sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI-Powered Recommendations
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Programs Recommended For You
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Based on your academic profile, test scores, and preferences
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
            {error.includes('profile') && (
              <Button
                size="small"
                sx={{ ml: 2 }}
                onClick={() => navigate('/profile')}
              >
                Create Profile
              </Button>
            )}
          </Alert>
        ) : recommendations.length === 0 ? (
          <Alert severity="info">
            No recommendations available. Please complete your profile.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {recommendations.map((rec, index) => (
              <Grid item xs={12} key={rec.program_id}>
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          bgcolor: getScoreColor(rec.scores.overall_score) + '.main',
                          color: 'white',
                          borderRadius: 2,
                          p: 2,
                          mr: 2,
                          minWidth: 80,
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold">
                          {rec.scores.overall_score}
                        </Typography>
                        <Typography variant="caption">Match</Typography>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            icon={<Star />}
                            label={`#${index + 1} Recommended`}
                            size="small"
                            color="primary"
                          />
                          <Chip
                            label={getScoreLabel(rec.scores.overall_score)}
                            size="small"
                            color={getScoreColor(rec.scores.overall_score)}
                          />
                        </Box>

                        <Typography variant="h6" gutterBottom>
                          {rec.program_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {rec.university_name}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <School fontSize="small" color="action" />
                            <Typography variant="body2">{rec.country}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AttachMoney fontSize="small" color="action" />
                            <Typography variant="body2">
                              ${rec.tuition_fee_usd?.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Timer fontSize="small" color="action" />
                            <Typography variant="body2">{rec.duration_months} months</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Score Breakdown */}
                    <Box sx={{ mt: 3, mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Match Breakdown
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <ScoreBar
                            label="Academic Match"
                            value={rec.scores.academic_match}
                            color={getScoreColor(rec.scores.academic_match)}
                          />
                          <ScoreBar
                            label="Test Scores"
                            value={rec.scores.test_scores}
                            color={getScoreColor(rec.scores.test_scores)}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ScoreBar
                            label="Preferences"
                            value={rec.scores.preferences}
                            color={getScoreColor(rec.scores.preferences)}
                          />
                          <ScoreBar
                            label="Affordability"
                            value={rec.scores.affordability}
                            color={getScoreColor(rec.scores.affordability)}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Explanation */}
                    <Alert severity="info" sx={{ mb: 2 }}>
                      {rec.explanation}
                    </Alert>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleApply(rec.program_id)}
                      >
                        Add to Applications
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate(`/programs`)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Recommendations;
