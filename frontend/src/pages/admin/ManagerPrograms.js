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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Edit, Delete, Add } from '@mui/icons-material';
import { programsAPI } from '../../services/api';

const ManagePrograms = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formData, setFormData] = useState({
    university_name: '',
    program_name: '',
    country: '',
    city: '',
    field_of_study: '',
    tuition_fee_usd: '',
    duration_months: '',
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const response = await programsAPI.getPrograms({ limit: 1000 });
      setPrograms(response.data);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setFormData({
      university_name: program.university_name,
      program_name: program.program_name,
      country: program.country,
      city: program.city,
      field_of_study: program.field_of_study,
      tuition_fee_usd: program.tuition_fee_usd,
      duration_months: program.duration_months,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await programsAPI.deleteProgram(id);
        loadPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (selectedProgram) {
        await programsAPI.updateProgram(selectedProgram.id, formData);
      } else {
        await programsAPI.createProgram(formData);
      }
      setOpenDialog(false);
      loadPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/admin')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Manage Programs
          </Typography>
          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => {
              setSelectedProgram(null);
              setFormData({
                university_name: '',
                program_name: '',
                country: '',
                city: '',
                field_of_study: '',
                tuition_fee_usd: '',
                duration_months: '',
              });
              setOpenDialog(true);
            }}
          >
            Add Program
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>University</TableCell>
                <TableCell>Program</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Field</TableCell>
                <TableCell>Tuition</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>{program.university_name}</TableCell>
                  <TableCell>{program.program_name}</TableCell>
                  <TableCell>
                    <Chip label={program.country} size="small" />
                  </TableCell>
                  <TableCell>{program.field_of_study}</TableCell>
                  <TableCell>${program.tuition_fee_usd?.toLocaleString()}</TableCell>
                  <TableCell>{program.duration_months} months</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(program)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(program.id)}>
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
        <DialogTitle>{selectedProgram ? 'Edit Program' : 'Add Program'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="University Name"
                value={formData.university_name}
                onChange={(e) => setFormData({ ...formData, university_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Program Name"
                value={formData.program_name}
                onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Field of Study"
                value={formData.field_of_study}
                onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tuition Fee (USD)"
                type="number"
                value={formData.tuition_fee_usd}
                onChange={(e) => setFormData({ ...formData, tuition_fee_usd: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (months)"
                type="number"
                value={formData.duration_months}
                onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
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

export default ManagePrograms;
