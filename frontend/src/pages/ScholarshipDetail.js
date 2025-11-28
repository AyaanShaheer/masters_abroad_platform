import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, LocationOn, AttachMoney, Event, OpenInNew, CheckCircle } from '@mui/icons-material';
import { scholarshipsAPI, applicationsAPI } from '../services/api';

const ScholarshipDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadScholarship();
  }, [id]);

  const loadScholarship = async () => {
    try {
      const response = await scholarshipsAPI.getScholarship(id);
      setScholarship(response.data);
    } catch (error) {
      console.error('Error loading scholarship:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      await applicationsAPI.createApplication({
        scholarship_id: parseInt(id),
        program_id: null,
      });
      setMessage('✅ Application submitted successfully!');
    } catch (error) {
      setMessage('❌ Error submitting application. You may have already applied.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!scholarship) return <Typography>Scholarship not found</Typography>;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/scholarships')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Scholarship Details
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {message && (
          <Alert severity={message.includes('❌') ? 'error' : 'success'} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              {scholarship.scholarship_name}
            </Typography>

            <Typography variant="h6" color="primary" gutterBottom>
              {scholarship.provider}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              <Chip
                icon={<LocationOn />}
                label={scholarship.country}
                color="primary"
              />
              <Chip
                icon={<AttachMoney />}
                label={`$${scholarship.amount_usd?.toLocaleString()}`}
                color="success"
              />
              {scholarship.coverage_type && (
                <Chip label={scholarship.coverage_type} color="warning" />
              )}
              {scholarship.application_deadline && (
                <Chip
                  icon={<Event />}
                  label={`Deadline: ${new Date(scholarship.application_deadline).toLocaleDateString()}`}
                  color="error"
                />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                {scholarship.description && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {scholarship.description}
                    </Typography>
                  </>
                )}

                {scholarship.requirements && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Requirements
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {scholarship.requirements}
                    </Typography>
                  </>
                )}

                {scholarship.eligible_countries && scholarship.eligible_countries.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Eligible Countries
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {scholarship.eligible_countries.map((country, index) => (
                        <Chip key={index} label={country} />
                      ))}
                    </Box>
                  </>
                )}

                {scholarship.applicable_programs && scholarship.applicable_programs.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Applicable Programs
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {scholarship.applicable_programs.map((program, index) => (
                        <Chip key={index} label={program} color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'background.default' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Info
                    </Typography>

                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Amount"
                          secondary={`$${scholarship.amount_usd?.toLocaleString()}`}
                        />
                      </ListItem>
                      {scholarship.min_gpa && (
                        <ListItem>
                          <ListItemText primary="Min GPA" secondary={scholarship.min_gpa} />
                        </ListItem>
                      )}
                      {scholarship.application_deadline && (
                        <ListItem>
                          <ListItemText
                            primary="Deadline"
                            secondary={new Date(scholarship.application_deadline).toLocaleDateString()}
                          />
                        </ListItem>
                      )}
                    </List>

                    <Box sx={{ mt: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<CheckCircle />}
                        onClick={handleApply}
                        sx={{ mb: 1 }}
                      >
                        Apply Now
                      </Button>

                      {scholarship.website_url && (
                        <Button
                          fullWidth
                          variant="outlined"
                          endIcon={<OpenInNew />}
                          onClick={() => window.open(scholarship.website_url, '_blank')}
                        >
                          Official Website
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ScholarshipDetail;
