import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  TextField,
  Grid,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  Notifications,
  NotificationsActive,
  Email,
  Delete,
  Refresh,
} from '@mui/icons-material';
import { scraperAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MotionCard = motion(Card);

const ScholarshipAlerts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [countries, setCountries] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [newCountry, setNewCountry] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [scrapedScholarships, setScrapedScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const availableCountries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'Netherlands'];

  useEffect(() => {
    loadSubscription();
    loadScrapedScholarships();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await scraperAPI.getSubscription();
      setSubscription(response.data);
      setIsSubscribed(response.data.is_active);
      setCountries(response.data.countries || []);
      setKeywords(response.data.keywords || []);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const loadScrapedScholarships = async () => {
    try {
      const response = await scraperAPI.getScraped(0, 10);
      setScrapedScholarships(response.data);
    } catch (error) {
      console.error('Error loading scraped scholarships:', error);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await scraperAPI.subscribe({
        countries,
        keywords,
      });
      setMessage('Successfully subscribed to scholarship alerts!');
      setIsSubscribed(true);
      loadSubscription();
    } catch (error) {
      setMessage('Error subscribing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      await scraperAPI.unsubscribe();
      setMessage('Successfully unsubscribed from alerts.');
      setIsSubscribed(false);
      loadSubscription();
    } catch (error) {
      setMessage('Error unsubscribing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addCountry = () => {
    if (newCountry && !countries.includes(newCountry)) {
      setCountries([...countries, newCountry]);
      setNewCountry('');
    }
  };

  const removeCountry = (country) => {
    setCountries(countries.filter((c) => c !== country));
  };

  const addKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      await loadScrapedScholarships();
      setMessage('Data refreshed successfully!');
    } catch (error) {
      setMessage('Error refreshing data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Notifications sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Scholarship Alerts
          </Typography>
          <IconButton color="inherit" onClick={handleRefreshData}>
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {message && (
          <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {/* Subscription Status */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ mb: 3 }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isSubscribed ? (
                  <NotificationsActive sx={{ fontSize: 40, color: 'success.main' }} />
                ) : (
                  <Notifications sx={{ fontSize: 40, color: 'text.secondary' }} />
                )}
                <Box>
                  <Typography variant="h6">
                    {isSubscribed ? 'Alerts Active' : 'Alerts Inactive'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isSubscribed
                      ? `Receiving alerts at ${user?.email}`
                      : 'Subscribe to get notified about new scholarships'}
                  </Typography>
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={isSubscribed}
                    onChange={(e) =>
                      e.target.checked ? handleSubscribe() : handleUnsubscribe()
                    }
                  />
                }
                label=""
              />
            </Box>
          </CardContent>
        </MotionCard>

        {/* Configuration */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  🌍 Countries
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Select countries you're interested in
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    select
                    size="small"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    SelectProps={{ native: true }}
                    fullWidth
                  >
                    <option value="">Select country</option>
                    {availableCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </TextField>
                  <Button variant="contained" onClick={addCountry}>
                    Add
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {countries.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No countries selected (all countries)
                    </Typography>
                  ) : (
                    countries.map((country) => (
                      <Chip
                        key={country}
                        label={country}
                        onDelete={() => removeCountry(country)}
                        color="primary"
                      />
                    ))
                  )}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  🔍 Keywords
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Add keywords to filter scholarships
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="e.g., Computer Science"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    fullWidth
                  />
                  <Button variant="contained" onClick={addKeyword}>
                    Add
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {keywords.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No keywords added
                    </Typography>
                  ) : (
                    keywords.map((keyword) => (
                      <Chip
                        key={keyword}
                        label={keyword}
                        onDelete={() => removeKeyword(keyword)}
                        color="secondary"
                      />
                    ))
                  )}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Email />}
            onClick={handleSubscribe}
            disabled={loading}
            sx={{ px: 6 }}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </Box>

        {/* Recently Found Scholarships */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📰 Recently Found Scholarships
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Latest scholarships discovered by our AI scraper
            </Typography>

            {scrapedScholarships.length === 0 ? (
              <Alert severity="info">
                No scholarships found yet. The scraper runs daily at 9 AM.
              </Alert>
            ) : (
              <List>
                {scrapedScholarships.map((scholarship, index) => (
                  <React.Fragment key={scholarship.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight={600}>
                            {scholarship.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" component="span">
                              {scholarship.description}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                              {scholarship.amount && (
                                <Chip label={scholarship.amount} size="small" color="success" />
                              )}
                              {scholarship.country && (
                                <Chip label={scholarship.country} size="small" />
                              )}
                              {scholarship.deadline && (
                                <Chip label={`Deadline: ${scholarship.deadline}`} size="small" color="warning" />
                              )}
                            </Box>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                              Source: {scholarship.source_name}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < scrapedScholarships.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </MotionCard>

        {/* How It Works */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            ℹ️ How It Works
          </Typography>
          <Typography variant="body2" paragraph>
            1. <strong>AI Web Scraper:</strong> Our intelligent agent monitors official and unofficial scholarship websites daily
          </Typography>
          <Typography variant="body2" paragraph>
            2. <strong>Smart Filtering:</strong> Scholarships are filtered based on your selected countries and keywords
          </Typography>
          <Typography variant="body2" paragraph>
            3. <strong>Email Notifications:</strong> Get instant alerts when new matching scholarships are found
          </Typography>
          <Typography variant="body2">
            4. <strong>Auto-Update:</strong> The scraper runs automatically every day at 9 AM
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default ScholarshipAlerts;
