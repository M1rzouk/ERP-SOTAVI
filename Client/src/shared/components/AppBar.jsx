import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import SotaviLogo from './../../assets/images/logos/SotaviLogo.png';
import SearchBar from './SearchBar';
import hwasPdp from './../../assets/pdps/hwas.png';
import NotificationMenu from './../../shared/components/NotificationMenu';
import { useAuth } from './../../core/contexts/AuthContext';
const drawerWidth = 300;

const AppBarStyled = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box
      component="img"
      src={SotaviLogo}
      alt="SOTAVI"
      sx={{ height: 32, width: 'auto' }}
    />
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        background: 'linear-gradient(135deg, #FFC107, #FF8F00)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        letterSpacing: '-0.5px',
        display: { xs: 'none', sm: 'none', md: 'block' },
      }}
    >
      SOTAVI ERP
    </Typography>
  </Box>
);

// ─── Reusable menu item row ───────────────────────────────────────────────────

function ProfileMenuItem({ icon, label, description, onClick, danger = false }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 1,
        py: 1,
        mx: 1,
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
        background: hovered
          ? danger
            ? 'rgba(239,68,68,0.05)'
            : 'rgba(255,193,7,0.06)'
          : 'transparent',
      }}
    >
      {/* Icon wrap */}
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: '9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.15s ease',
          background: hovered
            ? danger
              ? 'rgba(239,68,68,0.08)'
              : 'rgba(255,193,7,0.1)'
            : 'rgba(0,0,0,0.04)',
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            fontSize: 18,
            color: hovered
              ? danger
                ? '#ef4444'
                : '#FFC107'
              : 'text.secondary',
            transition: 'color 0.15s ease',
          },
        })}
      </Box>

      {/* Text */}
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontSize: 13.5,
            fontWeight: 500,
            color: hovered ? (danger ? '#ef4444' : 'text.primary') : 'text.primary',
            lineHeight: 1.3,
            transition: 'color 0.15s ease',
          }}
        >
          {label}
        </Typography>
        {description && (
          <Typography sx={{ fontSize: 11, color: 'text.disabled', fontWeight: 300, mt: '1px' }}>
            {description}
          </Typography>
        )}
      </Box>

      {/* Arrow (not on danger) */}
      {!danger && (
        <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
      )}
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppBar({ open, handleDrawerOpen, onSearch }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchActive, setSearchActive] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const activateSearch = () => setSearchActive(true);
  const deactivateSearch = () => setSearchActive(false);
  const handleSearch = (searchTerm) => { if (onSearch) onSearch(searchTerm); deactivateSearch(); };
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfile = () => { navigate('/profile'); handleMenuClose(); };
  const handleSettings = () => { navigate('/paramètres'); handleMenuClose(); };
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();      // this calls authService.logout() and clears user
    handleMenuClose();
  };

  return (
    <AppBarStyled position="fixed" open={open}>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          gap: 2,
          maxWidth: '100%',
          width: '100%',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Left */}
        {(!isMobile || !searchActive) && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Box sx={{ width: open ? 0 : 60, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, color: theme.palette.primary.main, display: open ? 'none' : 'flex' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Logo />
          </Box>
        )}

        {!isMobile && <SearchBar variant="desktop" onSearch={handleSearch} />}
        {isMobile && searchActive && (
          <SearchBar variant="mobile" onSearch={handleSearch} onClose={deactivateSearch} autoFocus />
        )}

        {/* Right */}
        {(!isMobile || !searchActive) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            {isMobile && !searchActive && (
              <IconButton onClick={activateSearch} sx={{ color: theme.palette.primary.main }}>
                <SearchIcon />
              </IconButton>
            )}

            <NotificationMenu />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                bgcolor: "#FFC107",
                border: '2px solid rgba(255,193,7,0.4)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.0)', bgcolor: '#f7a945' },
                borderRadius: 2,
                p: 0,
                pt: 0,
                pb: 0,
              }}
              onClick={handleMenuOpen}
            >

              <Typography sx={{ fontWeight: 550, color: "black", pl: 1.5 }}>
                Houssem
              </Typography>
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                }}
                src={hwasPdp}
                alt="profile"
              />
            </Box>

            {/* ── Profile Menu ── */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  width: 260,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                  '&::before': { /* your arrow styles */ },
                  // Force remove padding from the inner list
                  '& .MuiMenu-list': {
                    paddingTop: '0 !important',
                    paddingBottom: '0 !important',
                  },
                },
              }}
            >
              {/* your content remains the same */}




              {/* ── Header ── */}
              <Box
                sx={{
                  px: 2.5,
                  pb: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  // ambient glow top-right


                }}
              >
                {/* Avatar + name row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      border: '2px solid rgba(255,193,7,0.55)',
                      flexShrink: 0,
                    }}
                  >
                    <img src={hwasPdp} alt="profile" width={48} height={48} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14.5, color: '#fff', lineHeight: 1.3 }}>
                      Marzouk Houssem Eddine
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: 'rgba(255,255,255,0.42)', fontWeight: 300, mt: '1px' }}>
                      houssem.marzouk.x@sotavi.com
                    </Typography>
                  </Box>
                </Box>


              </Box>

              <Divider />

              {/* ── Menu items ── */}
              <Box sx={{ py: 1 }}>
                <ProfileMenuItem
                  icon={<PersonIcon />}
                  label="Mon profil"
                  description="Informations personnelles"
                  onClick={handleProfile}
                />
                <ProfileMenuItem
                  icon={<SettingsIcon />}
                  label="Paramètres"
                  description="Préférences du compte"
                  onClick={handleSettings}
                />
              </Box>

              <Divider />

              {/* ── Logout ── */}
              <Box sx={{ py: 1 }}>
                <ProfileMenuItem
                  icon={<LogoutIcon />}
                  label="Déconnexion"
                  onClick={handleLogout}
                  danger
                />
              </Box>

              {/* ── Footer ── */}
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'action.hover',
                }}
              >
                <Typography sx={{ fontSize: 10.5, color: 'text.disabled', fontWeight: 300 }}>
                  SOTAVI ERP v4.2.1
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <FiberManualRecordIcon sx={{ fontSize: 8, color: '#22c55e' }} />
                  <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>En ligne</Typography>
                </Box>
              </Box>

            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBarStyled>
  );
}
