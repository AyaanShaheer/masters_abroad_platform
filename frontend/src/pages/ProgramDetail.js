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
import {
  ArrowBack,
  LocationOn,
  AttachMoney,
  School,
  Timer,
  CheckCircle,
  OpenInNew,
} from '@mui/icons-material';
import { programsAPI, applicationsAPI } from '../services/api';

const ProgramDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProgram();
  }, [id]);

  const loadProgram = async () => {
    try {
      const response = await programsAPI.getProgram(id);
      setProgram(response.data);
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      await applicationsAPI.createApplication({
        program_id: parseInt(id),
        scholarship_id: null,
      });
      setMessage('✅ Application submitted successfully!');
    } catch (error) {
      setMessage('❌ Error submitting application. You may have already applied.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!program) return <Typography>Program not found</Typography>;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/programs')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Program Details
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
              {program.program_name}
            </Typography>

            <Typography variant="h6" color="primary" gutterBottom>
              {program.university_name}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              <Chip icon={<LocationOn />} label={`${program.city}, ${program.country}`} color="primary" />
              <Chip icon={<School />} label={program.degree_type} />
              <Chip icon={<AttachMoney />} label={`$${program.tuition_fee_usd?.toLocaleString()}`} color="success" />
              <Chip icon={<Timer />} label={`${program.duration_months} months`} />
              <Chip label={program.field_of_study} color="secondary" />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                {program.description && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Program Description
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {program.description}
                    </Typography>
                  </>
                )}

                {program.requirements_details && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Requirements
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {program.requirements_details}
                    </Typography>
                  </>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Minimum Requirements
                </Typography>
                <List>
                  {program.min_gpa && (
                    <ListItem>
                      <ListItemText primary={`GPA: ${program.min_gpa}`} />
                    </ListItem>
                  )}
                  {program.min_gre && (
                    <ListItem>
                      <ListItemText primary={`GRE: ${program.min_gre}`} />
                    </ListItem>
                  )}
                  {program.min_toefl && (
                    <ListItem>
                      <ListItemText primary={`TOEFL: ${program.min_toefl}`} />
                    </ListItem>
                  )}
                  {program.min_ielts && (
                    <ListItem>
                      <ListItemText primary={`IELTS: ${program.min_ielts}`} />
                    </ListItem>
                  )}
                </List>
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
                          primary="Tuition Fee"
                          secondary={`$${program.tuition_fee_usd?.toLocaleString()}/year`}
                        />
                      </ListItem>
                      {program.application_fee_usd && (
                        <ListItem>
                          <ListItemText
                            primary="Application Fee"
                            secondary={`$${program.application_fee_usd}`}
                          />
                        </ListItem>
                      )}
                      <ListItem>
                        <ListItemText primary="Duration" secondary={`${program.duration_months} months`} />
                      </ListItem>
                      {program.application_deadline && (
                        <ListItem>
                          <ListItemText
                            primary="Deadline"
                            secondary={new Date(program.application_deadline).toLocaleDateString()}
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

                      {program.website_url && (
                        <Button
                          fullWidth
                          variant="outlined"
                          endIcon={<OpenInNew />}
                          onClick={() => window.open(program.website_url, '_blank')}
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

export default ProgramDetail;
