import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import SotaviLogo from './../assets/images/logos/SotaviLogo.png';
import SearchBar from './SearchBar';
import hwasPdp from './../assets/pdps/hwas.png';

const drawerWidth = 260;

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

export default function AppBar({ open, handleDrawerOpen, onSearch }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchActive, setSearchActive] = React.useState(false);

  const activateSearch = () => setSearchActive(true);
  const deactivateSearch = () => setSearchActive(false);

  const handleSearch = (searchTerm) => {
    if (onSearch) onSearch(searchTerm);
    deactivateSearch();
  };

  return (
    <AppBarStyled position="fixed" open={open}>
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, maxWidth: '100%', width: '100%', backgroundColor: theme.palette.background.default }}>

        {/* Left: Menu + Logo */}
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

        {/* Desktop Search */}
        {!isMobile && (
          <SearchBar variant="desktop" onSearch={handleSearch} />
        )}

        {/* Mobile Search */}
        {isMobile && searchActive && (
          <SearchBar
            variant="mobile"
            onSearch={handleSearch}
            onClose={deactivateSearch}
            autoFocus
          />
        )}

        {/* Right: Actions */}
        {(!isMobile || !searchActive) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            {isMobile && !searchActive && (
              <IconButton onClick={activateSearch} sx={{ color: theme.palette.primary.main }}>
                <SearchIcon />
              </IconButton>
            )}

            <Badge
              badgeContent={9}
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                  mx: 1.5,
                  my: 1.5,
                },
              }}
            >
              <IconButton sx={{ color: 'text.secondary', '&:hover': { color: '#FFC107' } }}>
                <NotificationsIcon />
              </IconButton>
            </Badge>

            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 50,
                height: 50,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' },
                ml: 1.5,
              }}
            >
              <img src={hwasPdp} alt="" width={50} height={50} />
            </Avatar>
          </Box>
        )}
      </Toolbar>
    </AppBarStyled>
  );
}