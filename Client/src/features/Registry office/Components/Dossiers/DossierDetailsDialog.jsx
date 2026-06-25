import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button,
  IconButton, Tooltip, Divider, Grid
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDossiers } from '../../../../core/contexts/DossierContext';

const StatusChip = ({ status }) => {
  const config = {
    'En cours': { color: '#ed6c02', bg: '#fff0e0' },
    'Traité': { color: '#2e7d32', bg: '#e8f5e9' },
    'En attente': { color: '#d32f2f', bg: '#fdecea' },
  };
  const { color, bg } = config[status] || config['En attente'];
  return <Chip label={status} sx={{ bgcolor: bg, color, fontWeight: 600, fontSize: '0.75rem' }} />;
};

export default function DossierDetailsDialog({ open, onClose, dossier }) {
  const { dossiers, removeCourrierFromDossier } = useDossiers();

  if (!dossier) return null;

  // On récupère la liste complète des courriers assignés (on aurait besoin d'un contexte partagé)
  // Pour l'instant on simule des données fixes
  const courriersAssocies = [
    { id: 'CE-2026-001', expediteur: 'Ministère Éducation', sujet: 'Rapport annuel' },
    { id: 'CS-2026-002', expediteur: 'Préfecture', sujet: 'Demande listes' },
  ];

  const handleRemove = (courrierId) => {
    if (window.confirm('Retirer ce courrier du dossier ?')) {
      removeCourrierFromDossier(dossier.id, courrierId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Détails du dossier : {dossier.nom}
        <IconButton sx={{ float: 'right' }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" fontWeight={700}>ID</Typography>
            <Typography variant="body2">{dossier.id}</Typography>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2 }}>Description</Typography>
            <Typography variant="body2">{dossier.description || 'Aucune'}</Typography>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2 }}>Assigné à</Typography>
            <Typography variant="body2">{dossier.assigneA}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" fontWeight={700}>Statut</Typography>
            <StatusChip status={dossier.statut} />
            <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2 }}>Date de création</Typography>
            <Typography variant="body2">{dossier.dateCreation}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Courriers associés ({courriersAssocies.length})</Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Expéditeur</TableCell>
                <TableCell>Sujet</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courriersAssocies.map(c => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.expediteur}</TableCell>
                  <TableCell>{c.sujet}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Retirer du dossier">
                      <IconButton size="small" onClick={() => handleRemove(c.id)}>
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}