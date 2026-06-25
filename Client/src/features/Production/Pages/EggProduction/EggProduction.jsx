import * as React from 'react';

import {
    Box,
    useTheme,
    useMediaQuery,
    TextField,
    Typography,
    Paper,
    Button,
    Grid,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Snackbar,
    Alert,
    Menu,
    MenuItem,
    alpha,
} from '@mui/material';
import { Egg, ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

export default function ProductionOeufs() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Liste des bâtiments avec icônes
    const buildings = [
        { name: "A17", icon: <Egg sx={{ mr: 1, color: '#FFC107' }} /> },
        { name: "A19", icon: <Egg sx={{ mr: 1, color: '#FFC107' }} /> },
        { name: "B17", icon: <Egg sx={{ mr: 1, color: '#FFC107' }} /> },
        { name: "B19", icon: <Egg sx={{ mr: 1, color: '#FFC107' }} /> },
    ];

    // États
    const [selectedBuilding, setSelectedBuilding] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    // Créneaux horaires
    const timeSlots = ["09h", "11h", "14h", "16h", "16h++"];
    const [selectedDate, setSelectedDate] = React.useState(
        new Date().toISOString().split('T')[0]
    );
    const [collections, setCollections] = React.useState(
        timeSlots.reduce((acc, time) => {
            acc[time] = {
                nids: 0,
                sol: 0,
                notes: "",
                total: 0
            };
            return acc;
        }, {})
    );
    const [historique, setHistorique] = React.useState([]);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    // Gestion du menu
    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);
    const handleSelectBuilding = (buildingName) => {
        setSelectedBuilding(buildingName);
        handleCloseMenu();
    };

    // Mise à jour des champs de collecte
    const handleFieldChange = (time, field, value) => {
        setCollections(prev => {
            const updatedSlot = {
                ...prev[time],
                [field]: value
            };
            updatedSlot.total =
                (Number(updatedSlot.nids) || 0) +
                (Number(updatedSlot.sol) || 0);
            return {
                ...prev,
                [time]: updatedSlot
            };
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const totalJour = Object.values(collections).reduce(
        (sum, slot) => sum + slot.total,
        0
    );

    const handleAjouter = () => {
        const nouvelleProduction = {
            building: selectedBuilding,
            date: selectedDate,
            total: totalJour,
            details: collections
        };
        setHistorique(prev => [nouvelleProduction, ...prev]);
        setOpenSnackbar(true);
    };

    const handleSubmit = () => {
        const data = {
            building: selectedBuilding,
            date: selectedDate,
            collections,
            totalJour
        };
        console.log("Production enregistrée :", data);
    };

    // Désactiver les champs si aucun bâtiment n'est sélectionné
    const isFormDisabled = !selectedBuilding;

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 4 },
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary
            }}
        >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Suivi de Production des Œufs
            </Typography>

            {/* Sélection obligatoire du bâtiment */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#2D2D2D' : '#F1F5F9'}`
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Bâtiment sélectionné :
                        <strong style={{ color: theme.palette.primary.main, marginLeft: 8 }}>
                            {selectedBuilding || "Aucun"}
                        </strong>
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={handleOpenMenu}
                        endIcon={openMenu ? <ArrowDropUp /> : <ArrowDropDown />}
                        sx={{
                            minWidth: 220,
                            border: 2,
                            borderColor: theme.palette.primary.main,
                            color: '#FFC107',
                            borderRadius: 40,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { borderColor: '#FFC107', bgcolor: alpha(theme.palette.primary.main, 0.08) }
                        }}
                    >
                        {selectedBuilding ? `Bâtiment ${selectedBuilding}` : "Choisissez le bâtiment"}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        slotProps={{ paper: { sx: { minWidth: 220 } } }}
                    >
                        {buildings.map((bld) => (
                            <MenuItem key={bld.name} onClick={() => handleSelectBuilding(bld.name)}>
                                {bld.icon} Bâtiment {bld.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Paper>

            {/* Date */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#2D2D2D' : '#F1F5F9'}`
                }}
            >
                <TextField
                    fullWidth
                    type="date"
                    label="Date de collecte"
                    size="small"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={isFormDisabled}
                />
            </Paper>

            <Typography variant="h6" fontWeight="600" gutterBottom>
                Collectes du {formatDate(selectedDate)} {selectedBuilding && `(Bâtiment ${selectedBuilding})`}
            </Typography>

            {/* Cartes de collecte par créneau */}
            {timeSlots.map((time, index) => (
                <Paper
                    key={time}
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 1,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.mode === 'dark' ? '#2D2D2D' : '#F1F5F9'}`,
                        opacity: isFormDisabled ? 0.6 : 1,
                        transition: 'opacity 0.2s'
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: theme.palette.primary.main, fontWeight: 700 }}
                    >
                        Créneau : {time}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Œufs dans les nids"
                                type="number"
                                size="small"
                                value={collections[time].nids}
                                onChange={(e) => handleFieldChange(time, 'nids', e.target.value)}
                                disabled={isFormDisabled}
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Œufs au sol"
                                type="number"
                                size="small"
                                value={collections[time].sol}
                                onChange={(e) => handleFieldChange(time, 'sol', e.target.value)}
                                disabled={isFormDisabled}
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Total"
                                size="small"
                                value={collections[time].total}
                                disabled
                                sx={{
                                    '& .MuiInputBase-root': {
                                        backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2A' : '#F8FAFC',
                                        fontWeight: 'bold'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Observations"
                                placeholder="Ajouter une remarque..."
                                size="small"
                                value={collections[time].notes}
                                onChange={(e) => handleFieldChange(time, 'notes', e.target.value)}
                                disabled={isFormDisabled}
                            />
                        </Grid>
                    </Grid>
                    {index < timeSlots.length - 1 && <Divider sx={{ mt: 3 }} />}
                </Paper>
            ))}

            {/* Résumé */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mt: 2,
                    borderRadius: 1,
                    border: `3px solid ${theme.palette.primary.main}`,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    Total de la journée : {totalJour} œufs
                </Typography>
            </Paper>

            {/* Bouton d'enregistrement */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3, flexDirection: isMobile ? 'column' : 'row' }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isFormDisabled || totalJour === 0}
                    onClick={() => {
                        if (!selectedBuilding) {
                            alert("Veuillez sélectionner un bâtiment avant d'enregistrer.");
                            return;
                        }
                        handleSubmit();
                        handleAjouter();
                        // Optionnel : réinitialiser les champs ?
                        // setCollections(initialEmptyState);
                    }}
                >
                    Enregistrer la production
                </Button>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity="success" variant="filled" onClose={() => setOpenSnackbar(false)}>
                    Production enregistrée pour le bâtiment {selectedBuilding} !
                </Alert>
            </Snackbar>
        </Box>
    );
}