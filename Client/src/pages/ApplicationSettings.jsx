import * as React from 'react';
import { useContext } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ThemeContext } from '../App';

export default function ApplicationSettings() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Application Settings
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Appearance
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {darkMode
                ? <DarkModeIcon sx={{ color: '#FFC107' }} />
                : <LightModeIcon sx={{ color: '#FFC107' }} />
              }
              <Box>
                <Typography variant="body1" fontWeight={500}>Dark Mode</Typography>
                <Typography variant="body2" color="text.secondary">
                  {darkMode ? 'Dark theme is active' : 'Light theme is active'}
                </Typography>
              </Box>
            </Box>

            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#FFC107',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#FFC107',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}