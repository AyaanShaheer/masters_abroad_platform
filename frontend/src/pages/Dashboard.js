import React, { useState, useEffect } from 'react';
import { Notifications } from '@mui/icons-material';
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
  Fab,
  Avatar,
  LinearProgress,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  School,
  AccountBalance,
  Assignment,
  ExitToApp,
  Chat as ChatIcon,
  TrendingUp,
  Brightness4,
  Brightness7,
  Person,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { programsAPI, scholarshipsAPI, applicationsAPI } from '../services/api';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    programs: 0,
    scholarships: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Chart data
  const pieData = [
    { name: 'Programs', value: stats.programs, color: '#1976d2' },
    { name: 'Scholarships', value: stats.scholarships, color: '#2e7d32' },
    { name: 'Applications', value: stats.applications, color: '#ed6c02' },
  ];

  const barData = [
    { name: 'USA', programs: 45, scholarships: 20 },
    { name: 'Canada', programs: 30, scholarships: 15 },
    { name: 'UK', programs: 25, scholarships: 12 },
    { name: 'Australia', programs: 20, scholarships: 10 },
  ];

  const StatCard = ({ title, value, icon, color, onClick, delay }) => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
      sx={{ cursor: 'pointer', height: '100%' }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
              {loading ? '...' : value}
            </Typography>
            <Chip
              label="View All"
              size="small"
              sx={{ mt: 1 }}
              color="primary"
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              width: 80,
              height: 80,
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Masters Abroad Platform
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }}>
              <Person />
            </Avatar>
            <Typography variant="body1">{user?.full_name}</Typography>
          </Box>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 4,
              p: 4,
              mb: 4,
              color: 'white',
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Welcome back, {user?.full_name}! 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Track your progress and discover new opportunities for your Masters journey
            </Typography>
          </Box>
        </MotionBox>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Programs Available"
              value={stats.programs}
              icon={<School sx={{ fontSize: 40 }} />}
              color="#1976d2"
              onClick={() => navigate('/programs')}
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Scholarships"
              value={stats.scholarships}
              icon={<AccountBalance sx={{ fontSize: 40 }} />}
              color="#2e7d32"
              onClick={() => navigate('/scholarships')}
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="My Applications"
              value={stats.applications}
              icon={<Assignment sx={{ fontSize: 40 }} />}
              color="#ed6c02"
              onClick={() => navigate('/applications')}
              delay={0.3}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Overview Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  {pieData.map((item) => (
                    <Box key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: item.color,
                          mr: 1,
                        }}
                      />
                      <Typography variant="caption">{item.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Popular Destinations
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="programs" fill="#1976d2" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="scholarships" fill="#2e7d32" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<School />}
                  onClick={() => navigate('/programs')}
                  sx={{ py: 1.5 }}
                >
                  Browse Programs
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<AccountBalance />}
                  onClick={() => navigate('/scholarships')}
                  sx={{ py: 1.5 }}
                >
                  Scholarships
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  startIcon={<TrendingUp />}
                  onClick={() => navigate('/recommendations')}
                  sx={{ py: 1.5 }}
                >
                  AI Recommendations
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Person />}
                  onClick={() => navigate('/profile')}
                  sx={{ py: 1.5 }}
                >
                  Update Profile
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="info"
                  startIcon={<Notifications />}
                  onClick={() => navigate('/alerts')}
                  sx={{ py: 1.5 }}
                >
                  Scholarship Alerts
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </MotionCard>

        {/* Application Progress */}
        {stats.applications > 0 && (
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            sx={{ mt: 3 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Your Application Progress
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Profile Completion</Typography>
                  <Typography variant="body2" fontWeight={600}>75%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </CardContent>
          </MotionCard>
        )}
      </Container>

      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <Fab
          color="secondary"
          aria-label="chat"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 64,
            height: 64,
          }}
          onClick={() => navigate('/chat')}
        >
          <ChatIcon sx={{ fontSize: 32 }} />
        </Fab>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
