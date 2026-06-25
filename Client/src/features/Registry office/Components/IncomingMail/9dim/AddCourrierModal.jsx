import React, { useState } from 'react';
import { Modal, Box, TextField, Button, MenuItem, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

export default function AddCourrierModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ expediteur: '', sujet: '', assigneA: '', statut: 'En cours' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Veuillez joindre le scan du courrier.");
      return;
    }
    setUploading(true);
    const newId = `CE-${Date.now()}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courrierId', newId);
    formData.append('expediteur', form.expediteur);
    // ... autres champs

    try {
      const res = await fetch('/api/upload-scan', { method: 'POST', body: formData });
      const { filePath } = await res.json();
      const newCourrier = {
        id: newId,
        date: new Date().toLocaleDateString('fr-FR'),
        ...form,
        scanUrl: filePath,
      };
      onAdd(newCourrier);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, width: 500 }}>
        <Typography variant="h6">Ajouter un courrier</Typography>
        <TextField label="Expéditeur" fullWidth margin="normal" value={form.expediteur} onChange={e => setForm({...form, expediteur: e.target.value})} />
        <TextField label="Sujet" fullWidth margin="normal" value={form.sujet} onChange={e => setForm({...form, sujet: e.target.value})} />
        <TextField label="Assigné à" fullWidth margin="normal" value={form.assigneA} onChange={e => setForm({...form, assigneA: e.target.value})} />
        <TextField select label="Statut" fullWidth margin="normal" value={form.statut} onChange={e => setForm({...form, statut: e.target.value})}>
          <MenuItem value="En cours">En cours</MenuItem>
          <MenuItem value="Traité">Traité</MenuItem>
          <MenuItem value="En attente">En attente</MenuItem>
        </TextField>
        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Télécharger le scan (PDF ou image)
          <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files[0])} />
        </Button>
        {file && <Typography variant="caption" sx={{ ml: 2 }}>{file.name}</Typography>}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button fullWidth variant="contained" onClick={handleSubmit} disabled={uploading}>
            {uploading ? "Upload en cours..." : "Ajouter"}
          </Button>
          <Button fullWidth variant="outlined" onClick={onClose}>Annuler</Button>
        </Box>
      </Box>
    </Modal>
  );
}