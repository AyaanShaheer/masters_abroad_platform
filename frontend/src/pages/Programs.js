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
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Add } from '@mui/icons-material';
import { programsAPI, applicationsAPI } from '../services/api';

const Programs = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    field_of_study: '',
    university_name: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, programs]);

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

  const applyFilters = () => {
    let filtered = programs;

    if (filters.country) {
      filtered = filtered.filter((p) => p.country === filters.country);
    }
    if (filters.field_of_study) {
      filtered = filtered.filter((p) => p.field_of_study === filters.field_of_study);
    }
    if (filters.university_name) {
      filtered = filtered.filter((p) =>
        p.university_name.toLowerCase().includes(filters.university_name.toLowerCase())
      );
    }

    setFilteredPrograms(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleApply = async (programId) => {
    try {
      await applicationsAPI.createApplication({
        program_id: programId,
        status: 'INTERESTED',
        notes: '',
      });
      alert('Application created successfully!');
    } catch (error) {
      console.error('Error details:', error.response?.data);
      const errorMsg = error.response?.data?.detail 
        ? (typeof error.response.data.detail === 'string' 
            ? error.response.data.detail 
            : JSON.stringify(error.response.data.detail))
        : 'Error creating application. Please try again.';
      alert(errorMsg);
    }
  };

  const countries = [...new Set(programs.map((p) => p.country))];
  const fields = [...new Set(programs.map((p) => p.field_of_study))];

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
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Filters */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Search Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Country"
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
              >
                <MenuItem value="">All Countries</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Field of Study"
                value={filters.field_of_study}
                onChange={(e) => handleFilterChange('field_of_study', e.target.value)}
              >
                <MenuItem value="">All Fields</MenuItem>
                {fields.map((field) => (
                  <MenuItem key={field} value={field}>
                    {field}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="University Name"
                value={filters.university_name}
                onChange={(e) => handleFilterChange('university_name', e.target.value)}
                placeholder="Search by name..."
              />
            </Grid>
          </Grid>
        </Card>

        {/* Results */}
        <Typography variant="h6" gutterBottom>
          {filteredPrograms.length} Programs Found
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredPrograms.map((program) => (
              <Grid item xs={12} md={6} key={program.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {program.program_name}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {program.university_name}
                    </Typography>

                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Chip label={program.country} size="small" sx={{ mr: 1 }} />
                      <Chip label={program.degree_type} size="small" color="primary" />
                    </Box>

                    <Typography variant="body2" paragraph>
                      {program.description}
                    </Typography>

                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Tuition Fee
                        </Typography>
                        <Typography variant="body2">
                          ${program.tuition_fee_usd?.toLocaleString() || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body2">
                          {program.duration_months} months
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Min GPA
                        </Typography>
                        <Typography variant="body2">{program.min_gpa || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Min GRE
                        </Typography>
                        <Typography variant="body2">{program.min_gre || 'N/A'}</Typography>
                      </Grid>
                    </Grid>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Add />}
                      onClick={() => handleApply(program.id)}
                    >
                      Add to Applications
                    </Button>
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

export default Programs;
