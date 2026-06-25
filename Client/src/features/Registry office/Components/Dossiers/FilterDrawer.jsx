import * as React from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function FilterDrawer({ open, onClose, onApply, currentFilters }) {
  const [filters, setFilters] = React.useState({
    dateDebut: null,
    dateFin: null,
    nom: '',
    assigneA: '',
    statut: '',
  });

  React.useEffect(() => {
    if (currentFilters) {
      setFilters({
        dateDebut: currentFilters.dateDebut || null,
        dateFin: currentFilters.dateFin || null,
        nom: currentFilters.nom || '',
        assigneA: currentFilters.assigneA || '',
        statut: currentFilters.statut || '',
      });
    }
  }, [currentFilters, open]);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateDebut: null,
      dateFin: null,
      nom: '',
      assigneA: '',
      statut: '',
    });
    onApply({});
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ width: { xs: '100vw', sm: 400 }, p: 3 }}>
          <Box sx={{ height: '64px' }}></Box>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterAltIcon sx={{ color: '#FFC107' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filtres avancés
              </Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: '#64748B' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {/* Champs de filtre */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Période de création */}
            <Typography variant="subtitle2" sx={{ color: '#1E293B', fontWeight: 600 }}>
              Période de création
            </Typography>
            <DatePicker
              label="Date début"
              value={filters.dateDebut}
              onChange={(newValue) => setFilters({ ...filters, dateDebut: newValue })}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
            <DatePicker
              label="Date fin"
              value={filters.dateFin}
              onChange={(newValue) => setFilters({ ...filters, dateFin: newValue })}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />

            {/* Nom du dossier */}
            <TextField
              label="Nom du dossier"
              fullWidth
              size="small"
              value={filters.nom}
              onChange={(e) => setFilters({ ...filters, nom: e.target.value })}
              placeholder="Rechercher par nom..."
            />

            {/* Assigné à */}
            <TextField
              label="Assigné à"
              fullWidth
              size="small"
              value={filters.assigneA}
              onChange={(e) => setFilters({ ...filters, assigneA: e.target.value })}
              placeholder="Nom de l'agent..."
            />

            {/* Statut */}
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={filters.statut}
                label="Statut"
                onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="En cours">En cours</MenuItem>
                <MenuItem value="Traité">Traité</MenuItem>
                <MenuItem value="En attente">En attente</MenuItem>
              </Select>
            </FormControl>

            {/* Filtres actifs */}
            {(filters.dateDebut || filters.dateFin || filters.nom || filters.assigneA || filters.statut) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Filtres actifs :
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {filters.nom && <Chip label={`Nom: ${filters.nom}`} size="small" />}
                  {filters.assigneA && <Chip label={`Assigné à: ${filters.assigneA}`} size="small" />}
                  {filters.statut && <Chip label={`Statut: ${filters.statut}`} size="small" />}
                  {filters.dateDebut && <Chip label={`À partir du ${dayjs(filters.dateDebut).format('DD/MM/YYYY')}`} size="small" />}
                  {filters.dateFin && <Chip label={`Jusqu'au ${dayjs(filters.dateFin).format('DD/MM/YYYY')}`} size="small" />}
                </Box>
              </Box>
            )}
          </Box>

          {/* Boutons actions */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ClearAllIcon />}
              onClick={handleReset}
              fullWidth
              sx={{
                borderColor: '#FFC107',
                color: '#FFC107',
                borderRadius: 40,
                '&:hover': { borderColor: '#FF8F00', bgcolor: '#FFF9E6' },
              }}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              onClick={handleApply}
              fullWidth
              sx={{
                bgcolor: '#FFC107',
                color: '#1A1A1A',
                borderRadius: 40,
                '&:hover': { bgcolor: '#FF8F00' },
              }}
            >
              Appliquer
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>
    </Drawer>
  );
}