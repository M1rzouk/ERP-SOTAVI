import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Snackbar, Alert
} from '@mui/material';
import { useDossiers } from '../../../../core/contexts/DossierContext';

const assignees = ['Ahmed Benali', 'Fatima Zahra', 'Mohamed Larbi', 'Kamel Meksi'];

export default function CreateDossierDialog({ open, onClose }) {
  const { createDossier } = useDossiers();
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [assigneA, setAssigneA] = useState(assignees[0]);
  const [statut, setStatut] = useState('En cours');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = () => {
    if (!nom.trim()) {
      setSnackbar({ open: true, message: 'Le nom est obligatoire', severity: 'error' });
      return;
    }
    createDossier({ nom, description, assigneA, statut });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setNom('');
    setDescription('');
    setAssigneA(assignees[0]);
    setStatut('En cours');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nouveau dossier</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nom du dossier"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Assigné à</InputLabel>
          <Select value={assigneA} onChange={(e) => setAssigneA(e.target.value)}>
            {assignees.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Statut</InputLabel>
          <Select value={statut} onChange={(e) => setStatut(e.target.value)}>
            <MenuItem value="En cours">En cours</MenuItem>
            <MenuItem value="Traité">Traité</MenuItem>
            <MenuItem value="En attente">En attente</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#FFC107', color: '#1A1A1A' }}>
          Créer
        </Button>
      </DialogActions>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Dialog>
  );
}