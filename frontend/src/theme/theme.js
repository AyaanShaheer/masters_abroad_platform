import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#90caf9' : '#1976d2',
      light: mode === 'dark' ? '#b3d9ff' : '#42a5f5',
      dark: mode === 'dark' ? '#6aa3d9' : '#1565c0',
    },
    secondary: {
      main: mode === 'dark' ? '#f48fb1' : '#dc004e',
    },
    background: {
      default: mode === 'dark' ? '#0a1929' : '#f5f5f5',
      paper: mode === 'dark' ? '#1a2027' : '#ffffff',
    },
    success: {
      main: mode === 'dark' ? '#66bb6a' : '#2e7d32',
    },
    warning: {
      main: mode === 'dark' ? '#ffa726' : '#ed6c02',
    },
    error: {
      main: mode === 'dark' ? '#f44336' : '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
    },
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'dark' 
            ? '0 4px 12px rgba(0, 0, 0, 0.5)' 
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});
