import * as React from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
    Divider,
    Chip,
    Button,
    Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SubjectIcon from '@mui/icons-material/Subject';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: '#FFFFFF',
    borderRadius: 1,
    boxShadow: 24,
    p: 3,
    maxHeight: '100vh',
    overflow: 'auto',
};

const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ color: '#FFC107', display: 'flex', alignItems: 'center' }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1E293B' }}>
                {value}
            </Typography>
        </Box>
    </Box>
);

export default function CourrierDetailsModal({ open, onClose, courrier, onViewPdf }) {
    if (!courrier) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
                        Détails du courrier
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: '#64748B' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {/* Contenu */}
                <InfoRow icon={<SubjectIcon />} label="N° Courrier" value={courrier.id} />
                <InfoRow icon={<CalendarTodayIcon />} label="Date" value={courrier.date} />
                <InfoRow icon={<PersonIcon />} label="Expéditeur" value={courrier.expediteur} />
                <InfoRow icon={<AssignmentIcon />} label="Sujet" value={courrier.sujet} />
                <InfoRow icon={<PersonIcon />} label="Assigné à" value={courrier.assigneA} />

                {/* Statut avec chip */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ color: '#FFC107', display: 'flex', alignItems: 'center' }}>
                        <AssignmentIcon />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                            Statut
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                            <Chip
                                label={courrier.statut}
                                sx={{
                                    bgcolor:
                                        courrier.statut === 'En cours'
                                            ? '#FFF3E0'
                                            : courrier.statut === 'Traité'
                                                ? '#E8F5E9'
                                                : '#FFEBEE',
                                    color:
                                        courrier.statut === 'En cours'
                                            ? '#ED6C02'
                                            : courrier.statut === 'Traité'
                                                ? '#2E7D32'
                                                : '#D32F2F',
                                    fontWeight: 600,
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Pièce jointe */}
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        mt: 2,
                        borderRadius: 2,
                        borderColor: '#F1F5F9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachFileIcon sx={{ color: '#FFC107' }} />
                        <Typography variant="body2">document_{courrier.id}.pdf</Typography>
                    </Box>
                    <Button
                        size="small"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => {
                            onClose();
                            onViewPdf();
                        }}
                        sx={{
                            color: '#FFC107',
                            '&:hover': { bgcolor: '#FFF9E6' },
                        }}
                    >
                        Voir le PDF
                    </Button>
                    <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => alert(`Téléchargement du fichier pour ${courrier.id}`)}
                        sx={{
                            color: '#FFC107',
                            '&:hover': { bgcolor: '#FFF9E6' },
                        }}
                    >
                        Télécharger
                    </Button>
                </Paper>

                {/* Bouton fermer */}
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        mt: 3,
                        bgcolor: '#FFC107',
                        color: '#1A1A1A',
                        borderRadius: 40,
                        '&:hover': { bgcolor: '#FF8F00' },
                    }}
                >
                    Fermer
                </Button>
            </Box>
        </Modal>
    );
}