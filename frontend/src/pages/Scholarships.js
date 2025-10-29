import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Box,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, OpenInNew } from '@mui/icons-material';
import { scholarshipsAPI } from '../services/api';

const Scholarships = () => {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [countryFilter, setCountryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScholarships();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryFilter, scholarships]);

  const loadScholarships = async () => {
    try {
      const response = await scholarshipsAPI.getScholarships({ limit: 1000 });
      setScholarships(response.data);
      setFilteredScholarships(response.data);
    } catch (error) {
      console.error('Error loading scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = scholarships;
    if (countryFilter) {
      filtered = filtered.filter((s) => s.country === countryFilter);
    }
    setFilteredScholarships(filtered);
  };

  const countries = [...new Set(scholarships.map((s) => s.country))];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Scholarships
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Filter */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Country"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <MenuItem value="">All Countries</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Card>

        {/* Results */}
        <Typography variant="h6" gutterBottom>
          {filteredScholarships.length} Scholarships Found
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredScholarships.map((scholarship) => (
              <Grid item xs={12} md={6} key={scholarship.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {scholarship.scholarship_name}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {scholarship.provider}
                    </Typography>

                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Chip label={scholarship.country} size="small" sx={{ mr: 1 }} />
                      <Chip
                        label={scholarship.coverage_type}
                        size="small"
                        color="success"
                      />
                    </Box>

                    <Typography variant="body2" paragraph>
                      {scholarship.description}
                    </Typography>

                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Amount
                        </Typography>
                        <Typography variant="body2">
                          ${scholarship.amount_usd?.toLocaleString() || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Min GPA
                        </Typography>
                        <Typography variant="body2">
                          {scholarship.min_gpa || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>

                    {scholarship.website_url && (
                      <Link
                        href={scholarship.website_url}
                        target="_blank"
                        rel="noopener"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        Visit Website <OpenInNew fontSize="small" />
                      </Link>
                    )}
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

export default Scholarships;
