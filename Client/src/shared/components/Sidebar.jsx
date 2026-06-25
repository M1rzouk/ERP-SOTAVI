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
import { NavLink } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import menuConfig from './../../config/menuConfig';
import hwasPdp from './../../assets/pdps/hwas.png';

const drawerWidth = 300;

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

const menuItems = menuConfig.filter((route) => route.type === 'collapse');

export default function Sidebar({ open, handleDrawerClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 1. Séparer l'élément "paramètres" du reste
  const settingsItem = menuItems.find(item => item.key === 'Paramètres');
  const topMenuItems = menuItems.filter(item => item.key !== 'Paramètres');

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

      {/* Pousse les éléments suivants vers le bas */}
      <Box sx={{ flexGrow: 1 }} />
      
      {/* Paramètres (toujours visible, même fermé) */}
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
              <ListItemButton sx={getListItemButtonSx(open)}>
                <ListItemIcon sx={getListItemIconSx(open)}>
                  <Avatar sx={{ width: 50, height: 50, bgcolor: '#FFC107', color: '#1A1A1A' }}>
                    <img src={hwasPdp} alt="" width={50} height={50} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary="MARZOUK"
                  secondary="Admin • Online"
                  sx={getListItemTextSx(open)}
                  secondaryTypographyProps={{
                    style: { fontSize: '0.7rem', color: '#10B981' },
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