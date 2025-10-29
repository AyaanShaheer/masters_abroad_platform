import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School,
  AccountBalance,
  Assignment,
  ExitToApp,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { programsAPI, scholarshipsAPI, applicationsAPI } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    programs: 0,
    scholarships: 0,
    applications: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [programsRes, scholarshipsRes, applicationsRes] = await Promise.all([
        programsAPI.getPrograms({ limit: 1000 }),
        scholarshipsAPI.getScholarships({ limit: 1000 }),
        applicationsAPI.getApplications(),
      ]);

      setStats({
        programs: programsRes.data.length,
        scholarships: scholarshipsRes.data.length,
        applications: applicationsRes.data.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={onClick}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color, fontSize: 60 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Masters Abroad Platform
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.full_name}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.full_name}!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Explore programs, scholarships, and track your applications.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Programs Available"
              value={stats.programs}
              icon={<School />}
              color="#1976d2"
              onClick={() => navigate('/programs')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Scholarships"
              value={stats.scholarships}
              icon={<AccountBalance />}
              color="#2e7d32"
              onClick={() => navigate('/scholarships')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="My Applications"
              value={stats.applications}
              icon={<Assignment />}
              color="#ed6c02"
              onClick={() => navigate('/applications')}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<School />}
                onClick={() => navigate('/programs')}
              >
                Browse Programs
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="success"
                startIcon={<AccountBalance />}
                onClick={() => navigate('/scholarships')}
              >
                View Scholarships
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Assignment />}
                onClick={() => navigate('/profile')}
              >
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
