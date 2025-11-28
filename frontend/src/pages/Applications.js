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
  Grid,
  Alert,
  LinearProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  Assignment,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  Visibility,
} from '@mui/icons-material';
import { applicationsAPI } from '../services/api';

const MotionCard = motion(Card);

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, statusFilter]);

  const loadApplications = async () => {
    try {
      const response = await applicationsAPI.getMyApplications();
      setApplications(response.data);
      setFilteredApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (statusFilter) {
      setFilteredApplications(applications.filter((app) => app.status === statusFilter));
    } else {
      setFilteredApplications(applications);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return <CheckCircle color="success" />;
      case 'rejected':
        return <Cancel color="error" />;
      case 'pending':
        return <HourglassEmpty color="warning" />;
      default:
        return <Assignment />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Assignment sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Applications
          </Typography>
          <Chip label={`${applications.length} Total`} color="secondary" sx={{ fontWeight: 600 }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{ bgcolor: 'primary.main', color: 'white' }}
            >
              <CardContent>
                <Typography variant="h3" fontWeight={700}>
                  {stats.total}
                </Typography>
                <Typography variant="body1">Total Applications</Typography>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              sx={{ bgcolor: 'warning.main', color: 'white' }}
            >
              <CardContent>
                <Typography variant="h3" fontWeight={700}>
                  {stats.pending}
                </Typography>
                <Typography variant="body1">Pending</Typography>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              sx={{ bgcolor: 'success.main', color: 'white' }}
            >
              <CardContent>
                <Typography variant="h3" fontWeight={700}>
                  {stats.accepted}
                </Typography>
                <Typography variant="body1">Accepted</Typography>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              sx={{ bgcolor: 'error.main', color: 'white' }}
            >
              <CardContent>
                <Typography variant="h3" fontWeight={700}>
                  {stats.rejected}
                </Typography>
                <Typography variant="body1">Rejected</Typography>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Filter */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Filter by Status"
                >
                  <MenuItem value="">All Applications</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="outlined" onClick={() => setStatusFilter('')}>
                Clear Filter
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Applications Table */}
        {loading ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        ) : filteredApplications.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No applications found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Start applying to programs and scholarships to track your applications here.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button variant="contained" onClick={() => navigate('/programs')}>
                Browse Programs
              </Button>
              <Button variant="outlined" onClick={() => navigate('/scholarships')}>
                Browse Scholarships
              </Button>
            </Box>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Application ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Program/Scholarship</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied On</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id} hover>
                    <TableCell>#{app.id}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.program_id ? 'Program' : 'Scholarship'}
                        size="small"
                        color={app.program_id ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>
                      {app.program?.program_name || app.scholarship?.scholarship_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(app.status)}
                        label={app.status}
                        color={getStatusColor(app.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (app.program_id) {
                            navigate(`/programs/${app.program_id}`);
                          } else if (app.scholarship_id) {
                            navigate(`/scholarships/${app.scholarship_id}`);
                          }
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default Applications;
