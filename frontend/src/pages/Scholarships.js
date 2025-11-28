import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Pagination,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  Search,
  FilterList,
  LocationOn,
  AttachMoney,
  Event,
  OpenInNew,
} from '@mui/icons-material';
import { scholarshipsAPI } from '../services/api';

const MotionCard = motion(Card);

const Scholarships = () => {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCoverage, setSelectedCoverage] = useState('');
  const [minAmount, setMinAmount] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    loadScholarships();
  }, []);

  useEffect(() => {
    filterScholarships();
  }, [scholarships, searchQuery, selectedCountry, selectedCoverage, minAmount]);

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

  const filterScholarships = () => {
    let filtered = [...scholarships];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.scholarship_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Country filter
    if (selectedCountry) {
      filtered = filtered.filter((s) => s.country === selectedCountry);
    }

    // Coverage filter
    if (selectedCoverage) {
      filtered = filtered.filter((s) => s.coverage_type === selectedCoverage);
    }

    // Amount filter
    if (minAmount) {
      filtered = filtered.filter((s) => s.amount_usd >= parseInt(minAmount));
    }

    setFilteredScholarships(filtered);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('');
    setSelectedCoverage('');
    setMinAmount('');
  };

  // Get unique values for dropdowns
  const countries = [...new Set(scholarships.map((s) => s.country))].sort();
  const coverageTypes = [...new Set(scholarships.map((s) => s.coverage_type))].filter(Boolean);

  // Pagination
  const paginatedScholarships = filteredScholarships.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);

  const getCoverageColor = (coverage) => {
    if (coverage?.toLowerCase().includes('full')) return 'success';
    if (coverage?.toLowerCase().includes('partial')) return 'warning';
    return 'default';
  };

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
          <Chip
            label={`${filteredScholarships.length} Scholarships`}
            color="secondary"
            sx={{ fontWeight: 600 }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Filters */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  label="Country"
                >
                  <MenuItem value="">All Countries</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Coverage Type</InputLabel>
                <Select
                  value={selectedCoverage}
                  onChange={(e) => setSelectedCoverage(e.target.value)}
                  label="Coverage Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {coverageTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Min Amount (USD)"
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <Button fullWidth variant="outlined" onClick={clearFilters} sx={{ height: 56 }}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Scholarships Grid */}
        {loading ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        ) : filteredScholarships.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No scholarships found matching your criteria
            </Typography>
          </Card>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedScholarships.map((scholarship, index) => (
                <Grid item xs={12} md={6} lg={4} key={scholarship.id}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {scholarship.scholarship_name}
                      </Typography>

                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {scholarship.provider}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<LocationOn />}
                          label={scholarship.country}
                          size="small"
                          color="primary"
                        />
                        <Chip
                          icon={<AttachMoney />}
                          label={`$${scholarship.amount_usd?.toLocaleString()}`}
                          size="small"
                          color="success"
                        />
                        {scholarship.coverage_type && (
                          <Chip
                            label={scholarship.coverage_type}
                            size="small"
                            color={getCoverageColor(scholarship.coverage_type)}
                          />
                        )}
                      </Box>

                      {scholarship.min_gpa && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Min GPA:</strong> {scholarship.min_gpa}
                        </Typography>
                      )}

                      {scholarship.application_deadline && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Event sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            Deadline: {new Date(scholarship.application_deadline).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}

                      {scholarship.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {scholarship.description}
                        </Typography>
                      )}
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/scholarships/${scholarship.id}`)}
                      >
                        View Details
                      </Button>
                      {scholarship.website_url && (
                        <IconButton
                          color="primary"
                          onClick={() => window.open(scholarship.website_url, '_blank')}
                        >
                          <OpenInNew />
                        </IconButton>
                      )}
                    </Box>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default Scholarships;
