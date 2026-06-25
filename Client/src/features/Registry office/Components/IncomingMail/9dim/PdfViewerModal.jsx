import * as React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { saveAs } from 'file-saver';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '90%', md: '85%' },
  height: { xs: '90%', sm: '85vh', md: '90vh' },
  bgcolor: '#FFFFFF',
  borderRadius: 1,
  boxShadow: 24,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const PdfToolbar = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderBottom: '1px solid #F1F5F9',
  backgroundColor: '#FFFFFF',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

const PdfContent = styled(Box)({
  flex: 1,
  overflow: 'auto',
  backgroundColor: '#F8F9FA',
});

const PdfIframe = styled('iframe')({
  width: '100%',
  height: '100%',
  border: 'none',
  backgroundColor: '#F8F9FA',
});

// Générer un PDF à partir des données du courrier (solution locale)
const generateLocalPdfUrl = (courrier) => {
  // Créer le contenu HTML du PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Courrier ${courrier.id}</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 40px;
          color: #1E293B;
          background: white;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #FFC107;
          margin-bottom: 30px;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #FFC107;
        }
        .subtitle {
          font-size: 14px;
          color: #64748B;
          margin-top: 5px;
        }
        .title {
          font-size: 20px;
          font-weight: bold;
          margin: 30px 0 20px 0;
          color: #FFC107;
          text-align: center;
        }
        .info-card {
          background-color: #F8FAFC;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .info-row {
          margin: 12px 0;
          padding: 8px;
          border-bottom: 1px solid #E2E8F0;
        }
        .label {
          font-weight: bold;
          color: #64748B;
          width: 130px;
          display: inline-block;
        }
        .value {
          color: #1E293B;
          font-weight: 500;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 12px;
        }
        .status-encours { background-color: #FFF3E0; color: #ED6C02; }
        .status-traite { background-color: #E8F5E9; color: #2E7D32; }
        .status-attente { background-color: #FFEBEE; color: #D32F2F; }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 11px;
          color: #94A3B8;
          border-top: 1px solid #E2E8F0;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">📄 SOTAVI ERP</div>
        <div class="subtitle">Système de Gestion de Courrier</div>
      </div>
      
      <div class="title">Fiche de Courrier Entrant</div>
      
      <div class="info-card">
        <div class="info-row">
          <span class="label">N° Courrier :</span>
          <span class="value">${courrier.id}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Date :</span>
          <span class="value">${courrier.date}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Expéditeur :</span>
          <span class="value">${courrier.expediteur}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Sujet :</span>
          <span class="value">${courrier.sujet}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Assigné à :</span>
          <span class="value">${courrier.assigneA}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Statut :</span>
          <span class="value">
            <span class="status-badge status-${courrier.statut === 'En cours' ? 'encours' : courrier.statut === 'Traité' ? 'traite' : 'attente'}">
              ${courrier.statut}
            </span>
          </span>
        </div>
      </div>
      
      <div class="info-card">
        <div class="info-row">
          <span class="label">Date d'émission :</span>
          <span class="value">${new Date().toLocaleDateString('fr-FR')}</span>
        </div>
        <div class="info-row">
          <span class="label">Validé par :</span>
          <span class="value">Direction Générale</span>
        </div>
      </div>
      
      <div class="footer">
        Document généré par SOTAVI ERP le ${new Date().toLocaleString('fr-FR')}
      </div>
    </body>
    </html>
  `;

  // Convertir HTML en Blob
  const blob = new Blob([htmlContent], { type: 'text/html' });
  return URL.createObjectURL(blob);
};

export default function PdfViewerModal({ open, onClose, courrier }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [pdfUrl, setPdfUrl] = React.useState('');

  React.useEffect(() => {
    if (open && courrier) {
      setLoading(true);
      setError(null);
      
      try {
        // Générer le PDF localement
        const url = generateLocalPdfUrl(courrier);
        setPdfUrl(url);
        
        // Simuler un temps de chargement
        const timer = setTimeout(() => {
          setLoading(false);
        }, 800);
        
        return () => {
          clearTimeout(timer);
          if (url) URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error('Erreur de génération:', err);
        setError("Impossible de générer le PDF.");
        setLoading(false);
      }
    }
  }, [open, courrier]);

  const handleDownload = () => {
    if (pdfUrl) {
      // Télécharger le fichier HTML (convertir en .pdf côté serveur idéalement)
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `courrier_${courrier?.id}.html`;
      link.click();
      
      // Pour un vrai PDF, appelez votre API de conversion
      // fetch('/api/convert-to-pdf', { method: 'POST', body: JSON.stringify(courrier) })
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  if (!courrier) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <PdfToolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PictureAsPdfIcon sx={{ color: '#FFC107' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {courrier.id} - {courrier.expediteur}
            </Typography>
            <Chip
              label={courrier.statut}
              size="small"
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
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleDownload}
              sx={{ color: '#FFC107' }}
              size="small"
              title="Télécharger"
            >
              <DownloadIcon />
            </IconButton>
            <IconButton
              onClick={handleOpenInNewTab}
              sx={{ color: '#FFC107' }}
              size="small"
              title="Ouvrir dans un nouvel onglet"
            >
              <OpenInNewIcon />
            </IconButton>
            <IconButton
              onClick={onClose}
              sx={{ color: '#64748B' }}
              size="small"
              title="Fermer"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </PdfToolbar>

        <PdfContent>
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              gap: 2 
            }}>
              <CircularProgress sx={{ color: '#FFC107' }} />
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                Génération du document...
              </Typography>
            </Box>
          )}
          
          {error && !loading && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              gap: 2,
              p: 3,
              textAlign: 'center'
            }}>
              <PictureAsPdfIcon sx={{ fontSize: 64, color: '#FFC107', opacity: 0.5 }} />
              <Alert severity="error" sx={{ maxWidth: 500, mx: 'auto' }}>
                {error}
              </Alert>
              <Button
                variant="contained"
                onClick={handleOpenInNewTab}
                sx={{
                  bgcolor: '#FFC107',
                  color: '#1A1A1A',
                  borderRadius: 40,
                  mt: 2,
                  '&:hover': { bgcolor: '#FF8F00' },
                }}
              >
                OUVRIR LE DOCUMENT DANS UN NOUVEL ONGLET
              </Button>
            </Box>
          )}
          
          {!loading && !error && pdfUrl && (
            <PdfIframe
              src={pdfUrl}
              title={`Document ${courrier.id}`}
            />
          )}
        </PdfContent>
      </Box>
    </Modal>
  );
}