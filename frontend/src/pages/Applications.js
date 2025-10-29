import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import { applicationsAPI } from '../services/api';

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await applicationsAPI.getApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (app) => {
    setSelectedApp(app);
    setStatus(app.status);
    setNotes(app.notes || '');
    setEditDialog(true);
  };

  const handleUpdate = async () => {
    try {
      await applicationsAPI.updateApplication(selectedApp.id, { status, notes });
      alert('Application updated successfully!');
      setEditDialog(false);
      loadApplications();
    } catch (error) {
      alert('Error updating application: ' + error.response?.data?.detail);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationsAPI.deleteApplication(id);
        alert('Application deleted successfully!');
        loadApplications();
      } catch (error) {
        alert('Error deleting application: ' + error.response?.data?.detail);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      INTERESTED: 'default',
      APPLIED: 'primary',
      ACCEPTED: 'success',
      REJECTED: 'error',
      WITHDRAWN: 'warning',
    };
    return colors[status] || 'default';
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Applications
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {applications.length} Application(s)
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : applications.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No applications yet. Start by browsing programs!
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate('/programs')}
            >
              Browse Programs
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {applications.map((app) => (
              <Grid item xs={12} key={app.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Box flex={1}>
                        <Typography variant="h6">Program ID: {app.program_id}</Typography>
                        <Chip
                          label={app.status}
                          color={getStatusColor(app.status)}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                        {app.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Notes: {app.notes}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Created: {new Date(app.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton color="primary" onClick={() => handleEdit(app)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(app.id)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Application</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            margin="normal"
          >
            <MenuItem value="INTERESTED">Interested</MenuItem>
            <MenuItem value="APPLIED">Applied</MenuItem>
            <MenuItem value="ACCEPTED">Accepted</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
            <MenuItem value="WITHDRAWN">Withdrawn</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Applications;
