import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { getRoles, createUser } from './../../../services/adminService';
import { useAuth } from './../../../core/contexts/AuthContext';

// Composant pour la sélection multiple des rôles
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AdminUsers() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    matricule: '',
    email: '',
    full_name: '',
    password: '',
    roles: []
  });
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Vérifier que l'utilisateur a la permission manage_users
  const hasPermission = user?.permissions?.includes('manage_users');

  useEffect(() => {
    if (!hasPermission) return;
    const fetchRoles = async () => {
      try {
        const roles = await getRoles();
        setRolesList(roles);
      } catch (err) {
        setError('Impossible de charger la liste des rôles');
      }
    };
    fetchRoles();
  }, [hasPermission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRolesChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, roles: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Vérifier que des rôles sont sélectionnés
      if (formData.roles.length === 0) {
        setError('Veuillez sélectionner au moins un rôle');
        setLoading(false);
        return;
      }

      const newUser = await createUser(formData);
      setSuccess(`Utilisateur ${newUser.full_name} (${newUser.matricule}) créé avec succès !`);
      // Réinitialiser le formulaire
      setFormData({
        matricule: '',
        email: '',
        full_name: '',
        password: '',
        roles: []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Accès refusé
        </Typography>
        <Typography>Vous n'avez pas les droits pour gérer les utilisateurs.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Créer un nouvel utilisateur
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Matricule"
            name="matricule"
            value={formData.matricule}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Nom complet"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            helperText="Minimum 6 caractères"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="roles-label">Rôles</InputLabel>
            <Select
              labelId="roles-label"
              id="roles"
              multiple
              value={formData.roles}
              onChange={handleRolesChange}
              input={<OutlinedInput label="Rôles" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((roleId) => {
                    const role = rolesList.find(r => r.id === roleId);
                    return <Chip key={roleId} label={role ? role.name : roleId} size="small" />;
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {rolesList.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, py: 1.5, backgroundColor: '#FFC107', color: '#1A1A1A',
                  '&:hover': { backgroundColor: '#FFB300' } }}
          >
            {loading ? <CircularProgress size={24} /> : 'Créer l’utilisateur'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}