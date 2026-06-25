import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Button, Divider, Tooltip, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Visibility as VisibilityIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';

const StatusChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.warning.main, 0.1),
  color: theme.palette.warning.dark,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 28,
  borderRadius: 40,
}));

export default function CourrierValidationCard({ courrier, onValidate }) {
  return (
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
              <StatusChip label="En attente de validation" />
              <Chip label={courrier.type === 'entrant' ? 'Entrant' : 'Sortant'} size="small" variant="outlined" />
            </Box>
          </Box>
          <Tooltip title="Voir détails">
            <IconButton size="small" sx={{ color: 'primary.main' }}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={onValidate}
            sx={{ borderRadius: 40, textTransform: 'none' }}
          >
            Valider
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={onValidate}
            sx={{ borderRadius: 40, textTransform: 'none' }}
          >
            Refuser
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}