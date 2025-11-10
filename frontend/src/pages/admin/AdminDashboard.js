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
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  School,
  AccountBalance,
  People,
  Settings,
  PlayArrow,
} from '@mui/icons-material';
import { programsAPI, scholarshipsAPI, scraperAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MotionCard = motion(Card);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    programs: 0,
    scholarships: 0,
    users: 0,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      const [programsRes, scholarshipsRes] = await Promise.all([
        programsAPI.getPrograms({ limit: 1000 }),
        scholarshipsAPI.getScholarships({ limit: 1000 }),
      ]);

      setStats({
        programs: programsRes.data.length,
        scholarships: scholarshipsRes.data.length,
        users: 150, // Mock data - you'd fetch from backend
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleTriggerScraping = async () => {
    setLoading(true);
    setMessage('');
    try {
      await scraperAPI.triggerScraping();
      setMessage('✅ Web scraping started! New scholarships will be added shortly.');
    } catch (error) {
      setMessage('❌ Error triggering scraping. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <MotionCard
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      sx={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </MotionCard>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Settings sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {message && (
          <Alert severity={message.includes('❌') ? 'error' : 'success'} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Programs"
              value={stats.programs}
              icon={<School sx={{ fontSize: 35 }} />}
              color="#1976d2"
              onClick={() => navigate('/admin/programs')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Scholarships"
              value={stats.scholarships}
              icon={<AccountBalance sx={{ fontSize: 35 }} />}
              color="#2e7d32"
              onClick={() => navigate('/admin/scholarships')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Users"
              value={stats.users}
              icon={<People sx={{ fontSize: 35 }} />}
              color="#ed6c02"
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/admin/programs')}
                >
                  Manage Programs
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={() => navigate('/admin/scholarships')}
                >
                  Manage Scholarships
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  startIcon={<PlayArrow />}
                  onClick={handleTriggerScraping}
                  disabled={loading}
                >
                  {loading ? 'Running...' : 'Run Web Scraper'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => window.open('http://localhost:8000/docs', '_blank')}
                >
                  API Docs
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Overview" />
            <Tab label="Recent Activity" />
            <Tab label="Settings" />
          </Tabs>

          <CardContent>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Platform Overview
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Welcome to the admin dashboard. Here you can manage all aspects of the Masters Abroad Platform.
                </Typography>
                <Alert severity="info" sx={{ mt: 2 }}>
                  💡 The web scraper runs automatically every day at 9 AM. You can also trigger it manually.
                </Alert>
              </Box>
            )}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 15 new users registered today
                  <br />
                  • 8 new programs added this week
                  <br />
                  • 12 scholarship applications submitted
                </Typography>
              </Box>
            )}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Platform configuration and settings will be available here.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default AdminDashboard;
