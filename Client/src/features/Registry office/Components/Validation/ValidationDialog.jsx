import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, Chip, Divider
} from '@mui/material';

export default function ValidationDialog({ open, onClose, courrier, onConfirm }) {
  const [comment, setComment] = useState('');
  const [decision, setDecision] = useState(null); // true = valider, false = refuser

  const handleConfirm = () => {
    if (decision === null) return;
    onConfirm(courrier.id, decision, comment);
    setComment('');
    setDecision(null);
  };

  const handleClose = () => {
    setComment('');
    setDecision(null);
    onClose();
  };

  if (!courrier) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Validation du courrier</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" fontWeight={700}>ID</Typography>
        <Typography variant="body2">{courrier.id}</Typography>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2 }}>Sujet</Typography>
        <Typography variant="body2">{courrier.sujet}</Typography>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2 }}>Assigné à</Typography>
        <Typography variant="body2">{courrier.assigneA}</Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant={decision === true ? 'contained' : 'outlined'}
            color="success"
            onClick={() => setDecision(true)}
            sx={{ flex: 1, borderRadius: 40 }}
          >
            Valider
          </Button>
          <Button
            variant={decision === false ? 'contained' : 'outlined'}
            color="error"
            onClick={() => setDecision(false)}
            sx={{ flex: 1, borderRadius: 40 }}
          >
            Refuser
          </Button>
        </Box>
        {decision !== null && (
          <TextField
            fullWidth
            label="Commentaire (optionnel)"
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajoutez un commentaire pour justifier votre décision..."
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={decision === null}
          sx={{ bgcolor: '#FFC107', color: '#1A1A1A', '&:hover': { bgcolor: '#FF8F00' } }}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
}