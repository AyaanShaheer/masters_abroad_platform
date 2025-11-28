import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Edit, Delete, Add } from '@mui/icons-material';
import { scholarshipsAPI } from '../../services/api';

const ManageScholarships = () => {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    scholarship_name: '',
    provider: '',
    country: '',
    amount_usd: '',
    coverage_type: '',
    eligible_countries: '',
    applicable_programs: '',
    min_gpa: '',
    description: '',
    requirements: '',
    website_url: '',
    application_deadline: '',
  });

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    try {
      const response = await scholarshipsAPI.getScholarships({ limit: 1000 });
      setScholarships(response.data);
    } catch (error) {
      console.error('Error loading scholarships:', error);
      setMessage('Error loading scholarships');
    }
  };

  const handleEdit = (scholarship) => {
    setSelectedScholarship(scholarship);
    setFormData({
      scholarship_name: scholarship.scholarship_name,
      provider: scholarship.provider,
      country: scholarship.country,
      amount_usd: scholarship.amount_usd,
      coverage_type: scholarship.coverage_type,
      eligible_countries: scholarship.eligible_countries?.join(', ') || '',
      applicable_programs: scholarship.applicable_programs?.join(', ') || '',
      min_gpa: scholarship.min_gpa || '',
      description: scholarship.description || '',
      requirements: scholarship.requirements || '',
      website_url: scholarship.website_url || '',
      application_deadline: scholarship.application_deadline || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      try {
        await scholarshipsAPI.deleteScholarship(id);
        setMessage('✅ Scholarship deleted successfully');
        loadScholarships();
      } catch (error) {
        console.error('Error deleting scholarship:', error);
        setMessage('❌ Error deleting scholarship');
      }
    }
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        amount_usd: parseFloat(formData.amount_usd),
        min_gpa: formData.min_gpa ? parseFloat(formData.min_gpa) : null,
        eligible_countries: formData.eligible_countries
          ? formData.eligible_countries.split(',').map((s) => s.trim())
          : [],
        applicable_programs: formData.applicable_programs
          ? formData.applicable_programs.split(',').map((s) => s.trim())
          : [],
      };

      if (selectedScholarship) {
        await scholarshipsAPI.updateScholarship(selectedScholarship.id, data);
        setMessage('✅ Scholarship updated successfully');
      } else {
        await scholarshipsAPI.createScholarship(data);
        setMessage('✅ Scholarship created successfully');
      }
      setOpenDialog(false);
      loadScholarships();
    } catch (error) {
      console.error('Error saving scholarship:', error);
      setMessage('❌ Error saving scholarship');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/admin')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Manage Scholarships
          </Typography>
          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => {
              setSelectedScholarship(null);
              setFormData({
                scholarship_name: '',
                provider: '',
                country: '',
                amount_usd: '',
                coverage_type: '',
                eligible_countries: '',
                applicable_programs: '',
                min_gpa: '',
                description: '',
                requirements: '',
                website_url: '',
                application_deadline: '',
              });
              setOpenDialog(true);
            }}
          >
            Add Scholarship
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {message && (
          <Alert
            severity={message.includes('❌') ? 'error' : 'success'}
            sx={{ mb: 2 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Scholarship Name</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Coverage</TableCell>
                <TableCell>Min GPA</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scholarships.map((scholarship) => (
                <TableRow key={scholarship.id}>
                  <TableCell>{scholarship.scholarship_name}</TableCell>
                  <TableCell>{scholarship.provider}</TableCell>
                  <TableCell>
                    <Chip label={scholarship.country} size="small" />
                  </TableCell>
                  <TableCell>${scholarship.amount_usd?.toLocaleString()}</TableCell>
                  <TableCell>{scholarship.coverage_type}</TableCell>
                  <TableCell>{scholarship.min_gpa || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(scholarship)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(scholarship.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Edit/Add Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedScholarship ? 'Edit Scholarship' : 'Add Scholarship'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Scholarship Name"
                name="scholarship_name"
                value={formData.scholarship_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount (USD)"
                name="amount_usd"
                type="number"
                value={formData.amount_usd}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coverage Type"
                name="coverage_type"
                value={formData.coverage_type}
                onChange={handleChange}
                placeholder="e.g., Full Tuition, Partial"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Min GPA"
                name="min_gpa"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.min_gpa}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Eligible Countries"
                name="eligible_countries"
                value={formData.eligible_countries}
                onChange={handleChange}
                helperText="Comma-separated"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Applicable Programs"
                name="applicable_programs"
                value={formData.applicable_programs}
                onChange={handleChange}
                helperText="Comma-separated"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirements"
                name="requirements"
                multiline
                rows={2}
                value={formData.requirements}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website URL"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Application Deadline"
                name="application_deadline"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.application_deadline}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageScholarships;
