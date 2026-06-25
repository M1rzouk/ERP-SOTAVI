import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  Skeleton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  History as HistoryIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import hwasPdp from './../../../assets/pdps/hwas.png'; // adjust path as needed

// Mock data – replace with API calls
const userData = {
  firstName: 'Marzouk',
  lastName: 'Houssem Eddin',
  email: 'houssem.marzouk.x@sotavi.com',
  phone: '+216 98 765 432',
  location: 'Tunis, Tunisia',
  position: 'Senior ERP Developper',
  department: 'IT Department',
  joinDate: 'Mars 2026',
  lastActive: '2 minutes ago',
  bio: 'Passionate about ERP optimization and helping businesses streamline their operations.',
  stats: {
    projects: 24,
    tasks: 138,
    satisfaction: 98,
  },
  recentActivity: [
    { id: 1, action: 'Updated inventory settings', time: '2 hours ago', icon: <CheckCircleIcon fontSize="small" /> },
    { id: 2, action: 'Generated monthly report', time: 'Yesterday', icon: <HistoryIcon fontSize="small" /> },
    { id: 3, action: 'Changed password', time: '3 days ago', icon: <LockIcon fontSize="small" /> },
  ],
};

export default function Profile() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header with gradient background */}
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            borderRadius: 1,
            overflow: 'hidden',
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white',
          }}
        >
          <Box sx={{ p: { xs: 3, md: 5 }, position: 'relative', zIndex: 2 }}>
            <Grid container spacing={3} alignItems="center" sx={{ display: 'flex', gap: 2}}>
              <Grid item>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'grey.100' },
                        boxShadow: 2,
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    src={hwasPdp}
                    alt="Profile"
                    sx={{
                      width: { xs: 80, md: 120 },
                      height: { xs: 80, md: 120 },
                      border: '4px solid white',
                      boxShadow: 3,
                    }}
                  />
                </Badge>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" fontWeight={700}>
                  {userData.firstName} {userData.lastName}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 1 }}>
                  {userData.position} • {userData.department}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 1 }}>
                  {userData.bio}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<WorkIcon />}
                    label={`Joined ${userData.joinDate}`}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    icon={<HistoryIcon />}
                    label={`Last active ${userData.lastActive}`}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* Decorative wave */}

        </Paper>

      </Container>
    </Box>
  );
}