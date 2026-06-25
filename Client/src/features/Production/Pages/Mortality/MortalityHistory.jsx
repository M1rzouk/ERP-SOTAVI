import * as React from 'react';
import {
    Box,
    useTheme,
    useMediaQuery,
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Factory,
    Egg,
    ArrowDropDown,
    ArrowDropUp
} from '@mui/icons-material';

// Helper : conversion d'une date au format "dd/mm/yyyy" vers un objet Date
const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
};

// Helper : numéro de semaine (ISO : lundi → dimanche)
const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return { year: d.getUTCFullYear(), week: weekNo };
};

export default function MortalityHistory() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [lot, setLot] = React.useState("Lot2026_05_01");

    // Liste des bâtiments avec leur icône associée
    const buildings = [
        { name: "A17", icon: <Egg sx={{ mr: 1, color: '#FFC107' }} /> },
        { name: "A19", icon: <Egg sx={{ mr: 1, color: '#FFC107' }} /> },
        { name: "B17", icon: <Egg sx={{ mr: 1, color: '#FFC107' }} /> },
        { name: "B19", icon: <Egg sx={{ mr: 1, color: '#FFC107' }} /> }
    ];

    // Données exemple (plusieurs dates pour tester le regroupement par semaine)
    const data = [
        // A17
        { building: "A17", date: "01/04/2026", Male: 14, Female: 12 },
        { building: "A17", date: "02/04/2026", Male: 16, Female: 15 },
        { building: "A17", date: "03/04/2026", Male: 11, Female: 13 },
        { building: "A17", date: "04/04/2026", Male: 18, Female: 17 },
        { building: "A17", date: "05/04/2026", Male: 9, Female: 10 },
        { building: "A17", date: "06/04/2026", Male: 13, Female: 14 },
        { building: "A17", date: "07/04/2026", Male: 20, Female: 18 },
        { building: "A17", date: "08/04/2026", Male: 7, Female: 9 },
        { building: "A17", date: "09/04/2026", Male: 15, Female: 16 },
        { building: "A17", date: "10/04/2026", Male: 12, Female: 11 },
        { building: "A17", date: "11/04/2026", Male: 19, Female: 20 },
        { building: "A17", date: "12/04/2026", Male: 8, Female: 7 },
        { building: "A17", date: "13/04/2026", Male: 14, Female: 13 },
        { building: "A17", date: "14/04/2026", Male: 17, Female: 15 },
        { building: "A17", date: "15/04/2026", Male: 10, Female: 12 },
        { building: "A17", date: "16/04/2026", Male: 21, Female: 19 },
        { building: "A17", date: "17/04/2026", Male: 6, Female: 8 },
        { building: "A17", date: "18/04/2026", Male: 13, Female: 14 },
        { building: "A17", date: "19/04/2026", Male: 16, Female: 17 },
        { building: "A17", date: "20/04/2026", Male: 11, Female: 10 },
        { building: "A17", date: "21/04/2026", Male: 18, Female: 16 },
        { building: "A17", date: "22/04/2026", Male: 9, Female: 11 },
        { building: "A17", date: "23/04/2026", Male: 14, Female: 13 },
        { building: "A17", date: "24/04/2026", Male: 22, Female: 21 },
        { building: "A17", date: "25/04/2026", Male: 7, Female: 6 },
        { building: "A17", date: "26/04/2026", Male: 15, Female: 14 },
        { building: "A17", date: "27/04/2026", Male: 12, Female: 13 },
        { building: "A17", date: "28/04/2026", Male: 19, Female: 18 },
        { building: "A17", date: "29/04/2026", Male: 10, Female: 9 },
        { building: "A17", date: "30/04/2026", Male: 17, Female: 16 },

        // A19
        { building: "A19", date: "01/04/2026", Male: 13, Female: 14 },
        { building: "A19", date: "02/04/2026", Male: 15, Female: 16 },
        { building: "A19", date: "03/04/2026", Male: 10, Female: 11 },
        { building: "A19", date: "04/04/2026", Male: 19, Female: 18 },
        { building: "A19", date: "05/04/2026", Male: 8, Female: 9 },
        { building: "A19", date: "06/04/2026", Male: 14, Female: 13 },
        { building: "A19", date: "07/04/2026", Male: 21, Female: 20 },
        { building: "A19", date: "08/04/2026", Male: 6, Female: 7 },
        { building: "A19", date: "09/04/2026", Male: 16, Female: 15 },
        { building: "A19", date: "10/04/2026", Male: 11, Female: 12 },
        { building: "A19", date: "11/04/2026", Male: 18, Female: 19 },
        { building: "A19", date: "12/04/2026", Male: 9, Female: 8 },
        { building: "A19", date: "13/04/2026", Male: 13, Female: 14 },
        { building: "A19", date: "14/04/2026", Male: 17, Female: 16 },
        { building: "A19", date: "15/04/2026", Male: 12, Female: 11 },
        { building: "A19", date: "16/04/2026", Male: 20, Female: 19 },
        { building: "A19", date: "17/04/2026", Male: 7, Female: 8 },
        { building: "A19", date: "18/04/2026", Male: 14, Female: 15 },
        { building: "A19", date: "19/04/2026", Male: 16, Female: 17 },
        { building: "A19", date: "20/04/2026", Male: 10, Female: 9 },
        { building: "A19", date: "21/04/2026", Male: 19, Female: 18 },
        { building: "A19", date: "22/04/2026", Male: 8, Female: 10 },
        { building: "A19", date: "23/04/2026", Male: 15, Female: 14 },
        { building: "A19", date: "24/04/2026", Male: 22, Female: 21 },
        { building: "A19", date: "25/04/2026", Male: 6, Female: 7 },
        { building: "A19", date: "26/04/2026", Male: 13, Female: 12 },
        { building: "A19", date: "27/04/2026", Male: 18, Female: 19 },
        { building: "A19", date: "28/04/2026", Male: 11, Female: 10 },
        { building: "A19", date: "29/04/2026", Male: 17, Female: 16 },
        { building: "A19", date: "30/04/2026", Male: 14, Female: 15 },

        // B17
        { building: "B17", date: "01/04/2026", Male: 12, Female: 13 },
        { building: "B17", date: "02/04/2026", Male: 14, Female: 15 },
        { building: "B17", date: "03/04/2026", Male: 9, Female: 10 },
        { building: "B17", date: "04/04/2026", Male: 18, Female: 17 },
        { building: "B17", date: "05/04/2026", Male: 7, Female: 8 },
        { building: "B17", date: "06/04/2026", Male: 13, Female: 14 },
        { building: "B17", date: "07/04/2026", Male: 20, Female: 19 },
        { building: "B17", date: "08/04/2026", Male: 6, Female: 7 },
        { building: "B17", date: "09/04/2026", Male: 15, Female: 16 },
        { building: "B17", date: "10/04/2026", Male: 10, Female: 11 },
        { building: "B17", date: "11/04/2026", Male: 19, Female: 18 },
        { building: "B17", date: "12/04/2026", Male: 8, Female: 9 },
        { building: "B17", date: "13/04/2026", Male: 14, Female: 13 },
        { building: "B17", date: "14/04/2026", Male: 17, Female: 16 },
        { building: "B17", date: "15/04/2026", Male: 11, Female: 12 },
        { building: "B17", date: "16/04/2026", Male: 21, Female: 20 },
        { building: "B17", date: "17/04/2026", Male: 7, Female: 6 },
        { building: "B17", date: "18/04/2026", Male: 13, Female: 14 },
        { building: "B17", date: "19/04/2026", Male: 16, Female: 15 },
        { building: "B17", date: "20/04/2026", Male: 9, Female: 10 },
        { building: "B17", date: "21/04/2026", Male: 18, Female: 17 },
        { building: "B17", date: "22/04/2026", Male: 8, Female: 9 },
        { building: "B17", date: "23/04/2026", Male: 15, Female: 14 },
        { building: "B17", date: "24/04/2026", Male: 22, Female: 21 },
        { building: "B17", date: "25/04/2026", Male: 6, Female: 7 },
        { building: "B17", date: "26/04/2026", Male: 12, Female: 13 },
        { building: "B17", date: "27/04/2026", Male: 17, Female: 18 },
        { building: "B17", date: "28/04/2026", Male: 10, Female: 9 },
        { building: "B17", date: "29/04/2026", Male: 16, Female: 15 },
        { building: "B17", date: "30/04/2026", Male: 14, Female: 13 },

        // B19
        { building: "B19", date: "01/04/2026", Male: 15, Female: 14 },
        { building: "B19", date: "02/04/2026", Male: 13, Female: 12 },
        { building: "B19", date: "03/04/2026", Male: 11, Female: 10 },
        { building: "B19", date: "04/04/2026", Male: 17, Female: 18 },
        { building: "B19", date: "05/04/2026", Male: 9, Female: 8 },
        { building: "B19", date: "06/04/2026", Male: 16, Female: 15 },
        { building: "B19", date: "07/04/2026", Male: 20, Female: 21 },
        { building: "B19", date: "08/04/2026", Male: 7, Female: 6 },
        { building: "B19", date: "09/04/2026", Male: 14, Female: 13 },
        { building: "B19", date: "10/04/2026", Male: 12, Female: 11 },
        { building: "B19", date: "11/04/2026", Male: 18, Female: 19 },
        { building: "B19", date: "12/04/2026", Male: 8, Female: 9 },
        { building: "B19", date: "13/04/2026", Male: 13, Female: 14 },
        { building: "B19", date: "14/04/2026", Male: 19, Female: 18 },
        { building: "B19", date: "15/04/2026", Male: 10, Female: 11 },
        { building: "B19", date: "16/04/2026", Male: 22, Female: 20 },
        { building: "B19", date: "17/04/2026", Male: 6, Female: 7 },
        { building: "B19", date: "18/04/2026", Male: 15, Female: 16 },
        { building: "B19", date: "19/04/2026", Male: 17, Female: 18 },
        { building: "B19", date: "20/04/2026", Male: 9, Female: 10 },
        { building: "B19", date: "21/04/2026", Male: 14, Female: 13 },
        { building: "B19", date: "22/04/2026", Male: 11, Female: 12 },
        { building: "B19", date: "23/04/2026", Male: 18, Female: 17 },
        { building: "B19", date: "24/04/2026", Male: 21, Female: 22 },
        { building: "B19", date: "25/04/2026", Male: 7, Female: 8 },
        { building: "B19", date: "26/04/2026", Male: 13, Female: 14 },
        { building: "B19", date: "27/04/2026", Male: 16, Female: 15 },
        { building: "B19", date: "28/04/2026", Male: 10, Female: 9 },
        { building: "B19", date: "29/04/2026", Male: 19, Female: 18 },
        { building: "B19", date: "30/04/2026", Male: 12, Female: 13 }
    ];

    const [historique] = React.useState(data);
    const [selectedBuilding, setSelectedBuilding] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleChoseBuildingClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleBuildingSelect = (buildingName) => {
        setSelectedBuilding(buildingName === "Tous" ? null : buildingName);
        handleClose();
    };

    // 1. Filtrer par bâtiment
    let filteredHistory = selectedBuilding
        ? historique.filter(item => item.building === selectedBuilding)
        : historique;

    // 2. Trier par date croissante (après conversion)
    filteredHistory = [...filteredHistory].sort((a, b) => parseDate(a.date) - parseDate(b.date));

    // 3. Regrouper par semaine (chaque groupe contient ses lignes + totaux)
    const groupByWeek = (items) => {
        const groups = [];
        let currentWeekKey = null;
        let currentGroup = null;

        items.forEach(item => {
            const dateObj = parseDate(item.date);
            const { year, week } = getWeekNumber(dateObj);
            const weekKey = `${year}-W${week}`;

            if (weekKey !== currentWeekKey) {
                if (currentGroup) groups.push(currentGroup);
                currentGroup = {
                    weekKey,
                    items: [],
                    totalMale: 0,
                    totalFemale: 0
                };
                currentWeekKey = weekKey;
            }
            currentGroup.items.push(item);
            currentGroup.totalMale += item.Male;
            currentGroup.totalFemale += item.Female;
        });
        if (currentGroup) groups.push(currentGroup);
        return groups;
    };

    const groupedHistory = groupByWeek(filteredHistory);

    // Formatage date FR (affichage)
    const formatDate = (dateString) => {
        const date = parseDate(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const buttonWidth = anchorEl ? anchorEl.clientWidth : undefined;

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
                Historique des productions
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 3, gap: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    LOT : {lot}
                </Typography>

                <Button
                    variant="outlined"
                    onClick={handleChoseBuildingClick}
                    endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}
                    sx={{
                        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
                        minWidth: 250,
                        border: 3,
                        borderColor: theme.palette.primary.main,
                        color: '#FFC107',
                        borderRadius: 40,
                        textTransform: 'none',
                        '&:hover': { borderColor: '#FFC107', bgcolor: '#FFF9E6' },
                    }}
                >
                    {selectedBuilding ? selectedBuilding : "Choisissez le bâtiment"}
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    slotProps={{
                        paper: {
                            sx: {
                                width: buttonWidth,
                                minWidth: 'auto'
                            }
                        }
                    }}
                >
                    <MenuItem onClick={() => handleBuildingSelect("Tous")}>
                        <Box sx={{ mr: 1, color: '#FFC107' }}><Factory sx={{ mr: 1, color: '#FFC107' }} /></Box>
                        Tous
                    </MenuItem>
                    {buildings.map((bld) => (
                        <MenuItem key={bld.name} onClick={() => handleBuildingSelect(bld.name)}>
                            {bld.icon}
                            Poulailler {bld.name}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>

            {/* Tableau avec regroupement par semaine */}
            <Paper
                elevation={0}
                sx={{
                    overflow: 'hidden',
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#2D2D2D' : '#F1F5F9'}`
                }}
            >
                <TableContainer>
                    <Table sx={{ borderRadius: 1 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                                <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>
                                    Bâtiment
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>
                                    Date
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>
                                    Male
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>
                                    Female
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {groupedHistory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ color: theme.palette.text.secondary }}>
                                        Aucune production enregistrée
                                    </TableCell>
                                </TableRow>
                            ) : (
                                groupedHistory.map((group, groupIdx) => (
                                    <React.Fragment key={group.weekKey}>
                                        {/* Lignes détaillées du groupe */}
                                        {group.items.map((item, idx) => (
                                            <TableRow key={`${group.weekKey}-${idx}`} hover>
                                                <TableCell><strong>{item.building}</strong></TableCell>
                                                <TableCell>{formatDate(item.date)}</TableCell>
                                                <TableCell><strong>{item.Male}</strong></TableCell>
                                                <TableCell><strong>{item.Female}</strong></TableCell>
                                            </TableRow>
                                        ))}
                                        {/* Ligne de total pour la semaine */}
                                        <TableRow
                                            sx={{
                                                backgroundColor: theme.palette.mode === 'dark' ? '#2C2C2C' : '#F5F5F5',
                                                borderTop: `2px solid ${theme.palette.divider}`,
                                                '& > td': { fontWeight: 'bold' }
                                            }}
                                        >
                                            <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                                                Total semaine du {formatDate(group.items[0].date)} →
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{group.totalMale}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{group.totalFemale}</TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}