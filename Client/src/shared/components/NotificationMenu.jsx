// src/components/Layout/NotificationMenu.jsx
import * as React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Menu,
  Divider,
  Button,
  Stack,
  Avatar,
  alpha,
  useTheme,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// ----------------------------------------------------------------------
// Example notification structure
// ----------------------------------------------------------------------
const initialNotifications = [
  {
    id: '1',
    title: 'Nouvelle commande #1234',
    message: 'Une nouvelle commande a été passée par Client SARL.',
    timestamp: 'Il y a 5 minutes',
    read: false,
    avatar: null,
    type: 'order',
  },
  {
    id: '2',
    title: 'Stock critique',
    message: 'Le produit "Écran 24" atteint son seuil minimum.',
    timestamp: 'Il y a 1 heure',
    read: false,
    avatar: null,
    type: 'alert',
  },
  {
    id: '3',
    title: 'Rapport mensuel prêt',
    message: 'Le rapport de mars 2025 est disponible au téléchargement.',
    timestamp: 'Hier à 14:32',
    read: true,
    avatar: null,
    type: 'report',
  },
  {
    id: '4',
    title: 'Invitation réunion',
    message: 'Réunion stratégique le 15 avril à 10h00.',
    timestamp: 'Il y a 2 jours',
    read: true,
    avatar: null,
    type: 'meeting',
  },
  {
    id: '4',
    title: 'Invitation réunion',
    message: 'Réunion stratégique le 15 avril à 10h00.',
    timestamp: 'Il y a 2 jours',
    read: true,
    avatar: null,
    type: 'meeting',
  },
  {
    id: '4',
    title: 'Invitation réunion',
    message: 'Réunion stratégique le 15 avril à 10h00.',
    timestamp: 'Il y a 2 jours',
    read: true,
    avatar: null,
    type: 'meeting',
  },
];

// ----------------------------------------------------------------------
// Single notification item
// ----------------------------------------------------------------------
function NotificationItem({ notification, onMarkAsRead }) {
  const theme = useTheme();
  const isUnread = !notification.read;

  const handleClick = () => {
    if (isUnread) onMarkAsRead(notification.id);
    // Optionally navigate or trigger an action
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        gap: 1.5,
        px: 2,
        py: 1.5,
        cursor: 'pointer',
        transition: 'background 0.15s ease',
        bgcolor: isUnread
          ? alpha(theme.palette.primary.main, 0.04)
          : 'transparent',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
        },
      }}
    >
      {/* Icon / Avatar placeholder */}
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: isUnread
            ? alpha(theme.palette.primary.main, 0.12)
            : alpha(theme.palette.text.disabled, 0.08),
          color: isUnread ? theme.palette.primary.main : 'text.secondary',
        }}
      >
        <NotificationsIcon fontSize="small" />
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography
            variant="body2"
            fontWeight={isUnread ? 600 : 400}
            noWrap
            sx={{ maxWidth: 180 }}
          >
            {notification.title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', ml: 1 }}>
            {notification.timestamp}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          display="block"
          sx={{
            color: 'text.secondary',
            mt: 0.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {notification.message}
        </Typography>
        {isUnread && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <FiberManualRecordIcon sx={{ fontSize: 8, color: theme.palette.primary.main }} />
            <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
              Non lu
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Main Notification Menu Component
// ----------------------------------------------------------------------
export default function NotificationMenu() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState(initialNotifications);

  const open = Boolean(anchorEl);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: 'text.secondary',
          '&:hover': { color: theme.palette.primary.main },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 600,
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: "400px",
            maxWidth: 'calc(100vw - 24px)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            pt: 1,
            pb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography fontWeight={600} fontSize="0.95rem">
            Notifications
            {unreadCount > 0 && (
              <Typography component="span" sx={{ ml: 1, fontSize: '0.75rem', color: 'text.disabled' }}>
                ({unreadCount} non lue{unreadCount > 1 ? 's' : ''})
              </Typography>
            )}
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Action buttons */}
        {notifications.length > 0 && (
          <Box
            sx={{
              px: 2,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: alpha(theme.palette.action.hover, 0.4),
            }}
          >
            <Button
              size="small"
              startIcon={<DoneAllIcon fontSize="small" />}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Tout lire
            </Button>
            <Button
              size="small"
              startIcon={<DeleteSweepIcon fontSize="small" />}
              onClick={clearAll}
              disabled={notifications.length === 0}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Effacer tout
            </Button>
          </Box>
        )}

        {/* Notification list */}
        <Box sx={{ maxHeight: 270, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Aucune notification
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <NotificationItem notification={notification} onMarkAsRead={markAsRead} />
                <Divider sx={{ my: 0 }} />
              </React.Fragment>
            ))
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.action.hover, 0.3),
          }}
        >
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center' }}>
            Dernières notifications • SOTAVI ERP
          </Typography>
        </Box>
      </Menu>
    </>
  );
}