import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Routes, Route } from 'react-router-dom';

import { getTheme } from './theme';
import AppBar from './components/AppBar';
import Sidebar from './components/Sidebar';
import routes from './routes';
import Login from './pages/Login';

export const ThemeContext = React.createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

export default function App() {
  const [open, setOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('darkMode', String(!prev));
      return !prev;
    });
  };

  const theme = getTheme(darkMode ? 'dark' : 'light');

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={() => setIsAuthenticated(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar open={open} handleDrawerOpen={() => setOpen(true)} />
          <Sidebar open={open} handleDrawerClose={() => setOpen(false)} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              bgcolor: 'background.paper',
              minHeight: '100vh',
            }}
          >
            <DrawerHeader />
            <Routes>
              {routes.map((route) => (
                <Route key={route.key} path={route.route} element={route.element} />
              ))}
              <Route path="/" element={<div>Welcome to SOTAVI ERP</div>} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}