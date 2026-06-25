import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode, // 'light' | 'dark'
    primary: {
      main: '#FFC107',
      contrastText: '#1A1A1A',
    },
    secondary: {
      main: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    },
    background: {
      // On aligne default sur la couleur utilisée par l'AppBar et le Drawer
      default: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
      paper:   mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    },
    text: {
      primary:   mode === 'dark' ? '#F1F5F9' : '#1E293B',
      secondary: mode === 'dark' ? '#94A3B8' : '#64748B',
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 600 },
    subtitle2: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 40, fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0,0,0,0.02), 0px 1px 2px rgba(0,0,0,0.05)',
          border: mode === 'dark' ? '1px solid #2D2D2D' : '1px solid #F1F5F9',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // On utilise la même couleur que background.default
          backgroundColor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
          borderBottom: mode === 'dark' ? '1px solid #2D2D2D' : '1px solid #F1F5F9',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
          borderRight: mode === 'dark' ? '1px solid #2D2D2D' : '1px solid #F1F5F9',
        },
      },
    },
  },
});