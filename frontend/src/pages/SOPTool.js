import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Tab,
  Tabs,
  AppBar,
  Toolbar,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  AutoAwesome,
  Assessment,
  ContentCopy,
  Download,
} from '@mui/icons-material';
import { sopAPI, programsAPI } from '../services/api';

const MotionCard = motion(Card);

const SOPTool = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Generate Tab
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [generatedSOP, setGeneratedSOP] = useState('');
  
  // Analyze Tab
  const [sopText, setSopText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  
  // My SOPs Tab
  const [mySops, setMySops] = useState([]);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedSOP, setSelectedSOP] = useState(null);
  
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPrograms();
    loadMySops();
  }, []);

  const loadPrograms = async () => {
    try {
      const response = await programsAPI.getPrograms({ limit: 100 });
      setPrograms(response.data);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const loadMySops = async () => {
    try {
      const response = await sopAPI.getSops();
      setMySops(response.data);
    } catch (error) {
      console.error('Error loading SOPs:', error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await sopAPI.generate({
        program_id: selectedProgram || null,
      });
      setGeneratedSOP(response.data.content);
      setMessage('✅ SOP generated successfully!');
      loadMySops();
    } catch (error) {
      setMessage('❌ Error generating SOP. Please complete your profile first.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!sopText.trim()) {
      setMessage('⚠️ Please enter your SOP text');
      return;
    }
    
    setLoading(true);
    setMessage('');
    try {
      const response = await sopAPI.analyze({ sop_text: sopText });
      setAnalysis(response.data);
      setMessage('✅ Analysis complete!');
      loadMySops();
    } catch (error) {
      setMessage('❌ Error analyzing SOP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setMessage('✅ Copied to clipboard!');
  };

  const handleDownload = (text, filename) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setMessage('✅ Downloaded successfully!');
  };

  const ScoreCard = ({ label, value, color }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" fontWeight={600}>{value}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        color={color}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'warning';
    return 'error';
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <AutoAwesome sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI SOP Tool
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {message && (
          <Alert 
            severity={message.includes('❌') ? 'error' : message.includes('⚠️') ? 'warning' : 'success'} 
            sx={{ mb: 3 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<AutoAwesome />} label="Generate SOP" />
            <Tab icon={<Assessment />} label="Analyze SOP" />
            <Tab label="My SOPs" />
          </Tabs>

          {/* Generate Tab */}
          {activeTab === 0 && (
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🤖 AI-Powered SOP Generator
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Our AI will create a personalized Statement of Purpose based on your profile
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Select Program (Optional)"
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value="">General Graduate Program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.program_name} - {program.university_name}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<AutoAwesome />}
                    onClick={handleGenerate}
                    disabled={loading}
                    sx={{ height: 56 }}
                  >
                    {loading ? 'Generating...' : 'Generate SOP'}
                  </Button>
                </Grid>
              </Grid>

              {generatedSOP && (
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  sx={{ mt: 3, bgcolor: 'background.paper' }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">Generated SOP</Typography>
                      <Box>
                        <IconButton onClick={() => handleCopy(generatedSOP)} size="small">
                          <ContentCopy />
                        </IconButton>
                        <IconButton onClick={() => handleDownload(generatedSOP, 'SOP')} size="small">
                          <Download />
                        </IconButton>
                      </Box>
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={15}
                      value={generatedSOP}
                      onChange={(e) => setGeneratedSOP(e.target.value)}
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Word Count: {generatedSOP.split(' ').length}
                    </Typography>
                  </CardContent>
                </MotionCard>
              )}
            </CardContent>
          )}

          {/* Analyze Tab */}
          {activeTab === 1 && (
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 SOP Analyzer
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Upload or paste your SOP to get detailed AI-powered feedback
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={12}
                placeholder="Paste your Statement of Purpose here..."
                value={sopText}
                onChange={(e) => setSopText(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Assessment />}
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze SOP'}
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                  Word Count: {sopText.split(' ').filter(w => w).length}
                </Typography>
              </Box>

              {loading && <CircularProgress />}

              {analysis && !loading && (
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  sx={{ mt: 3 }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Analysis Results
                    </Typography>

                    {/* Overall Score */}
                    <Box sx={{ textAlign: 'center', mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Typography variant="h3" fontWeight={700} color={getScoreColor(analysis.overall_score)}>
                        {analysis.overall_score}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Overall Score
                      </Typography>
                    </Box>

                    {/* Individual Scores */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <ScoreCard
                          label="Clarity"
                          value={analysis.clarity_score}
                          color={getScoreColor(analysis.clarity_score)}
                        />
                        <ScoreCard
                          label="Motivation"
                          value={analysis.motivation_score}
                          color={getScoreColor(analysis.motivation_score)}
                        />
                        <ScoreCard
                          label="Coherence"
                          value={analysis.coherence_score}
                          color={getScoreColor(analysis.coherence_score)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ScoreCard
                          label="Relevance"
                          value={analysis.relevance_score}
                          color={getScoreColor(analysis.relevance_score)}
                        />
                        <ScoreCard
                          label="Grammar"
                          value={analysis.grammar_score}
                          color={getScoreColor(analysis.grammar_score)}
                        />
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Chip label={`${analysis.word_count} words`} />
                          <Chip label={analysis.reading_level} color="primary" />
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Strengths */}
                    <Typography variant="h6" gutterBottom color="success.main">
                      ✅ Strengths
                    </Typography>
                    <List>
                      {analysis.strengths.map((strength, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={strength} />
                        </ListItem>
                      ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    {/* Weaknesses */}
                    <Typography variant="h6" gutterBottom color="error.main">
                      ⚠️ Areas for Improvement
                    </Typography>
                    <List>
                      {analysis.weaknesses.map((weakness, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={weakness} />
                        </ListItem>
                      ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    {/* Suggestions */}
                    <Typography variant="h6" gutterBottom color="primary.main">
                      💡 Suggestions
                    </Typography>
                    <List>
                      {analysis.suggestions.map((suggestion, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={suggestion} />
                        </ListItem>
                      ))}
                    </List>

                    {analysis.summary && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Alert severity="info">
                          <Typography variant="body2">
                            <strong>Summary:</strong> {analysis.summary}
                          </Typography>
                        </Alert>
                      </>
                    )}
                  </CardContent>
                </MotionCard>
              )}
            </CardContent>
          )}

          {/* My SOPs Tab */}
          {activeTab === 2 && (
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📚 My SOPs
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                View and manage your saved SOPs
              </Typography>

              {mySops.length === 0 ? (
                <Alert severity="info">
                  No SOPs yet. Generate or analyze one to get started!
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {mySops.map((sop) => (
                    <Grid item xs={12} md={6} key={sop.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {sop.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            {sop.is_generated && <Chip label="AI Generated" size="small" color="primary" />}
                            {sop.overall_score && (
                              <Chip label={`Score: ${sop.overall_score}%`} size="small" color="success" />
                            )}
                            <Chip label={`${sop.word_count} words`} size="small" />
                          </Box>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {sop.content.substring(0, 100)}...
                          </Typography>
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              onClick={() => {
                                setSelectedSOP(sop);
                                setViewDialog(true);
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              onClick={() => handleDownload(sop.content, sop.title)}
                            >
                              Download
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          )}
        </Card>
      </Container>

      {/* View SOP Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedSOP?.title}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={15}
            value={selectedSOP?.content || ''}
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCopy(selectedSOP?.content)}>Copy</Button>
          <Button onClick={() => handleDownload(selectedSOP?.content, selectedSOP?.title)}>Download</Button>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SOPTool;
