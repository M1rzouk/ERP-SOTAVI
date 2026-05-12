// components/SearchBar.jsx - Fixed version
import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EggIcon from '@mui/icons-material/Egg';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';

// Enhanced search data with categories and icons
const searchData = [
  { title: "eggs", category: "Ingredients", icon: <EggIcon />, trending: true },
  { title: "egg recipes", category: "Recipes", icon: <RestaurantIcon />, trending: true },
  { title: "how to boil eggs", category: "Tutorials", icon: <FastfoodIcon />, trending: false },
  { title: "eggs for breakfast", category: "Meals", icon: <LocalDiningIcon />, trending: true },
  { title: "egg salad", category: "Recipes", icon: <RestaurantIcon />, trending: false },
  { title: "chicken", category: "Ingredients", icon: <LocalDiningIcon />, trending: true },
  { title: "chicken biryani", category: "Recipes", icon: <RestaurantIcon />, trending: true },
  { title: "chicken curry", category: "Recipes", icon: <RestaurantIcon />, trending: false },
  { title: "pasta", category: "Ingredients", icon: <FastfoodIcon />, trending: true },
  { title: "pasta recipes", category: "Recipes", icon: <RestaurantIcon />, trending: true },
  { title: "pasta carbonara", category: "Recipes", icon: <RestaurantIcon />, trending: false },
  { title: "pomodoro sauce", category: "Recipes", icon: <RestaurantIcon />, trending: false },
  { title: "healthy meals", category: "Meals", icon: <LocalDiningIcon />, trending: true },
  { title: "vegan recipes", category: "Recipes", icon: <RestaurantIcon />, trending: true },
  { title: "quick dinner ideas", category: "Ideas", icon: <FastfoodIcon />, trending: false },
  { title: "SOTAVI ERP", category: "System", icon: <DashboardIcon />, trending: true },
  { title: "dashboard", category: "System", icon: <DashboardIcon />, trending: false },
  { title: "reports", category: "System", icon: <AssessmentIcon />, trending: false },
  { title: "inventory", category: "System", icon: <InventoryIcon />, trending: true },
];

// Styled Paper for results
const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(1),
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)',
  backdropFilter: 'blur(10px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.98),
  border: '1px solid rgba(255, 193, 7, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 25px 40px -12px rgba(0,0,0,0.2)',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateX(5px)',
    '& .MuiListItemAvatar-root': {
      transform: 'scale(1.1)',
    },
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.dark,
  fontSize: '0.7rem',
  height: '24px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const Search = styled('div')(({ theme, $fullWidth }) => ({
  position: 'relative',
  borderRadius: '40px',
  backgroundColor: alpha(theme.palette.primary.main, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.25) },
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: $fullWidth ? '100%' : 'auto',
  maxWidth: 'none',
  flex: 1,
  transition: theme.transitions.create(['width', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  left: 0,
  top: 0,
  color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontWeight: 500,
    fontSize: '0.95rem',
    '&::placeholder': {
      color: alpha('#1A1A1A', 0.5),
      fontWeight: 400,
    },
  },
}));

export default function SearchBar({ variant, onSearch, onClose, autoFocus }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchValue, setSearchValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Ingredients': return <EggIcon fontSize="small" />;
      case 'Recipes': return <RestaurantIcon fontSize="small" />;
      case 'System': return <DashboardIcon fontSize="small" />;
      case 'Tutorials': return <FastfoodIcon fontSize="small" />;
      case 'Meals': return <LocalDiningIcon fontSize="small" />;
      default: return <SearchIcon fontSize="small" />;
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim()) {
      const filtered = searchData
        .filter(item => item.title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 7);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (query = null) => {
    const term = query !== null ? query : searchValue;
    if (term.trim() && onSearch) {
      onSearch(term);
    }
    setSearchValue('');
    setSuggestions([]);
    setAnchorEl(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  const handleClose = () => {
    setSearchValue('');
    setSuggestions([]);
    setAnchorEl(null);
    if (onClose) {
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion.title);
    handleSearchSubmit(suggestion.title);
  };

  const open = Boolean(anchorEl) && suggestions.length > 0;

  // Desktop: always show full search bar with dropdown
  if (variant === 'desktop') {
    return (
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <Box
          sx={{
            position: 'relative',
            flex: 1,
            maxWidth: {
              sm: '400px',  // small screens
              md: '500px',  // medium screens
              lg: '800px',  // large screens
            },
            minWidth: '300px',
          }}
        >
          <Search>
            <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
            <StyledInputBase
              inputRef={inputRef}
              placeholder="Search for recipes, ingredients, or system features..."
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={(e) => setAnchorEl(e.currentTarget.parentElement)}
            />
          </Search>

          <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            style={{
              zIndex: 1300,
              width: anchorEl?.clientWidth,
              maxWidth: '800px',
            }}
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
            ]}
          >
            <StyledPaper elevation={3}>
              <Box sx={{
                px: 2,
                py: 1.5,
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
              }}>
                <TrendingUpIcon sx={{ fontSize: '1rem', color: theme.palette.primary.main }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary, letterSpacing: '0.5px' }}>
                  TRENDING RESULTS
                </Typography>
              </Box>

              <List dense sx={{ py: 0 }}>
                {suggestions.map((sug, idx) => (
                  <React.Fragment key={idx}>
                    <StyledListItem
                      button
                      onClick={() => handleSuggestionClick(sug)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.dark,
                          width: 36,
                          height: 36,
                          transition: 'transform 0.2s',
                        }}>
                          {sug.icon || getIconForCategory(sug.category)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                              {sug.title}
                            </Typography>
                            {sug.trending && (
                              <Chip
                                label="Trending"
                                size="small"
                                icon={<TrendingUpIcon sx={{ fontSize: '0.8rem' }} />}
                                sx={{
                                  height: '20px',
                                  fontSize: '0.65rem',
                                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                  color: theme.palette.primary.dark,
                                  '& .MuiChip-icon': { fontSize: '0.8rem' }
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            {getIconForCategory(sug.category)}
                            <span>{sug.category}</span>
                          </Typography>
                        }
                      />
                      <CategoryChip
                        label={sug.category}
                        size="small"
                      />
                    </StyledListItem>
                    {idx < suggestions.length - 1 && <Divider sx={{ my: 0, opacity: 0.5 }} />}
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{
                px: 2,
                py: 1.5,
                borderTop: '1px solid rgba(0,0,0,0.05)',
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }} />
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Recent searches will appear here
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 600, cursor: 'pointer' }}>
                  Advanced Search →
                </Typography>
              </Box>
            </StyledPaper>
          </Popper>
        </Box>
      </ClickAwayListener>
    );
  }

  // Mobile: show search bar with close button (no internal toggle)
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Search $fullWidth sx={{ flex: 1, marginLeft: 0, display: 'flex', alignItems: 'center' }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          inputRef={inputRef}
          placeholder="Search…"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={(e) => setAnchorEl(e.currentTarget.parentElement)}
          sx={{ flex: 1 }}
        />
        <IconButton
          onClick={handleClose}  // ← This now calls onClose from AppBar
          sx={{ color: theme.palette.primary.main, mr: 0.5, p: 0.5 }}
        >
          <CloseIcon />
        </IconButton>
      </Search>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300, width: anchorEl?.clientWidth }}
      >
        <StyledPaper elevation={3}>
          <List dense>
            {suggestions.map((sug, idx) => (
              <StyledListItem
                button
                key={idx}
                onClick={() => handleSuggestionClick(sug)}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.dark }}>
                    {sug.icon || getIconForCategory(sug.category)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={sug.title}
                  secondary={sug.category}
                />
              </StyledListItem>
            ))}
          </List>
        </StyledPaper>
      </Popper>
    </Box>
  );
}