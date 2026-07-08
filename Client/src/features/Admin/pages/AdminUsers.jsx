import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  InputBase,
  alpha,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Tooltip,
  CircularProgress,
  Switch,
  FormControlLabel,
  OutlinedInput,
  Menu,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Search as SearchIcon,
  GetApp as GetAppIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { getRoles, createUser, getUsers, updateUser, deleteUser } from './../../../services/adminService';
import { useAuth } from './../../../core/contexts/AuthContext';
import { exportToPDF, exportToExcel } from '../../Registry office/Components/IncomingMail/ExportUtils';

// ==================== STYLED COMPONENTS (SOTAVI) ====================
const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha('#FFC107', 0.3)}`,
  borderRadius: 40,
  padding: '4px 8px',
  transition: theme.transitions.create('width'),
  '&:hover': {
    borderColor: '#FFC107',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  overflowX: 'auto',
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const statusConfig = {
    true: { bg: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.dark },
    false: { bg: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.dark },
  };
  const { bg, color } = statusConfig[status] || statusConfig.true;
  return {
    backgroundColor: bg,
    color,
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 28,
    borderRadius: 40,
  };
});

// ==================== COMPOSANT PRINCIPAL ====================
export default function AdminUsers() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  // États
  const [users, setUsers] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dialogues
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Export menu
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);

  // Formulaire
  const [formData, setFormData] = useState({
    matricule: '',
    email: '',
    full_name: '',
    password: '',
    roles: [],
    is_active: true,
  });

  const hasPermission = user?.permissions?.includes('manage_users');

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Chargement
  useEffect(() => {
    if (!hasPermission) return;
    loadData();
  }, [hasPermission]);

  const loadData = async () => {
    setLoadingUsers(true);
    setError('');
    try {
      const [roles, usersData] = await Promise.all([getRoles(), getUsers()]);
      setRolesList(roles || []);
      setUsers(usersData || []);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('❌ Erreur loadData:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Filtrage
  const filteredUsers = users.filter((u) => {
    const search = searchTerm.toLowerCase();
    return (
      u.matricule?.toLowerCase().includes(search) ||
      u.full_name?.toLowerCase().includes(search) ||
      u.email?.toLowerCase().includes(search)
    );
  });

  // Statistiques
  const stats = {
    total: users.length,
    actifs: users.filter((u) => u.is_active).length,
    inactifs: users.filter((u) => !u.is_active).length,
  };

  // Gestion des dialogues
  const handleOpenCreate = () => {
    setFormData({
      matricule: '',
      email: '',
      full_name: '',
      password: '',
      roles: [],
      is_active: true,
    });
    setOpenCreateDialog(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      matricule: user.matricule,
      email: user.email,
      full_name: user.full_name,
      password: '',
      roles: user.roles ? user.roles.map((r) => r.id) : [],
      is_active: user.is_active,
    });
    setOpenEditDialog(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenCreateDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedUser(null);
    setError('');
    setSuccess('');
  };

  // Handlers formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, is_active: e.target.checked }));
  };

  const handleRolesChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      roles: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // CRUD
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (formData.roles.length === 0) {
        setError('Veuillez sélectionner au moins un rôle');
        setLoading(false);
        return;
      }
      const newUser = await createUser(formData);
      showNotification(`✅ Utilisateur ${newUser.full_name} créé avec succès !`, 'success');
      await loadData();
      handleCloseDialogs();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
      showNotification(err.message || 'Erreur lors de la création', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (formData.roles.length === 0) {
        setError('Veuillez sélectionner au moins un rôle');
        setLoading(false);
        return;
      }
      const updateData = {
        email: formData.email,
        full_name: formData.full_name,
        roles: formData.roles,
        is_active: formData.is_active,
      };
      if (formData.password && formData.password.length >= 6) {
        updateData.password = formData.password;
      }
      const updatedUser = await updateUser(selectedUser.id, updateData);
      showNotification(`✅ Utilisateur ${updatedUser.full_name} mis à jour !`, 'success');
      await loadData();
      handleCloseDialogs();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      showNotification(err.message || 'Erreur lors de la mise à jour', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteUser(selectedUser.id);
      showNotification(`✅ Utilisateur ${selectedUser.full_name} désactivé !`, 'success');
      await loadData();
      handleCloseDialogs();
    } catch (err) {
      setError(err.message || 'Erreur lors de la désactivation');
      showNotification(err.message || 'Erreur lors de la désactivation', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Export
  const handleExportClick = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportPDF = () => {
    const exportData = filteredUsers.map((u) => ({
      Matricule: u.matricule,
      'Nom complet': u.full_name,
      Email: u.email,
      Rôles: u.roles ? u.roles.join(', ') : '',
      Statut: u.is_active ? 'Actif' : 'Inactif',
    }));
    exportToPDF(exportData, 'Utilisateurs');
    showNotification('Export PDF généré avec succès !', 'success');
    handleExportClose();
  };

  const handleExportExcel = () => {
    const exportData = filteredUsers.map((u) => ({
      Matricule: u.matricule,
      'Nom complet': u.full_name,
      Email: u.email,
      Rôles: u.roles ? u.roles.join(', ') : '',
      Statut: u.is_active ? 'Actif' : 'Inactif',
    }));
    exportToExcel(exportData, 'Utilisateurs');
    showNotification('Export Excel généré avec succès !', 'success');
    handleExportClose();
  };

  // Accès refusé
  if (!hasPermission) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Card sx={{ maxWidth: 500, mx: 'auto', p: 4 }}>
          <AdminPanelSettingsIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            Accès refusé
          </Typography>
          <Typography color="text.secondary">
            Vous n'avez pas les droits nécessaires pour gérer les utilisateurs.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Permission requise : manage_users
          </Typography>
        </Card>
      </Box>
    );
  }

  if (loadingUsers) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: '#FFC107' }} />
        <Typography sx={{ ml: 2 }}>Chargement des utilisateurs...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* HEADER */}
      <PageHeader>
        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
          Gestion des utilisateurs
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Gestion des comptes utilisateurs – Service IT
          </Typography>
          <Chip
            label={`${filteredUsers.length} utilisateurs`}
            sx={{ bgcolor: alpha('#FFC107', 0.1), color: '#FFC107', fontWeight: 600 }}
          />
        </Box>
      </PageHeader>

      {/* STATS CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 4 }}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Total</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                {stats.total}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Actifs</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.dark }}>
                {stats.actifs}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Inactifs</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.dark }}>
                {stats.inactifs}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* SEARCH + ACTIONS */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 3, gap: 2 }}>
        <SearchContainer sx={{ width: isMobile ? '100%' : 350 }}>
          <SearchIcon sx={{ color: '#FFC107' }} />
          <InputBase
            placeholder="Rechercher (matricule, nom, email...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ ml: 1, flex: 1 }}
          />
        </SearchContainer>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            sx={{
              borderColor: '#FFC107',
              color: '#FFC107',
              borderRadius: 40,
              textTransform: 'none',
              '&:hover': { borderColor: '#FFC107', bgcolor: '#FFF9E6' },
            }}
          >
            Rafraîchir
          </Button>
          <Button
            variant="contained"
            startIcon={<GetAppIcon />}
            onClick={handleExportClick}
            sx={{
              bgcolor: '#FFC107',
              color: '#1A1A1A',
              borderRadius: 40,
              textTransform: 'none',
              '&:hover': { bgcolor: '#FF8F00' },
            }}
          >
            Exporter
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenCreate}
            sx={{
              bgcolor: '#FFC107',
              color: '#1A1A1A',
              borderRadius: 40,
              textTransform: 'none',
              '&:hover': { bgcolor: '#FF8F00' },
            }}
          >
            Nouvel utilisateur
          </Button>
        </Box>
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={handleExportClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleExportPDF}>
          <PdfIcon sx={{ mr: 1, color: '#FFC107' }} />
          Exporter en PDF
        </MenuItem>
        <MenuItem onClick={handleExportExcel}>
          <ExcelIcon sx={{ mr: 1, color: '#FFC107' }} />
          Exporter en Excel
        </MenuItem>
      </Menu>

      {/* TABLEAU */}
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
              <TableCell sx={{ fontWeight: 700 }}>Matricule</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nom complet</TableCell>
              {!isMobile && <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>}
              <TableCell sx={{ fontWeight: 700 }}>Rôles</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Aucun utilisateur trouvé</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => (
                <TableRow key={u.id} sx={{ '&:hover': { bgcolor: alpha('#FFC107', 0.05) } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{u.matricule}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#FFC107', color: '#1A1A1A', fontSize: '0.8rem' }}>
                        {u.full_name?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="body2">{u.full_name}</Typography>
                    </Box>
                  </TableCell>
                  {!isMobile && <TableCell>{u.email}</TableCell>}
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {u.roles && u.roles.map((role, idx) => (
                        <Chip
                          key={idx}
                          label={role}
                          size="small"
                          sx={{
                            bgcolor: alpha('#FFC107', 0.15),
                            color: '#1A1A1A',
                            fontWeight: 500,
                            borderRadius: 40,
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      label={u.is_active ? 'Actif' : 'Inactif'}
                      status={String(u.is_active)}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Modifier">
                      <IconButton size="small" onClick={() => handleOpenEdit(u)}>
                        <EditIcon fontSize="small" sx={{ color: '#FFC107' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Désactiver">
                      <IconButton size="small" onClick={() => handleOpenDelete(u)}>
                        <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* ============================================================ */}
      {/* DIALOGUE CRÉATION */}
      {/* ============================================================ */}
      <Dialog open={openCreateDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon sx={{ color: '#FFC107' }} />
            <Typography variant="h6">Créer un nouvel utilisateur</Typography>
          </Box>
        </DialogTitle>
        <form onSubmit={handleCreateUser}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Matricule *"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  size="small"
                  sx={{
                    '& .MuiInputLabel-root': { color: '#1A1A1A' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#FFC107' },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFC107',
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Nom complet *"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Mot de passe *"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  helperText="Minimum 6 caractères"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small" disabled={loading}>
                  <InputLabel id="create-roles-label">Rôles *</InputLabel>
                  <Select
                    labelId="create-roles-label"
                    multiple
                    value={formData.roles}
                    onChange={handleRolesChange}
                    input={<OutlinedInput label="Rôles *" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((roleId) => {
                          const role = rolesList.find((r) => r.id === roleId);
                          return (
                            <Chip
                              key={roleId}
                              label={role ? role.name : roleId}
                              size="small"
                              sx={{ bgcolor: alpha('#FFC107', 0.15), borderRadius: 40 }}
                            />
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 200, width: 250 } },
                      // Fermer après sélection (comportement normal du Select multiple)
                      // On n'ajoute pas de prop spéciale, le comportement par défaut est correct
                    }}
                  >
                    {rolesList.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialogs} disabled={loading}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#FFC107',
                color: '#1A1A1A',
                '&:hover': { bgcolor: '#FF8F00' },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ============================================================ */}
      {/* DIALOGUE MODIFICATION */}
      {/* ============================================================ */}
      <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon sx={{ color: '#FFC107' }} />
            <Typography variant="h6">Modifier l'utilisateur</Typography>
          </Box>
        </DialogTitle>
        <form onSubmit={handleUpdateUser}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Matricule"
                  value={formData.matricule}
                  disabled
                  size="small"
                  helperText="Le matricule ne peut pas être modifié"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Nom complet *"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Nouveau mot de passe"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  helperText="Laisser vide pour conserver le mot de passe actuel"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small" disabled={loading}>
                  <InputLabel id="edit-roles-label">Rôles *</InputLabel>
                  <Select
                    labelId="edit-roles-label"
                    multiple
                    value={formData.roles}
                    onChange={handleRolesChange}
                    input={<OutlinedInput label="Rôles *" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((roleId) => {
                          const role = rolesList.find((r) => r.id === roleId);
                          return (
                            <Chip
                              key={roleId}
                              label={role ? role.name : roleId}
                              size="small"
                              sx={{ bgcolor: alpha('#FFC107', 0.15), borderRadius: 40 }}
                            />
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 200, width: 250 } },
                    }}
                  >
                    {rolesList.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={handleSwitchChange}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#FFC107',
                          '&:hover': { bgcolor: alpha('#FFC107', 0.1) },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#FFC107',
                        },
                      }}
                    />
                  }
                  label={formData.is_active ? 'Compte actif' : 'Compte inactif'}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialogs} disabled={loading}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#FFC107',
                color: '#1A1A1A',
                '&:hover': { bgcolor: '#FF8F00' },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Enregistrer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ============================================================ */}
      {/* DIALOGUE SUPPRESSION */}
      {/* ============================================================ */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialogs} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h6" color="error">
            Confirmer la désactivation
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir désactiver l'utilisateur{' '}
            <strong>{selectedUser?.full_name}</strong> ({selectedUser?.matricule}) ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cette action peut être annulée en réactivant le compte.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialogs} disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Désactiver'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}