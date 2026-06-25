// src/features/validation/pages/Validation.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Chip, Button,
    IconButton, Tooltip, alpha, useTheme, Paper, Divider,
    Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
    Close as CloseIcon,
    PictureAsPdf as PdfIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import ValidationDialog from './../../Components/Validation/ValidationDialog';
import { useMediaQuery } from '@mui/material';

const PageHeader = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

const StatCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4],
    },
}));

export default function Validation() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [pendingCourriers, setPendingCourriers] = useState([]);
    const [selectedCourrier, setSelectedCourrier] = useState(null);
    const [validationDialogOpen, setValidationDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // PDF viewer state
    const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
    const [versionToShow, setVersionToShow] = useState('V1');
    const iframeRef = React.useRef(null);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const fetchPendingCourriers = () => {
        // Use valid PDF URLs (public sample or your own)
        const mockCourriers = [
            {
                id: 'CE-2026-001',
                type: 'entrant',
                expediteur: 'Ministère de l\'Éducation',
                sujet: 'Demande de rapport annuel 2025',
                date: '2026-05-02',
                validationStatus: 'pending',
                validationComment: '',
                assigneA: 'Ahmed Benali',
                documentPhysique: 'Bureau ordre',
                version1: './../../../../../public/pdfs/14281.pdf',
                version2: null,
            },
            {
                id: 'CS-2026-002',
                type: 'sortant',
                expediteur: 'Direction Générale',
                destinataire: 'Ministère de l\'Éducation',
                sujet: 'Envoi rapport annuel 2025',
                date: '2026-05-02',
                validationStatus: 'pending',
                validationComment: '',
                assigneA: 'Ahmed Benali',
                documentPhysique: 'À envoyer',
                version1: './../../../../../public/pdfs/14281.pdf',
                version2: null,
            },
        ];
        setPendingCourriers(mockCourriers);
    };

    useEffect(() => {
        fetchPendingCourriers();
    }, []);

    const handleValidation = (courrier) => {
        setSelectedCourrier(courrier);
        setValidationDialogOpen(true);
    };

    const handleValidate = (courrierId, decision, comment) => {
        setPendingCourriers(prev =>
            prev.map(c =>
                c.id === courrierId
                    ? { ...c, validationStatus: decision ? 'approved' : 'rejected', validationComment: comment }
                    : c
            )
        );
        setValidationDialogOpen(false);
        setSnackbar({
            open: true,
            message: `Courrier ${decision ? 'validé' : 'refusé'} avec succès`,
            severity: 'success'
        });
    };

    // PDF viewer handlers
    const handleViewPDF = (courrier) => {
        setSelectedCourrier(courrier);
        setVersionToShow('V1');
        setPdfViewerOpen(true);
    };

    const stats = {
        total: pendingCourriers.length,
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

            <PageHeader>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
                    Validation des courriers
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Liste des courriers en attente de validation par le responsable
                    </Typography>
                    <Chip
                        label={`${stats.total} en attente`}
                        sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.dark, fontWeight: 600 }}
                    />
                </Box>
            </PageHeader>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard>
                        <CardContent>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>En attente</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.dark }}>{stats.total}</Typography>
                        </CardContent>
                    </StatCard>
                </Grid>
            </Grid>

            {pendingCourriers.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                        Aucun courrier en attente de validation
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchPendingCourriers}
                        sx={{ mt: 2 }}
                    >
                        Rafraîchir
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {pendingCourriers.map(courrier => (
                        <Grid key={courrier.id} size={{ xs: 12, md: 6 }}>
                            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 1 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {courrier.id} - {courrier.sujet}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                                {courrier.type === 'entrant' ? 'Expéditeur' : 'Destinataire'} : {courrier.expediteur || courrier.destinataire}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                                Assigné à : {courrier.assigneA}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                <Chip
                                                    label="En attente de validation"
                                                    sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.dark, fontWeight: 600, fontSize: '0.75rem', height: 28, borderRadius: 40 }}
                                                />
                                                <Chip label={courrier.type === 'entrant' ? 'Entrant' : 'Sortant'} size="small" variant="outlined" />
                                            </Box>
                                        </Box>
                                        <Tooltip title="Voir le PDF">
                                            <IconButton size="small" onClick={() => handleViewPDF(courrier)} sx={{ color: 'primary.main' }}>
                                                <PdfIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<CheckCircleIcon />}
                                            onClick={() => handleValidation(courrier)}
                                            sx={{ borderRadius: 40, textTransform: 'none' }}
                                        >
                                            Valider
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<CancelIcon />}
                                            onClick={() => handleValidation(courrier)}
                                            sx={{ borderRadius: 40, textTransform: 'none' }}
                                        >
                                            Refuser
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Validation Dialog */}
            <ValidationDialog
                open={validationDialogOpen}
                onClose={() => setValidationDialogOpen(false)}
                courrier={selectedCourrier}
                onConfirm={handleValidate}
            />

            {/* PDF Viewer Dialog (same as IncomingMail) */}
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
                            />
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
}