import * as React from 'react';
import { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Alert,
  Snackbar,
  Stack,
  Chip,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
  Paper,
  FormControlLabel,
  RadioGroup,
  Radio,
  Avatar,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import StorageIcon from '@mui/icons-material/Storage';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ThemeContext } from './../../../app/App';

export default function ApplicationSettings() {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  // États pour les préférences utilisateur (simulation)
  const [language, setLanguage] = useState('fr');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [notifications, setNotifications] = useState(true);
  const [notificationDuration, setNotificationDuration] = useState(3000);
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleResetDefaults = () => {
    setLanguage('fr');
    setDateFormat('DD/MM/YYYY');
    setNotifications(true);
    setNotificationDuration(3000);
    setReduceAnimations(false);
    setHighContrast(false);
    showNotification('Tous les paramètres ont été réinitialisés', 'info');
  };

  const handleExportSettings = () => {
    const settings = { language, dateFormat, notifications, notificationDuration, reduceAnimations, highContrast };
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'settings.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Paramètres exportés avec succès', 'success');
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target.result);
        setLanguage(settings.language || 'fr');
        setDateFormat(settings.dateFormat || 'DD/MM/YYYY');
        setNotifications(settings.notifications ?? true);
        setNotificationDuration(settings.notificationDuration || 3000);
        setReduceAnimations(settings.reduceAnimations || false);
        setHighContrast(settings.highContrast || false);
        showNotification('Paramètres importés avec succès', 'success');
      } catch {
        showNotification('Fichier invalide', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Section réutilisable
  const SettingCard = ({ title, icon, children }) => (
    <Card
      sx={{
        mb: 3,
        borderradius: 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
            {icon}
          </Avatar>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 800, mx: 'auto' }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* En-tête avec dégradé */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderradius: 1,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(
            theme.palette.primary.main,
            0.03
          )} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: theme.palette.text.primary }}>
          ⚙️ Paramètres
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Personnalisez votre expérience et l’apparence de l’application
        </Typography>
      </Paper>

      {/* Apparence */}
      <SettingCard title="Apparence" icon={darkMode ? <DarkModeIcon /> : <LightModeIcon />}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {darkMode ? <DarkModeIcon color="primary" /> : <LightModeIcon color="primary" />}
            <Box>
              <Typography fontWeight={500}>Mode sombre</Typography>
              <Typography variant="caption" color="text.secondary">
                {darkMode ? 'Thème sombre actif' : 'Thème clair actif'}
              </Typography>
            </Box>
          </Box>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: theme.palette.primary.main },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: theme.palette.primary.main },
            }}
          />
        </Stack>
      </SettingCard>

      {/* Langue et région */}
      <SettingCard title="Langue et région" icon={<LanguageIcon />}>
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="language-label">Langue</InputLabel>
            <Select
              labelId="language-label"
              value={language}
              label="Langue"
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ar">العربية</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="date-format-label">Format de date</InputLabel>
            <Select
              labelId="date-format-label"
              value={dateFormat}
              label="Format de date"
              onChange={(e) => setDateFormat(e.target.value)}
            >
              <MenuItem value="DD/MM/YYYY">DD/MM/YYYY (14/05/2026)</MenuItem>
              <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (05/14/2026)</MenuItem>
              <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (2026-05-14)</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </SettingCard>

      {/* Notifications */}
      <SettingCard title="Notifications" icon={<NotificationsActiveIcon />}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2">Activer les notifications</Typography>
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              color="primary"
            />
          </Stack>
          {notifications && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Durée d’affichage (secondes)
              </Typography>
              <Slider
                value={notificationDuration / 1000}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}s`}
                onChange={(_, val) => setNotificationDuration(val * 1000)}
                sx={{ color: theme.palette.primary.main }}
              />
            </Box>
          )}
        </Stack>
      </SettingCard>

      {/* Accessibilité */}
      <SettingCard title="Accessibilité" icon={<AccessibilityNewIcon />}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body2">Réduire les animations</Typography>
              <Typography variant="caption" color="text.secondary">
                Diminue les mouvements pour une meilleure accessibilité
              </Typography>
            </Box>
            <Switch
              checked={reduceAnimations}
              onChange={(e) => setReduceAnimations(e.target.checked)}
              color="primary"
            />
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body2">Contraste élevé</Typography>
              <Typography variant="caption" color="text.secondary">
                Améliore la lisibilité (experimental)
              </Typography>
            </Box>
            <Switch
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              color="primary"
            />
          </Stack>
        </Stack>
      </SettingCard>

      {/* Données & Sauvegarde */}
      <SettingCard title="Données et sauvegarde" icon={<StorageIcon />}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportSettings}
              size="small"
            >
              Exporter
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              component="label"
              size="small"
            >
              Importer
              <input type="file" hidden accept=".json" onChange={handleImportSettings} />
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<RestartAltIcon />}
              onClick={handleResetDefaults}
              size="small"
            >
              Réinitialiser
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Les paramètres sont sauvegardés dans votre navigateur.
          </Typography>
        </Stack>
      </SettingCard>

      {/* Badge de version */}
      <Box sx={{ textAlign: 'center', mt: 4, opacity: 0.6 }}>
        <Chip
          label="Version 2.0.0 – Dernière mise à jour mai 2026"
          size="small"
          variant="outlined"
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Box>
  );
}