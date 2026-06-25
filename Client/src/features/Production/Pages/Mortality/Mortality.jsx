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
    Snackbar,
    Alert,
    Menu,
    MenuItem,
    alpha,
    Divider,
} from '@mui/material';
import { Egg, ArrowDropDown, ArrowDropUp, Male, Female } from '@mui/icons-material';

export default function Mortality() {
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

    // Date sélectionnée
    const [selectedDate, setSelectedDate] = React.useState(
        new Date().toISOString().split('T')[0]
    );

    // Données de mortalité
    const [male, setMale] = React.useState(0);
    const [female, setFemale] = React.useState(0);
    const [notes, setNotes] = React.useState('');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [historique, setHistorique] = React.useState([]); // stockage local

    // Gestion du menu bâtiment
    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);
    const handleSelectBuilding = (buildingName) => {
        setSelectedBuilding(buildingName);
        handleCloseMenu();
    };

    const isFormDisabled = !selectedBuilding;

    // Réinitialisation du formulaire après enregistrement
    const resetForm = () => {
        setMale(0);
        setFemale(0);
        setNotes('');
        // On garde la date et le bâtiment pour faciliter les saisies suivantes
    };

    // Format date FR
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Enregistrement
    const handleSubmit = () => {
        if (!selectedBuilding) {
            alert("Veuillez sélectionner un bâtiment.");
            return;
        }
        if (male === 0 && female === 0) {
            alert("Veuillez saisir au moins une valeur (mâle ou femelle).");
            return;
        }

        const nouvelleMortalite = {
            building: selectedBuilding,
            date: selectedDate,
            male: Number(male),
            female: Number(female),
            notes: notes,
            createdAt: new Date().toISOString(),
        };

        // Mise à jour de l'historique local
        setHistorique(prev => [nouvelleMortalite, ...prev]);

        // Ici on peut aussi envoyer à une API
        console.log("Mortalité enregistrée :", nouvelleMortalite);

        // Notification
        setOpenSnackbar(true);

        // Réinitialiser les champs de saisie
        resetForm();
    };

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 4 },
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
            }}
        >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Enregistrement de la Mortalité
            </Typography>

            {/* Sélection obligatoire du bâtiment */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${
                        theme.palette.mode === 'dark' ? '#2D2D2D' : '#F1F5F9'
                    }`,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={600}>
                        Bâtiment sélectionné :
                        <strong
                            style={{
                                color: theme.palette.primary.main,
                                marginLeft: 8,
                            }}
                        >
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
                            '&:hover': {
                                borderColor: '#FFC107',
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                            },
                        }}
                    >
                        {selectedBuilding
                            ? `Bâtiment ${selectedBuilding}`
                            : "Choisissez le bâtiment"}
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
                            <MenuItem
                                key={bld.name}
                                onClick={() => handleSelectBuilding(bld.name)}
                            >
                                {bld.icon} Bâtiment {bld.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Paper>

            {/* Date de l'événement */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${
                        theme.palette.mode === 'dark' ? '#2D2D2D' : '#F1F5F9'
                    }`,
                }}
            >
                <TextField
                    fullWidth
                    type="date"
                    label="Date de constat"
                    size="small"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={isFormDisabled}
                />
            </Paper>

            <Typography variant="h6" fontWeight="600" gutterBottom>
                Mortalité du {formatDate(selectedDate)}{" "}
                {selectedBuilding && `(Bâtiment ${selectedBuilding})`}
            </Typography>

            {/* Formulaire mortalité */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${
                        theme.palette.mode === 'dark' ? '#2D2D2D' : '#F1F5F9'
                    }`,
                    opacity: isFormDisabled ? 0.6 : 1,
                    transition: 'opacity 0.2s',
                }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nombre de mâles"
                            type="number"
                            size="small"
                            value={male}
                            onChange={(e) => setMale(e.target.value)}
                            disabled={isFormDisabled}
                            InputProps={{
                                startAdornment: (
                                    <Male
                                        sx={{ mr: 1, color: theme.palette.primary.main }}
                                    />
                                ),
                                inputProps: { min: 0 },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nombre de femelles"
                            type="number"
                            size="small"
                            value={female}
                            onChange={(e) => setFemale(e.target.value)}
                            disabled={isFormDisabled}
                            InputProps={{
                                startAdornment: (
                                    <Female
                                        sx={{ mr: 1, color: theme.palette.primary.main }}
                                    />
                                ),
                                inputProps: { min: 0 },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Observations / Causes"
                            placeholder="Cause probable, remarques..."
                            size="small"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={isFormDisabled}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Résumé */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mt: 2,
                    borderRadius: 1,
                    border: `3px solid ${theme.palette.primary.main}`,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    Total mortalité : {Number(male) + Number(female)} sujets
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    (Mâles : {male} | Femelles : {female})
                </Typography>
            </Paper>

            {/* Bouton d'enregistrement */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mt: 3,
                    flexDirection: isMobile ? 'column' : 'row',
                }}
            >
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isFormDisabled || (male === 0 && female === 0)}
                    onClick={handleSubmit}
                >
                    Enregistrer la mortalité
                </Button>
            </Box>

            {/* Notification de succès */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setOpenSnackbar(false)}
                >
                    Mortalité enregistrée pour le bâtiment {selectedBuilding} !
                </Alert>
            </Snackbar>

            {/* Optionnel : affichage du dernier historique (simple) */}
            {historique.length > 0 && (
                <Paper
                    sx={{
                        mt: 4,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Dernier enregistrement :
                    </Typography>
                    <Typography variant="body2">
                        {formatDate(historique[0].date)} - {historique[0].building} :{" "}
                        {historique[0].male} ♂ / {historique[0].female} ♀
                        {historique[0].notes && ` — ${historique[0].notes}`}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}