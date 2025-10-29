import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { userAPI } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    highest_degree: '',
    field_of_study: '',
    gpa: '',
    gre_score: '',
    toefl_score: '',
    ielts_score: '',
    preferred_countries: '',
    preferred_programs: '',
    budget_range: '',
    work_experience_years: '',
    research_experience: '',
    extracurriculars: '',
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
      setFormData({
        highest_degree: response.data.highest_degree || '',
        field_of_study: response.data.field_of_study || '',
        gpa: response.data.gpa || '',
        gre_score: response.data.gre_score || '',
        toefl_score: response.data.toefl_score || '',
        ielts_score: response.data.ielts_score || '',
        preferred_countries: response.data.preferred_countries?.join(', ') || '',
        preferred_programs: response.data.preferred_programs?.join(', ') || '',
        budget_range: response.data.budget_range || '',
        work_experience_years: response.data.work_experience_years || '',
        research_experience: response.data.research_experience || '',
        extracurriculars: response.data.extracurriculars || '',
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = {
      ...formData,
      gpa: formData.gpa ? parseFloat(formData.gpa) : null,
      gre_score: formData.gre_score ? parseInt(formData.gre_score) : null,
      toefl_score: formData.toefl_score ? parseInt(formData.toefl_score) : null,
      ielts_score: formData.ielts_score ? parseFloat(formData.ielts_score) : null,
      work_experience_years: formData.work_experience_years
        ? parseInt(formData.work_experience_years)
        : 0,
      preferred_countries: formData.preferred_countries
        ? formData.preferred_countries.split(',').map((s) => s.trim())
        : null,
      preferred_programs: formData.preferred_programs
        ? formData.preferred_programs.split(',').map((s) => s.trim())
        : null,
    };

    try {
      if (profile) {
        await userAPI.updateProfile(data);
      } else {
        await userAPI.createProfile(data);
      }
      setSuccess('Profile saved successfully!');
      loadProfile();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error saving profile');
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Academic Profile
              </Typography>

              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Highest Degree"
                      name="highest_degree"
                      value={formData.highest_degree}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Field of Study"
                      name="field_of_study"
                      value={formData.field_of_study}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="GPA"
                      name="gpa"
                      type="number"
                      inputProps={{ step: 0.1, min: 0, max: 4 }}
                      value={formData.gpa}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Work Experience (years)"
                      name="work_experience_years"
                      type="number"
                      value={formData.work_experience_years}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="GRE Score"
                      name="gre_score"
                      type="number"
                      value={formData.gre_score}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="TOEFL Score"
                      name="toefl_score"
                      type="number"
                      value={formData.toefl_score}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="IELTS Score"
                      name="ielts_score"
                      type="number"
                      inputProps={{ step: 0.5, min: 0, max: 9 }}
                      value={formData.ielts_score}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Preferred Countries"
                      name="preferred_countries"
                      value={formData.preferred_countries}
                      onChange={handleChange}
                      helperText="Comma-separated (e.g., USA, Canada, UK)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Budget Range"
                      name="budget_range"
                      value={formData.budget_range}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Preferred Programs"
                      name="preferred_programs"
                      value={formData.preferred_programs}
                      onChange={handleChange}
                      helperText="Comma-separated (e.g., Computer Science, Data Science)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Research Experience"
                      name="research_experience"
                      multiline
                      rows={3}
                      value={formData.research_experience}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Extracurriculars"
                      name="extracurriculars"
                      multiline
                      rows={3}
                      value={formData.extracurriculars}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Save Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Profile;
