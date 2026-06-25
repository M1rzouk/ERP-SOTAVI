import * as React from 'react';
import {
    Box,
    useTheme,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    HomeWork,
    Apartment,
    Business,
    Factory,
    ArrowDropDown,
    ArrowDropUp,
} from '@mui/icons-material';

// Helper: convert "dd/mm/yyyy" to Date
const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
};

// Helper: get week number (Monday first day)
const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7; // Monday=1, Sunday=7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return { year: d.getUTCFullYear(), week: weekNo };
};

export default function ProductionHistory() {
    const theme = useTheme();

    // ----- Data with building field (same lot assumed) -----
    const data = [
        { building: "A17", date: "01/04/2026", total: 12450, notes: { "09h": "Ramassage normal", "11h": "Œufs propres", "14h": "Production stable", "16h": "Fin de journée" } },
        { building: "A19", date: "02/04/2026", total: 13120, notes: {} },
        { building: "B17", date: "03/04/2026", total: 11890, notes: { "09h": "Légère baisse", "14h": "Rattrapage" } },
        { building: "B19", date: "04/04/2026", total: 14300, notes: { "09h": "Bon démarrage", "11h": "Record ce matin" } },
        { building: "A17", date: "05/04/2026", total: 12750, notes: {} },
        { building: "A19", date: "06/04/2026", total: 13560, notes: { "14h": "Chaleur, baisse de ponte" } },
        { building: "B17", date: "07/04/2026", total: 14280, notes: {} },
        { building: "B19", date: "08/04/2026", total: 12900, notes: { "09h": "Œufs cassés signalés", "16h": "Ramassage supplémentaire" } },
        { building: "A17", date: "09/04/2026", total: 13840, notes: {} },
        { building: "A19", date: "10/04/2026", total: 15210, notes: { "11h": "Pic de production", "16h++": "Nettoyage des plateaux" } },
        { building: "B17", date: "11/04/2026", total: 12180, notes: {} },
        { building: "B19", date: "12/04/2026", total: 13690, notes: { "09h": "Normale", "14h": "Très propre" } },
        { building: "A17", date: "13/04/2026", total: 14800, notes: { "11h": "Bon rendement" } },
        { building: "A19", date: "14/04/2026", total: 11240, notes: { "09h": "Grève partielle", "16h": "Rattrapage impossible" } },
        { building: "B17", date: "15/04/2026", total: 12530, notes: {} },
        { building: "B19", date: "16/04/2026", total: 13990, notes: { "09h": "Œufs calibrés", "16h++": "Stockage" } },
        { building: "A17", date: "17/04/2026", total: 14450, notes: {} },
        { building: "A19", date: "18/04/2026", total: 13170, notes: { "14h": "Problème de convoyeur", "16h": "Réparé" } },
        { building: "B17", date: "19/04/2026", total: 12790, notes: {} },
        { building: "B19", date: "20/04/2026", total: 15820, notes: { "09h": "Record!", "11h": "Poules en pleine forme" } },
        { building: "A17", date: "21/04/2026", total: 13450, notes: {} },
        { building: "A19", date: "22/04/2026", total: 12980, notes: { "09h": "Humidité élevée", "16h": "Œufs sales" } },
        { building: "B17", date: "23/04/2026", total: 14620, notes: {} },
        { building: "B19", date: "24/04/2026", total: 13890, notes: { "11h": "Nettoyage des tapis" } },
        { building: "A17", date: "25/04/2026", total: 12110, notes: {} },
        { building: "A19", date: "26/04/2026", total: 15240, notes: { "14h": "Grosse ponte", "16h++": "Expédition rapide" } },
        { building: "B17", date: "27/04/2026", total: 13680, notes: {} },
        { building: "B19", date: "28/04/2026", total: 14320, notes: { "09h": "Œufs fermiers", "11h": "Tri manuel" } },
        { building: "A17", date: "29/04/2026", total: 12860, notes: {} },
        { building: "A19", date: "30/04/2026", total: 15500, notes: { "09h": "Fin du mois record", "16h": "Bilan positif" } },
    ];

    // Building list with icons
    const buildings = [
        { name: "A17", icon: <HomeWork sx={{ mr: 1, color: '#FFC107' }} /> },
        { name: "A19", icon: <Apartment sx={{ mr: 1, color: '#FFC107' }} /> },
        { name: "B17", icon: <Business sx={{ mr: 1, color: '#FFC107' }} /> },
        { name: "B19", icon: <Factory sx={{ mr: 1, color: '#FFC107' }} /> },
    ];

    const [historique] = React.useState(data);
    const [selectedBuilding, setSelectedBuilding] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleChoseBuildingClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleBuildingSelect = (buildingName) => {
        setSelectedBuilding(buildingName === "Tous" ? null : buildingName);
        handleClose();
    };

    // 1. Filter by building
    let filteredHistory = selectedBuilding
        ? historique.filter(item => item.building === selectedBuilding)
        : historique;

    // 2. Sort by date ascending
    let sortedHistory = [...filteredHistory].sort((a, b) => parseDate(a.date) - parseDate(b.date));

    // 3. Group by week (Monday-Sunday)
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
                    totalEggs: 0,
                };
                currentWeekKey = weekKey;
            }
            currentGroup.items.push(item);
            currentGroup.totalEggs += item.total;
        });
        if (currentGroup) groups.push(currentGroup);
        return groups;
    };

    const groupedHistory = groupByWeek(sortedHistory);

    const formatDate = (dateString) => {
        const date = parseDate(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const buttonWidth = anchorEl ? anchorEl.clientWidth : undefined;

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Historique des productions
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
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
                    slotProps={{ paper: { sx: { width: buttonWidth, minWidth: 'auto' } } }}
                >
                    <MenuItem onClick={() => handleBuildingSelect("Tous")}>
                        <Factory sx={{ mr: 1, color: '#FFC107' }} /> Tous
                    </MenuItem>
                    {buildings.map((bld) => (
                        <MenuItem key={bld.name} onClick={() => handleBuildingSelect(bld.name)}>
                            {bld.icon} Poulailler {bld.name}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    overflow: 'hidden',
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#2D2D2D' : '#F1F5F9'}`,
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                                <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>
                                    Bâtiment
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>
                                    Date
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>
                                    Total des œufs
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>
                                    Notes
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {groupedHistory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ color: theme.palette.text.secondary }}>
                                        Aucune production enregistrée pour ce bâtiment
                                    </TableCell>
                                </TableRow>
                            ) : (
                                groupedHistory.map((group) => (
                                    <React.Fragment key={group.weekKey}>
                                        {group.items.map((item, idx) => (
                                            <TableRow key={`${group.weekKey}-${idx}`} hover>
                                                <TableCell>{item.building}</TableCell>
                                                <TableCell>{formatDate(item.date)}</TableCell>
                                                <TableCell><strong>{item.total.toLocaleString()} œufs</strong></TableCell>
                                                <TableCell>
                                                    {Object.keys(item.notes).length > 0 ? (
                                                        Object.entries(item.notes).map(([hour, note], i) => (
                                                            <Typography key={i} variant="body2">
                                                                <strong>{hour}</strong> : {note}
                                                            </Typography>
                                                        ))
                                                    ) : (
                                                        <Typography variant="body2">Aucune note</Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {/* Weekly total row */}
                                        <TableRow
                                            sx={{
                                                backgroundColor: theme.palette.mode === 'dark' ? '#2C2C2C' : '#F5F5F5',
                                                borderTop: `2px solid ${theme.palette.divider}`,
                                                '& > td': { fontWeight: 'bold' },
                                            }}
                                        >
                                            <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                                                Total semaine du {formatDate(group.items[0].date)} →
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>
                                                {group.totalEggs.toLocaleString()} œufs
                                            </TableCell>
                                            <TableCell />
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