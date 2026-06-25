import * as React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import AppBar from '../shared/components/AppBar'; // on va déplacer AppBar et Sidebar ensuite
import Sidebar from '../shared/components/Sidebar';

export default function MainLayout() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const toolbarHeight = theme.spacing(8); // 64px

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppBar
        open={open}
        handleDrawerOpen={() => setOpen(true)}
      />
      <Sidebar open={open} handleDrawerClose={() => setOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'background.paper',
          overflowY: 'auto',
          marginTop: toolbarHeight,
          height: `calc(100vh - ${toolbarHeight})`,
        }}
      >
        <Outlet /> {/* Ici s'afficheront les pages des routes enfants */}
      </Box>
    </Box>
  );
}