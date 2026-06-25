import './../shared/styles/globalScrollbar.css';
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './../shared/theme/theme';
import { useThemeMode } from './../core/hooks/useThemeMode';
import AppRoutes from './AppRoutes';
import Login from './../features/auth/pages/Login';
import LoadingFallback from './../shared/components/LoadingFallback';
import { AuthProvider, useAuth } from './../core/contexts/AuthContext';
import { DossierProvider } from './../core/contexts/DossierContext'; // ✅ IMPORT DOSSIER PROVIDER
import { useIdleTimeout } from './../core/hooks/useIdleTimeout';

export const ThemeContext = React.createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

function AuthenticatedApp() {
  const { darkMode, toggleDarkMode } = useThemeMode();
  const theme = getTheme(darkMode ? 'dark' : 'light');
  const { isAuthenticated, loading, logout } = useAuth();

  // Auto-logout after 10 minutes
  useIdleTimeout(600000, () => {
    console.log('Idle timeout: logging out');
    logout();
  });

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingFallback />
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login />
      </ThemeProvider>
    );
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DossierProvider>
        <AuthenticatedApp />
      </DossierProvider>
    </AuthProvider>
  );
}