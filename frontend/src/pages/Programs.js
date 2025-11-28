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
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Search, FilterList, LocationOn, AttachMoney } from '@mui/icons-material';
import { programsAPI } from '../services/api';

const MotionCard = motion(Card);

const Programs = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [maxTuition, setMaxTuition] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    filterPrograms();
  }, [programs, searchQuery, selectedCountry, selectedField, maxTuition]);

  const loadPrograms = async () => {
    try {
      const response = await programsAPI.getPrograms({ limit: 1000 });
      setPrograms(response.data);
      setFilteredPrograms(response.data);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPrograms = () => {
    let filtered = [...programs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.program_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.university_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.field_of_study.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Country filter
    if (selectedCountry) {
      filtered = filtered.filter((p) => p.country === selectedCountry);
    }

    // Field filter
    if (selectedField) {
      filtered = filtered.filter((p) => p.field_of_study === selectedField);
    }

    // Tuition filter
    if (maxTuition) {
      filtered = filtered.filter((p) => p.tuition_fee_usd <= parseInt(maxTuition));
    }

    setFilteredPrograms(filtered);
    setPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('');
    setSelectedField('');
    setMaxTuition('');
  };

  // Get unique countries and fields for dropdowns
  const countries = [...new Set(programs.map((p) => p.country))].sort();
  const fields = [...new Set(programs.map((p) => p.field_of_study))].sort();

  // Pagination
  const paginatedPrograms = filteredPrograms.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Browse Programs
          </Typography>
          <Chip
            label={`${filteredPrograms.length} Programs`}
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
                placeholder="Search programs..."
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
                <InputLabel>Field of Study</InputLabel>
                <Select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  label="Field of Study"
                >
                  <MenuItem value="">All Fields</MenuItem>
                  {fields.map((field) => (
                    <MenuItem key={field} value={field}>
                      {field}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Max Tuition (USD)"
                type="number"
                value={maxTuition}
                onChange={(e) => setMaxTuition(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <Button fullWidth variant="outlined" onClick={clearFilters} sx={{ height: 56 }}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Programs Grid */}
        {loading ? (
          <Typography>Loading programs...</Typography>
        ) : filteredPrograms.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No programs found matching your criteria
            </Typography>
          </Card>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedPrograms.map((program, index) => (
                <Grid item xs={12} md={6} lg={4} key={program.id}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {program.program_name}
                      </Typography>

                      <Typography variant="subtitle1" color="primary" gutterBottom noWrap>
                        {program.university_name}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<LocationOn />}
                          label={program.country}
                          size="small"
                          color="primary"
                        />
                        <Chip label={program.field_of_study} size="small" />
                        <Chip
                          icon={<AttachMoney />}
                          label={`$${program.tuition_fee_usd?.toLocaleString()}`}
                          size="small"
                          color="success"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Duration:</strong> {program.duration_months} months
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Degree:</strong> {program.degree_type}
                      </Typography>

                      {program.min_gpa && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Min GPA:</strong> {program.min_gpa}
                        </Typography>
                      )}

                      {program.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 2 }}
                          noWrap
                        >
                          {program.description}
                        </Typography>
                      )}
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/programs/${program.id}`)}
                      >
                        View Details
                      </Button>
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

export default Programs;
