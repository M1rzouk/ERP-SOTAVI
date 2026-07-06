// src/features/IncomingMail/components/ScanDocument.jsx
import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Snackbar,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  CloudUpload as UploadIcon,
  PictureAsPdf as PdfIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  FileCopy as FileCopyIcon,
  Image as ImageIcon,
  Scanner as ScannerIcon,
  Cached as CachedIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateRight as RotateRightIcon,
  Flip as FlipIcon,
  Crop as CropIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

// ─── Animations ────────────────────────────────────────────────
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.7; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─── Composants stylisés ──────────────────────────────────────
const DropZoneStyled = styled(Paper)(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : theme.palette.background.default,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  animation: isDragActive ? `${pulse} 1.5s ease-in-out infinite` : 'none',
}));

const PreviewCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  '& .preview-overlay': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    padding: theme.spacing(2),
    opacity: 0,
    transition: 'opacity 0.3s ease',
    color: '#fff',
  },
  '&:hover .preview-overlay': {
    opacity: 1,
  },
}));

const PageIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: alpha('#000', 0.6),
  color: '#fff',
  padding: theme.spacing(0.5, 2),
  borderRadius: 20,
  fontSize: '0.75rem',
  fontWeight: 600,
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s ease',
}));

// ─── Composant principal ──────────────────────────────────────
export default function ScanDocument({
  open,
  onClose,
  onSave,
  courrierId,
  version = 'V1',
  title = 'Scan de document',
}) {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [previewMode, setPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // État pour les métadonnées du scan
  const [scanMetadata, setScanMetadata] = useState({
    type: version,
    date: new Date().toISOString().split('T')[0],
    agent: 'Agent Saisie',
    observations: '',
    nombrePages: 0,
    qualite: 'bonne',
    format: 'PDF',
  });

  // ─── Gestion des fichiers ────────────────────────────────────
  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      showNotification('Veuillez sélectionner des fichiers PDF valides', 'error');
      return;
    }

    // Ajouter les nouveaux fichiers avec des métadonnées
    const newFiles = pdfFiles.map((file, index) => ({
      id: `page-${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadDate: new Date(),
      pageNumber: files.length + index + 1,
      status: 'uploaded',
      preview: true,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setScanMetadata(prev => ({
      ...prev,
      nombrePages: files.length + newFiles.length,
    }));

    showNotification(`${pdfFiles.length} fichier(s) ajouté(s) avec succès`, 'success');
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  // ─── Actions sur les fichiers ──────────────────────────────
  const handleRemoveFile = (fileId) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (currentPage >= files.length - 1) {
      setCurrentPage(Math.max(0, files.length - 2));
    }
    showNotification('Fichier supprimé', 'info');
  };

  const handleRemoveAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.url));
    setFiles([]);
    setCurrentPage(0);
    showNotification('Tous les fichiers ont été supprimés', 'info');
  };

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' 
      ? Math.min(currentPage + 1, files.length - 1)
      : Math.max(currentPage - 1, 0);
    setCurrentPage(newPage);
  };

  // ─── Contrôles d'image ──────────────────────────────────────
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleResetControls = () => {
    setZoom(1);
    setRotation(0);
  };

  // ─── Upload et validation ────────────────────────────────────
  const handleUpload = async () => {
    if (files.length === 0) {
      showNotification('Veuillez ajouter au moins un fichier', 'warning');
      return;
    }

    setUploading(true);
    setScanProgress(0);

    // Simuler l'upload progressif
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
    }

    setUploading(false);
    
    // Appeler la fonction de sauvegarde parente
    if (onSave) {
      onSave({
        version,
        files: files.map(f => f.file),
        metadata: scanMetadata,
        uploadedAt: new Date(),
      });
    }

    showNotification(`✅ ${version} scanné avec succès (${files.length} page(s))`, 'success');
    
    // Fermer le dialogue après un court délai
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    // Nettoyer les URLs
    files.forEach(f => URL.revokeObjectURL(f.url));
    setFiles([]);
    setCurrentPage(0);
    setZoom(1);
    setRotation(0);
    setScanProgress(0);
    setUploading(false);
    onClose();
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // ─── Export PDF (pour l'impression) ─────────────────────────
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const currentFile = files[currentPage];
    if (currentFile && printWindow) {
      // Afficher un aperçu simple
      printWindow.document.write(`
        <html>
          <head><title>Document scanné - ${version}</title></head>
          <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh;">
            <embed src="${currentFile.url}" width="100%" height="100%" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // ─── Steps pour le processus de scan ──────────────────────
  const steps = [
    { 
      label: 'Préparation du scan', 
      description: 'Préparez les documents à scanner (Vérifiez l\'ordre des pages)',
      icon: <ScannerIcon />,
    },
    { 
      label: 'Scan des documents', 
      description: 'Scannez les documents ou importez les fichiers PDF/Images',
      icon: <UploadIcon />,
    },
    { 
      label: 'Vérification et validation', 
      description: 'Vérifiez la qualité du scan et validez',
      icon: <CheckCircleIcon />,
    },
  ];

  // ─── Rendu ──────────────────────────────────────────────────
  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isFullscreen}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ScannerIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
            <Chip 
              label={version}
              size="small"
              sx={{ 
                bgcolor: version === 'V1' ? '#FFC107' : '#4CAF50',
                color: '#fff',
                fontWeight: 700,
              }}
            />
            {courrierId && (
              <Chip 
                label={courrierId}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Plein écran">
              <IconButton 
                onClick={() => setIsFullscreen(!isFullscreen)}
                sx={{ color: theme.palette.text.secondary }}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
            <IconButton 
              onClick={handleClose}
              sx={{ color: theme.palette.text.secondary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3, bgcolor: theme.palette.background.default }}>
          <Grid container spacing={3}>
            {/* Steps / Guide */}
            <Grid size={{ xs: 12 }}>
              <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 3 }}>
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepButton onClick={() => setActiveStep(index)}>
                      <StepLabel StepIconComponent={() => (
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: index === activeStep ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
                          color: index === activeStep ? '#fff' : theme.palette.primary.main,
                        }}>
                          {step.icon}
                        </Box>
                      )}>
                        {step.label}
                      </StepLabel>
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </Grid>

            {/* Zone de drop */}
            <Grid size={{ xs: 12, md: files.length > 0 ? 6 : 12 }}>
              <DropZoneStyled
                {...getRootProps()}
                isDragActive={isDragActive}
                sx={{ 
                  minHeight: files.length > 0 ? 200 : 300,
                  animation: isDragActive ? `${pulse} 1.5s ease-in-out infinite` : 'none',
                }}
              >
                <input {...getInputProps()} ref={fileInputRef} />
                
                {files.length > 0 ? (
                  <Box>
                    <UploadIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="h6" color="text.primary">
                      {files.length} fichier(s) ajouté(s)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cliquez ou glissez-déposez pour ajouter d'autres fichiers
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
                      <Chip 
                        label={`${files.length} pages`}
                        size="small"
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                      />
                      <Chip 
                        label={`Total: ${(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(1)} MB`}
                        size="small"
                        sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <UploadIcon sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2, opacity: 0.7 }} />
                    <Typography variant="h6" color="text.primary">
                      Déposez vos fichiers ici
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Formats acceptés: PDF, JPG, PNG, TIFF (max 50MB)
                    </Typography>
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderRadius: 40,
                        '&:hover': { bgcolor: '#FF8F00' },
                      }}
                    >
                      Sélectionner les fichiers
                    </Button>
                  </Box>
                )}
              </DropZoneStyled>
            </Grid>

            {/* Prévisualisation */}
            {files.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <PreviewCard>
                  <Box sx={{ 
                    position: 'relative',
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.grey[900], 0.05),
                    overflow: 'hidden',
                  }}>
                    <Box
                      component="embed"
                      src={files[currentPage]?.url}
                      type="application/pdf"
                      sx={{
                        width: '100%',
                        height: '100%',
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        transition: 'all 0.3s ease',
                        objectFit: 'contain',
                      }}
                    />
                    
                    {/* Overlay avec contrôles */}
                    <Box 
                      className="preview-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        p: 2,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '&:hover': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <ControlButton size="small" onClick={handleZoomIn}>
                          <ZoomInIcon />
                        </ControlButton>
                        <ControlButton size="small" onClick={handleZoomOut}>
                          <ZoomOutIcon />
                        </ControlButton>
                        <ControlButton size="small" onClick={handleRotate}>
                          <RotateRightIcon />
                        </ControlButton>
                        <ControlButton size="small" onClick={handleResetControls}>
                          <CachedIcon />
                        </ControlButton>
                        <ControlButton size="small" onClick={() => setPreviewMode(!previewMode)}>
                          {previewMode ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </ControlButton>
                        <ControlButton size="small" onClick={handlePrint}>
                          <PrintIcon />
                        </ControlButton>
                      </Box>
                    </Box>

                    <PageIndicator>
                      {currentPage + 1} / {files.length}
                    </PageIndicator>

                    {/* Navigation */}
                    <IconButton
                      size="small"
                      onClick={() => handlePageChange('prev')}
                      disabled={currentPage === 0}
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: alpha('#000', 0.5),
                        color: '#fff',
                        '&:hover': { bgcolor: alpha('#000', 0.7) },
                        '&:disabled': { opacity: 0.3 },
                      }}
                    >
                      <PrevIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handlePageChange('next')}
                      disabled={currentPage === files.length - 1}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: alpha('#000', 0.5),
                        color: '#fff',
                        '&:hover': { bgcolor: alpha('#000', 0.7) },
                        '&:disabled': { opacity: 0.3 },
                      }}
                    >
                      <NextIcon />
                    </IconButton>
                  </Box>

                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {files[currentPage]?.name}
                      </Typography>
                      <Chip 
                        label={`Page ${currentPage + 1}/${files.length}`}
                        size="small"
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                      />
                      <Tooltip title="Supprimer cette page">
                        <IconButton 
                          size="small" 
                          onClick={() => handleRemoveFile(files[currentPage]?.id)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </PreviewCard>
              </Grid>
            )}

            {/* Métadonnées et progression */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <TextField
                        label="Observations"
                        size="small"
                        value={scanMetadata.observations}
                        onChange={(e) => setScanMetadata({ ...scanMetadata, observations: e.target.value })}
                        sx={{ flex: 1, minWidth: 200 }}
                      />
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Qualité</InputLabel>
                        <Select
                          value={scanMetadata.qualite}
                          label="Qualité"
                          onChange={(e) => setScanMetadata({ ...scanMetadata, qualite: e.target.value })}
                        >
                          <MenuItem value="excellente">Excellente</MenuItem>
                          <MenuItem value="bonne">Bonne</MenuItem>
                          <MenuItem value="moyenne">Moyenne</MenuItem>
                          <MenuItem value="faible">Faible</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {uploading && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Upload en cours... {scanProgress}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={scanProgress} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: theme.palette.primary.main,
                            },
                          }} 
                        />
                      </Box>
                    )}
                    {!uploading && files.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={handleRemoveAll}
                          sx={{ borderRadius: 40 }}
                        >
                          Tout supprimer
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<SaveIcon />}
                          onClick={handleUpload}
                          sx={{ 
                            borderRadius: 40,
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': { bgcolor: '#FF8F00' },
                          }}
                        >
                          Valider le scan
                        </Button>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Liste des pages */}
            {files.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Pages scannées ({files.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {files.map((file, index) => (
                    <Chip
                      key={file.id}
                      label={`Page ${index + 1}`}
                      onClick={() => setCurrentPage(index)}
                      onDelete={() => handleRemoveFile(file.id)}
                      sx={{
                        bgcolor: currentPage === index ? theme.palette.primary.main : 'transparent',
                        color: currentPage === index ? '#fff' : 'inherit',
                        '&:hover': {
                          bgcolor: currentPage === index ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
          <Button 
            onClick={handleClose}
            sx={{ borderRadius: 40 }}
          >
            Annuler
          </Button>
          {files.length > 0 && !uploading && (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleUpload}
              sx={{ 
                borderRadius: 40,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': { bgcolor: '#FF8F00' },
              }}
            >
              Sauvegarder et valider
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}