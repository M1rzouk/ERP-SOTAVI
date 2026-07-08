import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import menuConfig from './../../config/menuConfig';
import { useAuth } from './../../core/contexts/AuthContext';

const drawerWidth = 330;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 12px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 12px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      backgroundColor: theme.palette.background.default,
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': {
            ...openedMixin(theme),
            backgroundColor: theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': {
            ...closedMixin(theme),
            backgroundColor: theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        },
      },
    ],
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// ─── Filtrage des éléments du menu par rôle ────────────────────────────────
// ─── Filtrage des éléments du menu par rôle ────────────────────────────────
const filterMenuByRoles = (items, userRoles) => {
  // ✅ SI L'UTILISATEUR EST ADMINISTRATEUR → IL VOIT TOUT
  if (userRoles && userRoles.includes('Administrateur')) {
    return items; // Retourne tous les éléments sans filtrage
  }

  // Sinon, on applique le filtrage normal pour les autres rôles
  if (!userRoles || userRoles.length === 0) {
    // Si l'utilisateur n'a pas encore de rôles, on affiche uniquement les éléments "All"
    return items.filter(item => item.UserRole && item.UserRole.includes('All'));
  }

  return items.filter(item => {
    if (!item.UserRole) return false;
    // Si l'élément est accessible à tous
    if (item.UserRole.includes('All')) return true;
    // Vérifie si l'un des rôles de l'utilisateur est dans la liste des rôles autorisés
    return item.UserRole.some(role => userRoles.includes(role));
  });
};

export default function Sidebar({ open, handleDrawerClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  // Rôles de l'utilisateur (tableau de noms, ex: ["Administrateur", "Chef de Centre"])
  const userRoles = user?.roles || [];

  // Récupérer tous les éléments de type 'collapse'
  const allMenuItems = menuConfig.filter(route => route.type === 'collapse');

  // Filtrer les éléments accessibles selon les rôles
  const accessibleItems = filterMenuByRoles(allMenuItems, userRoles);

  // Séparer "Paramètres" du reste
  const settingsItem = accessibleItems.find(item => item.key === 'Paramètres');
  const topMenuItems = accessibleItems.filter(item => item.key !== 'Paramètres');

  // ─── Données utilisateur ──────────────────────────────────────────────────
  const fullName = user?.full_name || user?.name || 'Utilisateur';
  const username = user?.username || '';
  const email = user?.email || '';
  const avatarSrc = user?.pdp || null;
  const isOnline = true; // ou user?.is_connected

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // ─── Styles ──────────────────────────────────────────────────────────────
  const getListItemButtonSx = (isOpen) => [
    {
      minHeight: 48,
      px: 2.5,
      py: 0,
      borderRadius: 1,
      mx: 1,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: alpha('#FFC107', 0.12),
        transform: 'translateX(4px)',
      },
      '&.active': {
        backgroundColor: alpha('#FFC107', 0.15),
        '& .MuiListItemIcon-root': { color: '#FF8F00' },
        '& .MuiListItemText-primary': {
          fontWeight: 700,
          color: theme.palette.text.primary,
        },
      },
    },
    isOpen ? { justifyContent: 'initial' } : { justifyContent: 'center' },
  ];

  const getListItemIconSx = (isOpen) => [
    {
      minWidth: 0,
      justifyContent: 'center',
      color: '#FFC107',
      transition: 'all 0.2s ease',
    },
    isOpen ? { mr: 3 } : { mr: 'auto' },
  ];

  const getListItemTextSx = (isOpen) => ({
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 0.2s ease',
    '& .MuiTypography-root': {
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
  });

  // ─── Contenu du drawer ────────────────────────────────────────────────────
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose} sx={{ color: '#FFC107' }}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>

      {/* Menu principal (sans paramètres) */}
      <List sx={{ px: 1, pt: 2 }}>
        {topMenuItems.map((item) => (
          <ListItem key={item.key} disablePadding sx={{ display: 'block', mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.route}
              sx={getListItemButtonSx(open)}
            >
              <ListItemIcon sx={getListItemIconSx(open)}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} sx={getListItemTextSx(open)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Paramètres (toujours en bas) */}
      <List sx={{ px: 1, pb: 1, mt: 1 }}>
        {settingsItem && (
          <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={settingsItem.route}
              sx={getListItemButtonSx(open)}
            >
              <ListItemIcon sx={getListItemIconSx(open)}>{settingsItem.icon}</ListItemIcon>
              <ListItemText primary={settingsItem.name} sx={getListItemTextSx(open)} />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      {/* Profil utilisateur (affiché seulement si la sidebar est ouverte) */}
      {open && (
        <>
          <Divider />
          <List sx={{ px: 1, pb: 2, mt: 1 }}>
            <ListItem disablePadding sx={{ display: 'block', mb: 1 }}>
              <ListItemButton
                component={NavLink}
                to="/profile"
                sx={getListItemButtonSx(open)}
              >
                <ListItemIcon sx={getListItemIconSx(open)}>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: '#FFC107',
                      color: '#1A1A1A',
                      fontSize: '1.1rem',
                    }}
                    src={avatarSrc || undefined}
                    alt={fullName}
                  >
                    {!avatarSrc && getInitials(fullName)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={username || fullName}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: isOnline ? '#22c55e' : '#ef4444',
                          display: 'inline-block',
                        }}
                      />
                      <Typography variant="caption" sx={{ color: isOnline ? '#22c55e' : '#ef4444' }}>
                        {isOnline ? 'En ligne' : 'Hors ligne'}
                      </Typography>
                    </Box>
                  }
                  sx={getListItemTextSx(open)}
                  secondaryTypographyProps={{
                    style: { fontSize: '0.7rem', color: isOnline ? '#10B981' : '#ef4444' },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  // Mobile: temporary overlay drawer
  if (isMobile) {
    return (
      <MuiDrawer
        variant="temporary"
        open={open}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: theme.palette.background.default,
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </MuiDrawer>
    );
  }

  // Desktop: permanent mini-variant drawer
  return (
    <Drawer variant="permanent" open={open}>
      {drawerContent}
    </Drawer>
  );
}