// customerTheme.js
import { createTheme } from '@mui/material/styles';

const customerTheme = createTheme({
  palette: {
    primary: {
      main: '#e11d48', // Vibrant rose from the "Sign In" button
      contrastText: '#ffffff', // White text for better contrast
    },
    secondary: {
      main: '#f59e0b', // Amber from the gradient
      contrastText: '#ffffff',
    },
    background: {
      default: '#fff7ed', // Light amber background
      paper: '#ffffff', // White cards/surfaces
    },
    text: {
      primary: '#1f2937', // Dark gray for main text (like "Fresh Groceries")
      secondary: '#6b7280', // Medium gray for secondary text
    },
    success: {
      main: '#10b981', // For positive actions/status
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      color: '#1f2937', // Dark gray
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#1f2937',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#1f2937',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12, // Global border radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          borderRadius: '999px', // Pill-shaped buttons like in the image
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(to right, #e11d48, #f59e0b)', // Gradient like the "Sign In" button
          '&:hover': {
            background: 'linear-gradient(to right, #be123c, #d97706)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #e11d48, #f59e0b)',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
  },
});

export default customerTheme;