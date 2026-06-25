import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select, MenuItem,
  Chip, Box, Typography, Snackbar, Alert
} from '@mui/material';
import { useDossiers } from '../../../../core/contexts/DossierContext';

export default function AssignToDossierDialog({ open, onClose, courrierId, courrierRef }) {
  const { dossiers, assignCourrierToDossier } = useDossiers();
  const [selectedDossierId, setSelectedDossierId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAssign = () => {
    if (!selectedDossierId) {
      setSnackbar({ open: true, message: 'Veuillez sélectionner un dossier', severity: 'error' });
      return;
    }
    assignCourrierToDossier(selectedDossierId, courrierId);
    setSnackbar({ open: true, message: 'Courrier assigné au dossier', severity: 'success' });
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assigner au dossier</DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>Courrier : {courrierRef}</Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Choisir un dossier</InputLabel>
          <Select value={selectedDossierId} onChange={(e) => setSelectedDossierId(e.target.value)}>
            {dossiers.map(d => (
              <MenuItem key={d.id} value={d.id}>
                {d.nom} ({d.id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedDossierId && (
          <Box sx={{ mt: 2 }}>
            <Chip label="Dossier sélectionné" color="primary" />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleAssign} sx={{ bgcolor: '#FFC107', color: '#1A1A1A' }}>
          Assigner
        </Button>
      </DialogActions>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Dialog>
  );
}