import React, { useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Tooltip, alpha, useTheme, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, MenuItem, Select, FormControl,
    InputLabel, Snackbar, Alert, Tabs, Tab, InputBase
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Add as AddIcon,
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { useDossiers } from './../../../../core/contexts/DossierContext';
import CreateDossierDialog from './../../Components/Dossiers/CreateDossierDialog';
import DossierDetailsDialog from './../../Components/Dossiers/DossierDetailsDialog';
import FilterDrawer from '../../Components/Dossiers/FilterDrawer';
// ==================== STYLED COMPONENTS ====================
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
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    borderRadius: 40,
    padding: '4px 8px',
    transition: theme.transitions.create('width'),
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

const StatusChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== 'status',
})(({ theme, status }) => {
    const statusConfig = {
        'En cours': { bg: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.dark },
        'Traité': { bg: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.dark },
        'En attente': { bg: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.dark },
    };
    const { bg, color } = statusConfig[status] || statusConfig['En attente'];
    return { backgroundColor: bg, color, fontWeight: 600, fontSize: '0.75rem', height: 28, borderRadius: 40 };
});

const StyledTabs = styled(Tabs)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
        height: 3,
    },
    '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
        minWidth: 'auto',
        '&.Mui-selected': { color: theme.palette.primary.main },
    },
}));

// ==================== COMPOSANT PRINCIPAL ====================
export default function Dossiers() {
    const theme = useTheme();
    const { dossiers, deleteDossier } = useDossiers();
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedDossier, setSelectedDossier] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({});

    // États pour la confirmation de suppression
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [dossierToDelete, setDossierToDelete] = useState(null);

    const showNotification = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleDelete = (id) => {
        const dossier = dossiers.find(d => d.id === id);
        setDossierToDelete(dossier);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (dossierToDelete) {
            deleteDossier(dossierToDelete.id);
            showNotification('Dossier supprimé avec succès', 'success');
            setDeleteDialogOpen(false);
            setDossierToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setDossierToDelete(null);
    };

    const handleViewDetails = (dossier) => {
        setSelectedDossier(dossier);
        setDetailsDialogOpen(true);
    };

    // ── Filtrage ──
    const getStatusFilter = () => {
        switch (tabValue) {
            case 1: return 'En cours';
            case 2: return 'Traité';
            case 3: return 'En attente';
            default: return null;
        }
    };

    const filteredDossiers = dossiers.filter((dossier) => {
        const statusMatch = getStatusFilter() ? dossier.statut === getStatusFilter() : true;
        const searchMatch =
            searchTerm === '' ||
            dossier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dossier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dossier.assigneA.toLowerCase().includes(searchTerm.toLowerCase());

        let advancedMatch = true;
        if (advancedFilters.nom) {
            advancedMatch = advancedMatch && dossier.nom.toLowerCase().includes(advancedFilters.nom.toLowerCase());
        }
        if (advancedFilters.assigneA) {
            advancedMatch = advancedMatch && dossier.assigneA.toLowerCase().includes(advancedFilters.assigneA.toLowerCase());
        }
        if (advancedFilters.statut) {
            advancedMatch = advancedMatch && dossier.statut === advancedFilters.statut;
        }
        if (advancedFilters.dateDebut) {
            const dossierDate = new Date(dossier.dateCreation);
            const dateDebut = new Date(advancedFilters.dateDebut);
            advancedMatch = advancedMatch && dossierDate >= dateDebut;
        }
        if (advancedFilters.dateFin) {
            const dossierDate = new Date(dossier.dateCreation);
            const dateFin = new Date(advancedFilters.dateFin);
            advancedMatch = advancedMatch && dossierDate <= dateFin;
        }
        return statusMatch && searchMatch && advancedMatch;
    });

    const stats = {
        total: dossiers.length,
        enCours: dossiers.filter(d => d.statut === 'En cours').length,
        traite: dossiers.filter(d => d.statut === 'Traité').length,
        enAttente: dossiers.filter(d => d.statut === 'En attente').length,
    };

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

            <PageHeader>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
                    Dossiers
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Organisation des courriers par dossiers – Bureau d'Ordre
                    </Typography>
                    <Chip
                        label={`${filteredDossiers.length} dossiers`}
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, fontWeight: 600 }}
                    />
                </Box>
            </PageHeader>

            {/* Stats cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard onClick={() => setTabValue(0)}>
                        <CardContent>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Total</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>{stats.total}</Typography>
                        </CardContent>
                    </StatCard>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard onClick={() => setTabValue(1)}>
                        <CardContent>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>En cours</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.dark }}>{stats.enCours}</Typography>
                        </CardContent>
                    </StatCard>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard onClick={() => setTabValue(2)}>
                        <CardContent>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Traité</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.dark }}>{stats.traite}</Typography>
                        </CardContent>
                    </StatCard>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard onClick={() => setTabValue(3)}>
                        <CardContent>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>En attente</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.dark }}>{stats.enAttente}</Typography>
                        </CardContent>
                    </StatCard>
                </Grid>
            </Grid>

            {/* Search + Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 3, gap: 2 }}>
                <SearchContainer sx={{ width: 350 }}>
                    <SearchIcon sx={{ color: theme.palette.primary.main }} />
                    <InputBase
                        placeholder="Rechercher (ID, nom, assigné à...)"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        sx={{ ml: 1, flex: 1 }}
                    />
                </SearchContainer>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={() => setFilterDrawerOpen(true)}
                        sx={{
                            borderColor: '#FFC107',
                            color: '#FFC107',
                            borderRadius: 40,
                            textTransform: 'none',
                            '&:hover': { borderColor: '#FFC107', bgcolor: '#FFF9E6' },
                        }}
                    >
                        Filtres
                        {Object.keys(advancedFilters).length > 0 && (
                            <Chip
                                label={Object.keys(advancedFilters).length}
                                size="small"
                                sx={{
                                    ml: 1,
                                    bgcolor: '#FFC107',
                                    color: '#1A1A1A',
                                    height: 20,
                                    '& .MuiChip-label': { fontSize: '0.7rem', px: 1 },
                                }}
                            />
                        )}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateDialogOpen(true)}
                        sx={{ bgcolor: theme.palette.primary.main, color: '#1A1A1A', borderRadius: 40, textTransform: 'none' }}
                    >
                        Nouveau dossier
                    </Button>
                </Box>
            </Box>

            {/* Tabs */}
            <StyledTabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                <Tab label="Tous" />
                <Tab label="En cours" />
                <Tab label="Traité" />
                <Tab label="En attente" />
            </StyledTabs>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                            <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Nom</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Assigné à</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Courriers</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Date création</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDossiers.map((dossier) => (
                            <TableRow key={dossier.id} sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                                <TableCell sx={{ fontWeight: 600 }}>{dossier.id}</TableCell>
                                <TableCell>{dossier.nom}</TableCell>
                                <TableCell>{dossier.assigneA}</TableCell>
                                <TableCell><StatusChip label={dossier.statut} status={dossier.statut} /></TableCell>
                                <TableCell>{(dossier.courrierIds?.length || 0)}</TableCell>
                                <TableCell>{dossier.dateCreation}</TableCell>
                                <TableCell>
                                    <Tooltip title="Voir détails">
                                        <IconButton size="small" onClick={() => handleViewDetails(dossier)}>
                                            <VisibilityIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Supprimer">
                                        <IconButton size="small" onClick={() => handleDelete(dossier.id)}>
                                            <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ========== DIALOGUES ========== */}

            {/* 1. Dialog de confirmation de suppression */}
            <Dialog
                open={deleteDialogOpen}
                onClose={cancelDelete}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                    <WarningIcon sx={{ color: theme.palette.error.main, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Confirmer la suppression
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 2 }}>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                        Êtes-vous sûr de vouloir supprimer le dossier{' '}
                        <Typography component="span" sx={{ color: theme.palette.primary.main, fontWeight: 700, fontStyle: 'italic' }}>
                            {dossierToDelete?.nom}
                        </Typography>
                        {' '}(ID: {dossierToDelete?.id}) ?
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1, fontStyle: 'italic' }}>
                        Cette action est irréversible.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        onClick={cancelDelete}
                        variant="outlined"
                        sx={{
                            borderRadius: 40,
                            textTransform: 'none',
                            color: theme.palette.text.primary,
                            borderColor: theme.palette.divider,
                        }}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        sx={{
                            borderRadius: 40,
                            textTransform: 'none',
                            bgcolor: theme.palette.error.main,
                            color: '#fff',
                            '&:hover': {
                                bgcolor: theme.palette.error.dark,
                            },
                        }}
                    >
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 2. Création de dossier */}
            <CreateDossierDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />

            {/* 3. Détails du dossier */}
            <DossierDetailsDialog
                open={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                dossier={selectedDossier}
            />

            <FilterDrawer
                open={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                onApply={setAdvancedFilters}
                currentFilters={advancedFilters}
            />
        </Box>
    );
}