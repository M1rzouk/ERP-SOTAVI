import * as React from 'react';
import { useState } from 'react';
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
    Tabs,
    Tab,
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
    Menu,

} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Visibility as VisibilityIcon,
    PictureAsPdf as PdfIcon,
    History as HistoryIcon,
    Print as PrintIcon,
    CheckCircle as CheckCircleIcon,
    GetApp as GetAppIcon,
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import TableChartIcon from '@mui/icons-material/TableChart';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import FilterDrawer from './../../Components/IncomingMail/FilterDrawer';
import { exportToPDF, exportToExcel } from './../../Components/IncomingMail/ExportUtils';
import AssignToDossierDialog from '../../Components/Dossiers/AssignToDossierDialog';
import { Folder as FolderIcon } from '@mui/icons-material';

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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
    overflowX: 'auto',
}));

const StatusChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== 'status',
})(({ theme, status }) => {
    const statusConfig = {
        'En cours': { bg: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.dark },
        'Traité': { bg: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.dark },
        'En attente': { bg: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.dark },
        'Transmis': { bg: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.dark },
    };
    const { bg, color } = statusConfig[status] || statusConfig['En attente'];
    return {
        backgroundColor: bg,
        color,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: 28,
        borderRadius: 40,
    };
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

const DropZone = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isDragActive',
})(({ theme, isDragActive }) => ({
    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : theme.palette.background.default,
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
}));

// ==================== DONNÉES INITIALES ====================
const initialCourriers = [
    {
        id: 'CS-2026-001',
        date: '2026-05-02',
        expediteur: 'Direction Générale',
        destinataire: 'Ministère de l\'Éducation',
        sujet: 'Envoi rapport annuel 2025',
        initiales: 'DG',
        assigneA: 'Ahmed Benali',
        statut: 'En cours',
        version1: './../../../../../public/pdfs/14281.pdf',
        version2: null,
        historique: [
            { date: '2026-05-02 09:30', action: 'Création du courrier', user: 'Agent' },
            { date: '2026-05-02 10:15', action: 'Scan V1', user: 'Agent' },
            { date: '2026-05-02 11:00', action: 'Transmis au service courrier', user: 'Agent' },
        ],
        documentPhysique: 'À envoyer',
    },
    {
        id: 'CS-2026-002',
        date: '2026-05-02',
        expediteur: 'Préfecture d\'Alger',
        destinataire: 'Service des Étrangers',
        sujet: 'Demande de listes nominatives',
        initiales: 'PA',
        statut: 'Traité',
        assigneA: 'Ahmed Benali',
        version1: './../../../../../public/pdfs/14281.pdf',
        version2: './../../../../../public/pdfs/14281.pdf',
        historique: [
            { date: '2026-05-02 10:00', action: 'Création', user: 'Agent' },
            { date: '2026-05-02 10:45', action: 'Scan V1', user: 'Agent' },
            { date: '2026-05-03 14:00', action: 'Scan V2 final - Archivé', user: 'Agent' },
        ],
        documentPhysique: 'Archivé',
    },
    {
        id: 'CS-2026-003',
        date: '2026-05-03',
        expediteur: 'SOTAVI Production',
        destinataire: 'Fournisseur AgroSARL',
        sujet: 'Commande aliments volailles',
        initiales: 'SP',
        assigneA: 'Ahmed Benali',
        statut: 'En attente',
        version1: './../../../../../public/pdfs/14281.pdf',
        version2: null,
        historique: [
            { date: '2026-05-03 08:00', action: 'Création', user: 'Agent' },
            { date: '2026-05-03 09:30', action: 'Scan V1', user: 'Agent' },
        ],
        documentPhysique: 'Bureau ordre',
    },
];

// ==================== COMPOSANT PRINCIPAL ====================
export default function OutgoingMail() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const searchPlaceholder = isSmallScreen
        ? "Rechercher..."
        : "Rechercher (N°, expéditeur, sujet...)";
    const [courriers, setCourriers] = React.useState(initialCourriers);
    const [tabValue, setTabValue] = React.useState(0);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCourrier, setSelectedCourrier] = React.useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
    const [pdfViewerOpen, setPdfViewerOpen] = React.useState(false);
    const [versionToShow, setVersionToShow] = React.useState('V1');
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const [formDialogOpen, setFormDialogOpen] = React.useState(false);
    const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);
    const [advancedFilters, setAdvancedFilters] = React.useState({});
    const [exportMenuAnchor, setExportMenuAnchor] = React.useState(null);
    const [newCourrier, setNewCourrier] = React.useState({
        expediteur: '',
        destinataire: '',
        sujet: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [uploadedFile, setUploadedFile] = React.useState(null);
    const [isDragActive, setIsDragActive] = React.useState(false);
    const [scanFinalDialogOpen, setScanFinalDialogOpen] = React.useState(false);
    const [finalPdfFile, setFinalPdfFile] = React.useState(null);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [courrierToAssign, setCourrierToAssign] = useState(null);
    const iframeRef = React.useRef(null);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    // Filtrage
    const getStatusFilter = () => {
        switch (tabValue) {
            case 1: return 'En cours';
            case 2: return 'Traité';
            case 3: return 'En attente';
            default: return null;
        }
    };

    const filteredCourriers = courriers.filter((courrier) => {
        const statusMatch = getStatusFilter() ? courrier.statut === getStatusFilter() : true;
        const searchMatch =
            searchTerm === '' ||
            courrier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            courrier.expediteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
            courrier.destinataire.toLowerCase().includes(searchTerm.toLowerCase()) ||
            courrier.sujet.toLowerCase().includes(searchTerm.toLowerCase());

        let advancedMatch = true;
        if (advancedFilters.expediteur) {
            advancedMatch = advancedMatch && courrier.expediteur.toLowerCase().includes(advancedFilters.expediteur.toLowerCase());
        }
        if (advancedFilters.statut) {
            advancedMatch = advancedMatch && courrier.statut === advancedFilters.statut;
        }
        if (advancedFilters.dateDebut) {
            const courrierDate = new Date(courrier.date.split('/').reverse().join('-'));
            const dateDebut = new Date(advancedFilters.dateDebut);
            advancedMatch = advancedMatch && courrierDate >= dateDebut;
        }
        if (advancedFilters.dateFin) {
            const courrierDate = new Date(courrier.date.split('/').reverse().join('-'));
            const dateFin = new Date(advancedFilters.dateFin);
            advancedMatch = advancedMatch && courrierDate <= dateFin;
        }
        return statusMatch && searchMatch && advancedMatch;
    });

    const stats = {
        total: courriers.length,
        enCours: courriers.filter(c => c.statut === 'En cours').length,
        traite: courriers.filter(c => c.statut === 'Traité').length,
        enAttente: courriers.filter(c => c.statut === 'En attente').length,
    };

    const showNotification = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    // Actions
    const handleViewDetails = (courrier) => {
        setSelectedCourrier(courrier);
        setDetailDialogOpen(true);
    };

    const handleAddCourrier = () => {
        if (!newCourrier.expediteur || !newCourrier.destinataire || !newCourrier.sujet || !uploadedFile) {
            showNotification('Veuillez remplir tous les champs et ajouter le PDF V1', 'warning');
            return;
        }
        const newId = `CS-${new Date().getFullYear()}-${String(courriers.length + 1).padStart(3, '0')}`;
        const courrier = {
            id: newId,
            date: newCourrier.date,
            expediteur: newCourrier.expediteur,
            destinataire: newCourrier.destinataire,
            sujet: newCourrier.sujet,
            initiales: newCourrier.expediteur.split(' ').map(n => n[0]).join('').toUpperCase(),
            statut: 'En cours',
            version1: URL.createObjectURL(uploadedFile),
            version2: null,
            historique: [
                { date: new Date().toISOString(), action: 'Création et scan V1', user: 'Agent' },
            ],
            documentPhysique: 'À envoyer',
        };
        setCourriers([courrier, ...courriers]);
        setFormDialogOpen(false);
        setNewCourrier({ expediteur: '', destinataire: '', sujet: '', date: new Date().toISOString().split('T')[0] });
        setUploadedFile(null);
        showNotification(`Courrier ${newId} créé avec succès`, 'success');
    };

    const handleExportClick = (event) => {
        setExportMenuAnchor(event.currentTarget);
    };
    const handleExportClose = () => setExportMenuAnchor(null);
    const handleExportPDF = () => {
        exportToPDF(filteredCourriers, 'Courrier_Sortant');
        showNotification('Export PDF généré !', 'success');
        handleExportClose();
    };
    const handleExportExcel = () => {
        exportToExcel(filteredCourriers);
        showNotification('Export Excel généré !', 'success');
        handleExportClose();
    };

    const handleScanFinal = () => {
        if (!selectedCourrier || !finalPdfFile) return;
        const updated = courriers.map(c =>
            c.id === selectedCourrier.id
                ? {
                    ...c,
                    version2: URL.createObjectURL(finalPdfFile),
                    statut: 'Traité',
                    historique: [...c.historique, { date: new Date().toISOString(), action: 'Scan V2 final - Archivé', user: 'Agent' }],
                    documentPhysique: 'Archivé',
                }
                : c
        );
        setCourriers(updated);
        setScanFinalDialogOpen(false);
        setFinalPdfFile(null);
        setDetailDialogOpen(false);
        showNotification('Version finale ajoutée et courrier archivé', 'success');
    };

    const handlePrintBordereau = (courrier) => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const primaryRgb = [255, 193, 7];
        doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(26, 26, 26);
        doc.setFontSize(18);
        doc.text('SOTAVI ERP - Bordereau de suivi (Sortant)', 105, 25, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text(`N°: ${courrier.id}`, 20, 55);
        doc.text(`Date: ${format(new Date(courrier.date), 'dd/MM/yyyy', { locale: fr })}`, 20, 65);
        doc.text(`Expéditeur: ${courrier.expediteur}`, 20, 75);
        doc.text(`Destinataire: ${courrier.destinataire}`, 20, 85);
        doc.text(`Sujet: ${courrier.sujet}`, 20, 95);
        doc.text(`Statut: ${courrier.statut}`, 20, 105);
        doc.text(`Document papier: ${courrier.documentPhysique}`, 20, 115);

        autoTable(doc, {
            startY: 125,
            head: [['Date', 'Action', 'Agent']],
            body: courrier.historique.map(h => [h.date, h.action, h.user]),
            theme: 'striped',
            headStyles: { fillColor: primaryRgb, textColor: [26, 26, 26] },
        });

        doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 105, doc.lastAutoTable.finalY + 20, { align: 'center' });
        doc.save(`bordereau_${courrier.id}.pdf`);
    };

    const handleFileUpload = (file) => {
        if (file && file.type === 'application/pdf') {
            setUploadedFile(file);
        } else {
            showNotification('Veuillez sélectionner un fichier PDF valide', 'error');
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            iframeRef.current?.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    // Écouter les changements de plein écran (pour synchroniser l'icône)
    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

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
                    Courrier Sortant
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Gestion, suivi et archivage numérique – Bureau d'Ordre
                    </Typography>
                    <Chip
                        label={`${filteredCourriers.length} courriers`}
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, fontWeight: 600 }}
                    />
                </Box>
            </PageHeader>

            {/* STATS CARDS */}
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

            {/* SEARCH + ACTIONS */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 3, gap: 2 }}>
                <SearchContainer sx={{ width: isMobile ? '100%' : 350 }}>
                    <SearchIcon sx={{ color: theme.palette.primary.main }} />
                    <InputBase
                        placeholder={searchPlaceholder}
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
                    <Menu
                        anchorEl={exportMenuAnchor}
                        open={Boolean(exportMenuAnchor)}
                        onClose={handleExportClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem onClick={handleExportPDF}>
                            <PictureAsPdfIcon sx={{ mr: 1, color: '#FFC107' }} />
                            Exporter en PDF
                        </MenuItem>
                        <MenuItem onClick={handleExportExcel}>
                            <TableChartIcon sx={{ mr: 1, color: '#FFC107' }} />
                            Exporter en Excel
                        </MenuItem>
                    </Menu>
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={() => setFormDialogOpen(true)}
                        sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, borderRadius: 40 }}
                    >
                        Nouveau courrier
                    </Button>
                </Box>
            </Box>

            {/* TABS */}
            <StyledTabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant={isMobile ? 'fullWidth' : 'standard'}>
                <Tab label="Tous" />
                <Tab label="En cours" />
                <Tab label="Traité" />
                <Tab label="En attente" />
            </StyledTabs>

            {/* TABLEAU */}
            <StyledTableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                            <TableCell sx={{ fontWeight: 700 }}>N°</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Expéditeur</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Destinataire</TableCell>
                            {!isMobile && <TableCell sx={{ fontWeight: 700 }}>Sujet</TableCell>}
                            {!isMobile && <TableCell sx={{ fontWeight: 700 }}>Assigné à</TableCell>}
                            {!isMobile && <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>}
                            <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCourriers.map(c => (
                            <TableRow key={c.id} sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                                <TableCell sx={{ fontWeight: 600 }}>{c.id}</TableCell>
                                <TableCell>{format(new Date(c.date), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>{c.expediteur}</TableCell>
                                <TableCell>{c.destinataire}</TableCell>
                                {!isMobile && <TableCell>{c.sujet}</TableCell>}
                                {!isMobile && (
                                    <>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        bgcolor: theme.palette.primary.main,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem',
                                                        color: theme.palette.primary.contrastText,
                                                    }}
                                                >
                                                    {c.initiales}
                                                </Box>
                                                <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                                    {c.assigneA}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <StatusChip label={c.statut} status={c.statut} />
                                        </TableCell>
                                    </>
                                )}
                                <TableCell>
                                    <Tooltip title="Voir détails">
                                        <IconButton size="small" onClick={() => handleViewDetails(c)}>
                                            <VisibilityIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Imprimer bordereau">
                                        <IconButton size="small" onClick={() => handlePrintBordereau(c)}>
                                            <PrintIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    </Tooltip>
                                    {c.statut === 'En cours' && !c.version2 && (
                                        <Tooltip title="Ajouter version finale">
                                            <IconButton size="small" onClick={() => { setSelectedCourrier(c); setScanFinalDialogOpen(true); }}>
                                                <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Assigner à un dossier">
                                        <IconButton size="small" onClick={() => { setCourrierToAssign(c); setAssignDialogOpen(true); }}>
                                            <FolderIcon fontSize="small" sx={{ color: theme.palette.info.main }} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>

            {/* DIALOG NOUVEAU COURRIER */}
            <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Nouveau courrier sortant</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Expéditeur"
                        size="small"
                        value={newCourrier.expediteur}
                        onChange={e => setNewCourrier({ ...newCourrier, expediteur: e.target.value })}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Destinataire"
                        size="small"
                        value={newCourrier.destinataire}
                        onChange={e => setNewCourrier({ ...newCourrier, destinataire: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Sujet"
                        size="small"
                        value={newCourrier.sujet}
                        onChange={e => setNewCourrier({ ...newCourrier, sujet: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="date"
                        label="Date"
                        size="small"
                        value={newCourrier.date}
                        onChange={e => setNewCourrier({ ...newCourrier, date: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <DropZone
                        isDragActive={isDragActive}
                        onDragOver={e => { e.preventDefault(); setIsDragActive(true); }}
                        onDragLeave={() => setIsDragActive(false)}
                        onDrop={e => { e.preventDefault(); setIsDragActive(false); handleFileUpload(e.dataTransfer.files[0]); }}
                        onClick={() => document.getElementById('pdf-upload').click()}
                    >
                        <input id="pdf-upload" type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => handleFileUpload(e.target.files[0])} />
                        <UploadIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                        <Typography variant="body2">Glissez-déposez le PDF scanné (V1) ou cliquez</Typography>
                        {uploadedFile && <Chip label={uploadedFile.name} sx={{ mt: 2 }} />}
                    </DropZone>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormDialogOpen(false)}>Annuler</Button>
                    <Button variant="contained" onClick={handleAddCourrier} sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                        Créer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DIALOG SCAN FINAL (V2) */}
            <Dialog open={scanFinalDialogOpen} onClose={() => setScanFinalDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Ajouter la version finale (V2)</DialogTitle>
                <DialogContent>
                    <DropZone onClick={() => document.getElementById('final-pdf').click()}>
                        <input id="final-pdf" type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => setFinalPdfFile(e.target.files[0])} />
                        <UploadIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                        <Typography variant="body2">Scanner le document signé/annoté</Typography>
                        {finalPdfFile && <Chip label={finalPdfFile.name} sx={{ mt: 2 }} />}
                    </DropZone>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScanFinalDialogOpen(false)}>Annuler</Button>
                    <Button variant="contained" onClick={handleScanFinal} sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                        Valider et archiver
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DIALOG DÉTAILS */}
            <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
                {selectedCourrier && (
                    <>
                        <DialogTitle>{selectedCourrier.id}</DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" fontWeight={700}>Expéditeur</Typography>
                                    <Typography variant="body2">{selectedCourrier.expediteur}</Typography>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2 }}>Destinataire</Typography>
                                    <Typography variant="body2">{selectedCourrier.destinataire}</Typography>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2 }}>Sujet</Typography>
                                    <Typography variant="body2">{selectedCourrier.sujet}</Typography>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2 }}>Document papier</Typography>
                                    <Typography variant="body2">{selectedCourrier.documentPhysique}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" fontWeight={700}>Statut</Typography>
                                    <StatusChip status={selectedCourrier.statut} label={selectedCourrier.statut} sx={{ mt: 1 }} />
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2 }}>Version PDF</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <Button size="small" variant={versionToShow === 'V1' ? 'contained' : 'outlined'} onClick={() => setVersionToShow('V1')}>V1</Button>
                                        <Button size="small" variant={versionToShow === 'V2' ? 'contained' : 'outlined'} onClick={() => setVersionToShow('V2')} disabled={!selectedCourrier.version2}>V2</Button>
                                    </Box>
                                    <Button startIcon={<PdfIcon />} onClick={() => setPdfViewerOpen(true)} sx={{ mt: 2, bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                                        Visualiser le PDF
                                    </Button>
                                </Grid>
                                <Grid size={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" gutterBottom>Historique</Typography>
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Action</TableCell>
                                                    <TableCell>Agent</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedCourrier.historique.map((h, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell>{h.date}</TableCell>
                                                        <TableCell>{h.action}</TableCell>
                                                        <TableCell>{h.user}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDetailDialogOpen(false)}>Fermer</Button>
                            <Button startIcon={<PrintIcon />} onClick={() => handlePrintBordereau(selectedCourrier)} sx={{ color: theme.palette.primary.main }}>
                                Imprimer bordereau
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* MODAL PDF VIEWER */}
            <Dialog open={pdfViewerOpen} onClose={() => setPdfViewerOpen(false)} maxWidth="lg" fullWidth fullScreen={isMobile}>
                {selectedCourrier && (
                    <>
                        <DialogTitle>
                            {selectedCourrier.id} - {versionToShow === 'V1' ? 'Version V1' : 'Version V2'}
                            <Box sx={{ float: 'right', display: 'flex', gap: 1 }}>
                                <IconButton onClick={toggleFullscreen} sx={{ color: 'text.secondary' }}>
                                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                                </IconButton>
                                <IconButton onClick={() => setPdfViewerOpen(false)} sx={{ color: 'text.secondary' }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{ height: '80vh', p: 0 }}>
                            <iframe
                                ref={iframeRef}
                                src={versionToShow === 'V1' ? selectedCourrier.version1 : selectedCourrier.version2}
                                width="100%"
                                height="100%"
                                title="PDF Viewer"
                            />                        </DialogContent>
                    </>
                )}
            </Dialog>

            {/* FILTER DRAWER */}
            <FilterDrawer
                open={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                onApply={setAdvancedFilters}
                currentFilters={advancedFilters}
            />
            <AssignToDossierDialog
                open={assignDialogOpen}
                onClose={() => setAssignDialogOpen(false)}
                courrierId={courrierToAssign?.id}
                courrierRef={`${courrierToAssign?.id} - ${courrierToAssign?.sujet}`}
            />
        </Box>
    );
}