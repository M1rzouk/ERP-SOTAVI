// src/features/statistics/pages/Statistics.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, Button,
  Paper, useTheme, alpha, Menu, MenuItem, IconButton, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Divider, Snackbar, Alert  // <-- Snackbar et Alert AJOUTÉS ici
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import {
  GetApp as GetAppIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ─── Données mockées (à remplacer par vos vraies données) ──────────────
const mockCourriersEntrants = [
  { id: 'CE-2026-001', date: '2026-05-02', expediteur: 'Ministère', statut: 'En cours', assigneA: 'Ahmed Benali' },
  { id: 'CE-2026-002', date: '2026-05-02', expediteur: 'Direction', statut: 'Traité', assigneA: 'Fatima Zahra' },
  { id: 'CE-2026-003', date: '2026-05-03', expediteur: 'Préfecture', statut: 'En attente', assigneA: 'Mohamed Larbi' },
  { id: 'CE-2026-004', date: '2026-05-10', expediteur: 'Ministère', statut: 'Traité', assigneA: 'Ahmed Benali' },
  { id: 'CE-2026-005', date: '2026-05-15', expediteur: 'Direction', statut: 'En cours', assigneA: 'Fatima Zahra' },
  { id: 'CE-2026-006', date: '2026-06-01', expediteur: 'Préfecture', statut: 'Traité', assigneA: 'Mohamed Larbi' },
  { id: 'CE-2026-007', date: '2026-06-05', expediteur: 'Ministère', statut: 'Traité', assigneA: 'Ahmed Benali' },
];

const mockCourriersSortants = [
  { id: 'CS-2026-001', date: '2026-05-02', expediteur: 'DG', destinataire: 'Ministère', statut: 'En cours', assigneA: 'Ahmed Benali' },
  { id: 'CS-2026-002', date: '2026-05-02', expediteur: 'Préfecture', destinataire: 'Service', statut: 'Traité', assigneA: 'Fatima Zahra' },
  { id: 'CS-2026-003', date: '2026-05-03', expediteur: 'Production', destinataire: 'Fournisseur', statut: 'En attente', assigneA: 'Mohamed Larbi' },
  { id: 'CS-2026-004', date: '2026-05-12', expediteur: 'DG', destinataire: 'Ministère', statut: 'Traité', assigneA: 'Ahmed Benali' },
  { id: 'CS-2026-005', date: '2026-05-20', expediteur: 'Préfecture', destinataire: 'Service', statut: 'En cours', assigneA: 'Fatima Zahra' },
];

// ─── Composant principal ──────────────────────────────────────────────────
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

const COLORS = ['#FFC107', '#4CAF50', '#F44336', '#2196F3', '#FF9800'];

export default function Statistics() {
  const theme = useTheme();
  const [courriersEntrants, setCourriersEntrants] = useState(mockCourriersEntrants);
  const [courriersSortants, setCourriersSortants] = useState(mockCourriersSortants);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ─── Calcul des statistiques ────────────────────────────────────────
  const tousCourriers = [...courriersEntrants, ...courriersSortants];
  const total = tousCourriers.length;
  const enCours = tousCourriers.filter(c => c.statut === 'En cours').length;
  const traite = tousCourriers.filter(c => c.statut === 'Traité').length;
  const enAttente = tousCourriers.filter(c => c.statut === 'En attente').length;

  // Par agent (nombre de courriers traités par agent)
  const agents = [...new Set(tousCourriers.map(c => c.assigneA))];
  const agentStats = agents.map(agent => ({
    agent,
    traites: tousCourriers.filter(c => c.assigneA === agent && c.statut === 'Traité').length,
    total: tousCourriers.filter(c => c.assigneA === agent).length,
  }));

  // Par mois (pour le graphique)
  const moisMap = {};
  tousCourriers.forEach(c => {
    const mois = c.date.substring(0, 7); // "2026-05"
    if (!moisMap[mois]) moisMap[mois] = { mois, entrants: 0, sortants: 0 };
    if (courriersEntrants.some(e => e.id === c.id)) moisMap[mois].entrants += 1;
    else moisMap[mois].sortants += 1;
  });
  const dataParMois = Object.values(moisMap).sort((a, b) => a.mois.localeCompare(b.mois));

  // Répartition par statut
  const statutData = [
    { name: 'En cours', value: enCours },
    { name: 'Traité', value: traite },
    { name: 'En attente', value: enAttente },
  ];

  // Répartition par type
  const typeData = [
    { name: 'Entrants', value: courriersEntrants.length },
    { name: 'Sortants', value: courriersSortants.length },
  ];

  // ─── Export PDF ───────────────────────────────────────────────────────
  const exportPDF = () => {
    const doc = new jsPDF('landscape');
    const primaryRgb = [255, 193, 7];

    // En-tête
    doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.rect(0, 0, 297, 30, 'F');
    doc.setTextColor(26, 26, 26);
    doc.setFontSize(18);
    doc.text('SOTAVI ERP - Rapport statistique', 148.5, 18, { align: 'center' });

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 40);

    // Tableau récapitulatif
    const tableData = [
      ['Indicateur', 'Valeur'],
      ['Total courriers', total],
      ['En cours', enCours],
      ['Traités', traite],
      ['En attente', enAttente],
      ['Entrants', courriersEntrants.length],
      ['Sortants', courriersSortants.length],
    ];

    autoTable(doc, {
      startY: 45,
      head: [['Indicateur', 'Valeur']],
      body: tableData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: primaryRgb, textColor: [26, 26, 26] },
    });

    // Tableau par agent
    const agentTableData = agentStats.map(a => [a.agent, a.total, a.traites]);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Agent', 'Total assignés', 'Traités']],
      body: agentTableData,
      theme: 'striped',
      headStyles: { fillColor: primaryRgb, textColor: [26, 26, 26] },
    });

    doc.save(`statistiques_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('Export PDF généré !', 'success');
    handleExportClose();
  };

  // ─── Export Excel ──────────────────────────────────────────────────────
  const exportExcel = () => {
    const wsData = [
      ['Indicateur', 'Valeur'],
      ['Total courriers', total],
      ['En cours', enCours],
      ['Traités', traite],
      ['En attente', enAttente],
      ['Entrants', courriersEntrants.length],
      ['Sortants', courriersSortants.length],
      [],
      ['Agent', 'Total assignés', 'Traités'],
      ...agentStats.map(a => [a.agent, a.total, a.traites]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Statistiques');
    XLSX.writeFile(wb, `statistiques_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('Export Excel généré !', 'success');
    handleExportClose();
  };

  const handleExportClick = (event) => setExportMenuAnchor(event.currentTarget);
  const handleExportClose = () => setExportMenuAnchor(null);
  const showNotification = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Snackbar */}
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
          Statistiques globales
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Vue d’ensemble des courriers entrants et sortants
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<GetAppIcon />}
              onClick={handleExportClick}
              sx={{ bgcolor: '#FFC107', color: '#1A1A1A', borderRadius: 40 }}
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
              <MenuItem onClick={exportPDF}>
                <PdfIcon sx={{ mr: 1, color: '#FFC107' }} /> PDF
              </MenuItem>
              <MenuItem onClick={exportExcel}>
                <ExcelIcon sx={{ mr: 1, color: '#FFC107' }} /> Excel
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </PageHeader>

      {/* Cartes récapitulatives */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Total courriers</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>{total}</Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>En cours</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.dark }}>{enCours}</Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Traités</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.dark }}>{traite}</Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>En attente</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.dark }}>{enAttente}</Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={4}>
        {/* Courriers par mois (barres) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Courriers par mois</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataParMois} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="entrants" fill="#FFC107" name="Entrants" />
                <Bar dataKey="sortants" fill="#4CAF50" name="Sortants" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Répartition par statut (camembert) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Répartition par statut</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {statutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Répartition par type (camembert) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Répartition par type</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Tableau des agents */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Performance des agents</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <TableCell sx={{ fontWeight: 700 }}>Agent</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Assignés</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Traités</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Taux</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agentStats.map(row => (
                    <TableRow key={row.agent}>
                      <TableCell>{row.agent}</TableCell>
                      <TableCell align="center">{row.total}</TableCell>
                      <TableCell align="center">{row.traites}</TableCell>
                      <TableCell align="center">
                        {row.total > 0 ? `${Math.round((row.traites / row.total) * 100)}%` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}