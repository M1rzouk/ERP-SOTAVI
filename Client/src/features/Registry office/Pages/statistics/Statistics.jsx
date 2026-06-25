// src/features/statistics/pages/Statistics.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, Button,
  Paper, useTheme, alpha, Menu, MenuItem, Avatar, LinearProgress,
  Fade, Grow, Zoom, Slide, IconButton, Tooltip,
  Snackbar, Alert,  // <-- AJOUTÉ : Snackbar et Alert
  FormControl, InputLabel, Select, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, Line,
  AreaChart, Area
} from 'recharts';
import {
  GetApp as GetAppIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Dashboard as DashboardIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ─── Keyframes pour animations ────────────────────────────────────
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

// ─── Données mockées (plus complètes) ──────────────────────────
const generateMockData = () => {
  const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const data = [];
  let cumulEntrants = 0;
  let cumulSortants = 0;
  
  for (let i = 0; i < 12; i++) {
    const entrants = Math.floor(Math.random() * 20) + 5;
    const sortants = Math.floor(Math.random() * 15) + 3;
    cumulEntrants += entrants;
    cumulSortants += sortants;
    data.push({
      mois: mois[i],
      entrants,
      sortants,
      cumulEntrants,
      cumulSortants,
      total: entrants + sortants,
      cumul: cumulEntrants + cumulSortants,
    });
  }
  return data;
};

const mockCourriersEntrants = [
  { id: 'CE-2026-001', date: '2026-05-02', expediteur: 'Ministère', statut: 'En cours', assigneA: 'Ahmed Benali', type: 'entrant' },
  { id: 'CE-2026-002', date: '2026-05-02', expediteur: 'Direction', statut: 'Traité', assigneA: 'Fatima Zahra', type: 'entrant' },
  { id: 'CE-2026-003', date: '2026-05-03', expediteur: 'Préfecture', statut: 'En attente', assigneA: 'Mohamed Larbi', type: 'entrant' },
  { id: 'CE-2026-004', date: '2026-05-10', expediteur: 'Ministère', statut: 'Traité', assigneA: 'Ahmed Benali', type: 'entrant' },
  { id: 'CE-2026-005', date: '2026-05-15', expediteur: 'Direction', statut: 'En cours', assigneA: 'Fatima Zahra', type: 'entrant' },
  { id: 'CE-2026-006', date: '2026-06-01', expediteur: 'Préfecture', statut: 'Traité', assigneA: 'Mohamed Larbi', type: 'entrant' },
  { id: 'CE-2026-007', date: '2026-06-05', expediteur: 'Ministère', statut: 'Traité', assigneA: 'Ahmed Benali', type: 'entrant' },
  { id: 'CE-2026-008', date: '2026-06-10', expediteur: 'Direction', statut: 'En cours', assigneA: 'Sofia Khelil', type: 'entrant' },
  { id: 'CE-2026-009', date: '2026-06-12', expediteur: 'Préfecture', statut: 'Traité', assigneA: 'Sofia Khelil', type: 'entrant' },
  { id: 'CE-2026-010', date: '2026-06-15', expediteur: 'Ministère', statut: 'Traité', assigneA: 'Ahmed Benali', type: 'entrant' },
  { id: 'CE-2026-011', date: '2026-06-18', expediteur: 'Direction', statut: 'En attente', assigneA: 'Fatima Zahra', type: 'entrant' },
  { id: 'CE-2026-012', date: '2026-06-20', expediteur: 'Préfecture', statut: 'Traité', assigneA: 'Mohamed Larbi', type: 'entrant' },
  { id: 'CE-2026-013', date: '2026-07-01', expediteur: 'Ministère', statut: 'En cours', assigneA: 'Ahmed Benali', type: 'entrant' },
  { id: 'CE-2026-014', date: '2026-07-05', expediteur: 'Direction', statut: 'Traité', assigneA: 'Sofia Khelil', type: 'entrant' },
];

const mockCourriersSortants = [
  { id: 'CS-2026-001', date: '2026-05-02', expediteur: 'DG', destinataire: 'Ministère', statut: 'En cours', assigneA: 'Ahmed Benali', type: 'sortant' },
  { id: 'CS-2026-002', date: '2026-05-02', expediteur: 'Préfecture', destinataire: 'Service', statut: 'Traité', assigneA: 'Fatima Zahra', type: 'sortant' },
  { id: 'CS-2026-003', date: '2026-05-03', expediteur: 'Production', destinataire: 'Fournisseur', statut: 'En attente', assigneA: 'Mohamed Larbi', type: 'sortant' },
  { id: 'CS-2026-004', date: '2026-05-12', expediteur: 'DG', destinataire: 'Ministère', statut: 'Traité', assigneA: 'Ahmed Benali', type: 'sortant' },
  { id: 'CS-2026-005', date: '2026-05-20', expediteur: 'Préfecture', destinataire: 'Service', statut: 'En cours', assigneA: 'Fatima Zahra', type: 'sortant' },
  { id: 'CS-2026-006', date: '2026-06-05', expediteur: 'DG', destinataire: 'Ministère', statut: 'Traité', assigneA: 'Sofia Khelil', type: 'sortant' },
  { id: 'CS-2026-007', date: '2026-06-15', expediteur: 'Préfecture', destinataire: 'Service', statut: 'Traité', assigneA: 'Ahmed Benali', type: 'sortant' },
  { id: 'CS-2026-008', date: '2026-07-02', expediteur: 'DG', destinataire: 'Ministère', statut: 'En cours', assigneA: 'Fatima Zahra', type: 'sortant' },
];

// ─── Composants stylisés ──────────────────────────────────────────
const AnimatedCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
    borderColor: theme.palette.primary.main,
  },
  '& .card-glow': {
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(255,193,7,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.6s ease',
  },
  '&:hover .card-glow': {
    opacity: 1,
  },
}));

const GlassPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  backdropFilter: 'blur(20px)',
  background: alpha(theme.palette.background.paper, 0.85),
  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease',
}));

const StatIconWrapper = styled(Avatar)(({ theme, color }) => ({
  width: 48,
  height: 48,
  borderRadius: 14,
  background: alpha(color || theme.palette.primary.main, 0.12),
  color: color || theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    fontSize: 24,
  },
}));

const GradientChip = styled(Chip)(({ theme, gradient }) => ({
  borderRadius: 20,
  fontWeight: 600,
  background: gradient || `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}05)`,
  border: 'none',
}));

// ─── Composant principal ──────────────────────────────────────────
export default function Statistics() {
  const theme = useTheme();
  const [courriersEntrants, setCourriersEntrants] = useState(mockCourriersEntrants);
  const [courriersSortants, setCourriersSortants] = useState(mockCourriersSortants);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [periodFilter, setPeriodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // ─── Calculs ──────────────────────────────────────────────────────
  const tousCourriers = [...courriersEntrants, ...courriersSortants];
  
  // Filtrage par période
  const getFilteredData = () => {
    let filtered = tousCourriers;
    if (periodFilter === 'month') {
      const now = new Date();
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filtered = filtered.filter(c => new Date(c.date) >= monthAgo);
    } else if (periodFilter === 'quarter') {
      const now = new Date();
      const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      filtered = filtered.filter(c => new Date(c.date) >= quarterAgo);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.statut === statusFilter);
    }
    return filtered;
  };

  const filteredData = getFilteredData();
  const total = filteredData.length;
  const enCours = filteredData.filter(c => c.statut === 'En cours').length;
  const traite = filteredData.filter(c => c.statut === 'Traité').length;
  const enAttente = filteredData.filter(c => c.statut === 'En attente').length;

  const tauxTraitement = total > 0 ? Math.round((traite / total) * 100) : 0;
  const tauxReussite = total > 0 ? Math.round(((traite + enCours) / total) * 100) : 0;

  // Par agent
  const agents = [...new Set(filteredData.map(c => c.assigneA))];
  const agentStats = agents.map(agent => ({
    agent,
    total: filteredData.filter(c => c.assigneA === agent).length,
    traites: filteredData.filter(c => c.assigneA === agent && c.statut === 'Traité').length,
    enCours: filteredData.filter(c => c.assigneA === agent && c.statut === 'En cours').length,
    enAttente: filteredData.filter(c => c.assigneA === agent && c.statut === 'En attente').length,
    taux: filteredData.filter(c => c.assigneA === agent).length > 0
      ? Math.round((filteredData.filter(c => c.assigneA === agent && c.statut === 'Traité').length / filteredData.filter(c => c.assigneA === agent).length) * 100)
      : 0,
  })).sort((a, b) => b.taux - a.taux);

  const meilleurAgent = agentStats.length > 0 ? agentStats[0] : null;

  // Évolution par mois
  const moisMap = {};
  filteredData.forEach(c => {
    const mois = c.date.substring(0, 7);
    if (!moisMap[mois]) moisMap[mois] = { mois, entrants: 0, sortants: 0, total: 0 };
    if (c.type === 'entrant') moisMap[mois].entrants += 1;
    else moisMap[mois].sortants += 1;
    moisMap[mois].total += 1;
  });
  
  const evolutionData = Object.values(moisMap)
    .sort((a, b) => a.mois.localeCompare(b.mois))
    .map((item, index, arr) => {
      let cumul = 0;
      for (let i = 0; i <= index; i++) cumul += arr[i].total;
      return { ...item, cumul };
    });

  // Répartition par statut
  const statutData = [
    { name: 'En cours', value: enCours, color: '#FFC107' },
    { name: 'Traité', value: traite, color: '#4CAF50' },
    { name: 'En attente', value: enAttente, color: '#F44336' },
  ].filter(item => item.value > 0);

  // Répartition par type
  const typeData = [
    { name: 'Entrants', value: filteredData.filter(c => c.type === 'entrant').length, color: '#FFC107' },
    { name: 'Sortants', value: filteredData.filter(c => c.type === 'sortant').length, color: '#4CAF50' },
  ].filter(item => item.value > 0);

  // Statistiques par jour (pour tendance)
  const today = new Date().toISOString().split('T')[0];
  const todayCount = filteredData.filter(c => c.date === today).length;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const yesterdayCount = filteredData.filter(c => c.date === yesterday).length;
  const trend = yesterdayCount > 0 ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100) : 0;

  // ─── Exports ──────────────────────────────────────────────────────
  const exportPDF = () => {
    const doc = new jsPDF('landscape');
    const primaryRgb = [255, 193, 7];

    doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.rect(0, 0, 297, 30, 'F');
    doc.setTextColor(26, 26, 26);
    doc.setFontSize(20);
    doc.text('SOTAVI ERP - Rapport statistique', 148.5, 18, { align: 'center' });

    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 40);
    doc.text(`Période: ${periodFilter === 'all' ? 'Tous' : periodFilter === 'month' ? 'Dernier mois' : 'Dernier trimestre'}`, 14, 48);

    autoTable(doc, {
      startY: 55,
      head: [['Indicateur', 'Valeur']],
      body: [
        ['Total courriers', total],
        ['En cours', enCours],
        ['Traités', traite],
        ['En attente', enAttente],
        ['Taux de traitement', `${tauxTraitement}%`],
        ['Entrants', filteredData.filter(c => c.type === 'entrant').length],
        ['Sortants', filteredData.filter(c => c.type === 'sortant').length],
        ['Meilleur agent', meilleurAgent ? `${meilleurAgent.agent} (${meilleurAgent.taux}%)` : 'N/A'],
      ],
      theme: 'striped',
      headStyles: { fillColor: primaryRgb, textColor: [26, 26, 26] },
      styles: { fontSize: 9 },
    });

    const agentTableData = agentStats.map(a => [a.agent, a.total, a.traites, `${a.taux}%`]);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Agent', 'Total assignés', 'Traités', 'Taux']],
      body: agentTableData,
      theme: 'striped',
      headStyles: { fillColor: primaryRgb, textColor: [26, 26, 26] },
      styles: { fontSize: 9 },
    });

    doc.save(`statistiques_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('📄 Export PDF généré avec succès !', 'success');
    handleExportClose();
  };

  const exportExcel = () => {
    const wsData = [
      ['RAPPORT STATISTIQUE SOTAVI ERP'],
      [`Généré le ${new Date().toLocaleDateString('fr-FR')}`],
      [`Période: ${periodFilter === 'all' ? 'Tous' : periodFilter === 'month' ? 'Dernier mois' : 'Dernier trimestre'}`],
      [],
      ['Indicateur', 'Valeur'],
      ['Total courriers', total],
      ['En cours', enCours],
      ['Traités', traite],
      ['En attente', enAttente],
      ['Taux de traitement', `${tauxTraitement}%`],
      ['Entrants', filteredData.filter(c => c.type === 'entrant').length],
      ['Sortants', filteredData.filter(c => c.type === 'sortant').length],
      ['Meilleur agent', meilleurAgent ? `${meilleurAgent.agent} (${meilleurAgent.taux}%)` : 'N/A'],
      [],
      ['Performance des agents'],
      ['Agent', 'Total assignés', 'Traités', 'En cours', 'En attente', 'Taux'],
      ...agentStats.map(a => [a.agent, a.total, a.traites, a.enCours, a.enAttente, `${a.taux}%`]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Statistiques');
    XLSX.writeFile(wb, `statistiques_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('📊 Export Excel généré avec succès !', 'success');
    handleExportClose();
  };

  const handleExportClick = (event) => setExportMenuAnchor(event.currentTarget);
  const handleExportClose = () => setExportMenuAnchor(null);
  const showNotification = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showNotification('🔄 Données actualisées avec succès', 'success');
    }, 1000);
  };

  const clearFilters = () => {
    setPeriodFilter('all');
    setStatusFilter('all');
    showNotification('🧹 Filtres réinitialisés', 'info');
  };

  // ─── Rendu ────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ─── EN-TÊTE ──────────────────────────────────────────────── */}
      <Slide direction="down" in mountOnEnter timeout={600}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <DashboardIcon sx={{ color: '#FFC107', fontSize: 36 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                  Tableau de bord
                </Typography>
                <GradientChip 
                  label="Statistiques" 
                  size="small" 
                  sx={{ 
                    bgcolor: '#FFC107', 
                    color: '#1A1A1A', 
                    fontWeight: 700,
                    ml: 1,
                    borderRadius: 2
                  }} 
                />
              </Box>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 0.5 }}>
                Vue d'ensemble de l'activité des courriers entrants et sortants
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon className={loading ? 'spin' : ''} />}
                onClick={handleRefresh}
                disabled={loading}
                sx={{ 
                  borderRadius: 12, 
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.primary,
                  '&:hover': { borderColor: '#FFC107', bgcolor: alpha('#FFC107', 0.05) }
                }}
              >
                {loading ? 'Chargement...' : 'Actualiser'}
              </Button>
              <Button
                variant="contained"
                startIcon={<GetAppIcon />}
                onClick={handleExportClick}
                sx={{ 
                  borderRadius: 12, 
                  bgcolor: '#FFC107', 
                  color: '#1A1A1A',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#FF8F00', transform: 'scale(1.02)' },
                  transition: 'all 0.2s ease'
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
                PaperProps={{ sx: { borderRadius: 3, mt: 1, minWidth: 200 } }}
              >
                <MenuItem onClick={exportPDF} sx={{ gap: 2, py: 1.5 }}>
                  <PdfIcon sx={{ color: '#F44336' }} /> 
                  <Box>
                    <Typography variant="body2" fontWeight={500}>Exporter en PDF</Typography>
                    <Typography variant="caption" color="text.secondary">Rapport complet</Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={exportExcel} sx={{ gap: 2, py: 1.5 }}>
                  <ExcelIcon sx={{ color: '#4CAF50' }} /> 
                  <Box>
                    <Typography variant="body2" fontWeight={500}>Exporter en Excel</Typography>
                    <Typography variant="caption" color="text.secondary">Données brutes</Typography>
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* ─── FILTRES ────────────────────────────────────────────── */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            mt: 3, 
            p: 2, 
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            alignItems: 'center'
          }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FilterIcon sx={{ fontSize: 16 }} /> Filtres :
            </Typography>
            
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Période</InputLabel>
              <Select
                value={periodFilter}
                label="Période"
                onChange={(e) => setPeriodFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="month">Dernier mois</MenuItem>
                <MenuItem value="quarter">Dernier trimestre</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                label="Statut"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="En cours">En cours</MenuItem>
                <MenuItem value="Traité">Traité</MenuItem>
                <MenuItem value="En attente">En attente</MenuItem>
              </Select>
            </FormControl>

            {(periodFilter !== 'all' || statusFilter !== 'all') && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                sx={{ borderRadius: 2, color: theme.palette.text.secondary }}
              >
                Réinitialiser
              </Button>
            )}

            <Box sx={{ flex: 1 }} />

            <GradientChip 
              label={`${filteredData.length} courriers`} 
              size="small"
              sx={{ bgcolor: alpha('#FFC107', 0.1), color: '#FFC107', fontWeight: 600 }}
            />
          </Box>
        </Box>
      </Slide>

      {/* ─── BADGE MEILLEUR AGENT ────────────────────────────────── */}
      {meilleurAgent && meilleurAgent.total > 0 && (
        <Zoom in timeout={500}>
          <Box sx={{ 
            mb: 4, 
            p: 2.5, 
            borderRadius: 3, 
            background: `linear-gradient(135deg, ${alpha('#FFC107', 0.12)}, ${alpha('#FFC107', 0.04)})`,
            border: `1px solid ${alpha('#FFC107', 0.2)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmojiEventsIcon sx={{ color: '#FFC107', fontSize: 36 }} />
              <Box>
                <Typography variant="body1" fontWeight={700}>
                  🏆 Meilleur agent : <Box component="span" sx={{ color: '#FFC107' }}>{meilleurAgent.agent}</Box>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {meilleurAgent.traites} courriers traités sur {meilleurAgent.total} assignés
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={`${meilleurAgent.taux}% de taux de traitement`} 
              sx={{ bgcolor: '#FFC107', color: '#1A1A1A', fontWeight: 700, borderRadius: 2, py: 2 }}
              icon={<StarIcon />}
            />
          </Box>
        </Zoom>
      )}

      {/* ─── KPI CARDS ────────────────────────────────────────────── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            label: 'Total courriers', 
            value: total, 
            icon: <EmailIcon />, 
            color: '#FFC107',
            trend: `${total > 0 ? '+' : ''}${total}`,
            trendUp: true,
            subtitle: `+${todayCount} aujourd'hui`
          },
          { 
            label: 'En cours', 
            value: enCours, 
            icon: <PendingIcon />, 
            color: '#FFC107',
            trend: `${total > 0 ? Math.round((enCours/total)*100) : 0}%`,
            trendUp: false,
            subtitle: `${enCours} en traitement`
          },
          { 
            label: 'Traités', 
            value: traite, 
            icon: <CheckCircleIcon />, 
            color: '#4CAF50',
            trend: `${tauxTraitement}%`,
            trendUp: true,
            subtitle: `Taux de traitement`
          },
          { 
            label: 'En attente', 
            value: enAttente, 
            icon: <CancelIcon />, 
            color: '#F44336',
            trend: `${total > 0 ? Math.round((enAttente/total)*100) : 0}%`,
            trendUp: false,
            subtitle: `${enAttente} en attente`
          },
        ].map((item, index) => (
          <Grid size={{ xs: 6, sm: 3 }} key={index}>
            <Grow in timeout={300 + index * 100}>
              <AnimatedCard>
                <Box className="card-glow" />
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.text.primary, mt: 0.5 }}>
                        {item.value}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        {item.trendUp ? (
                          <ArrowUpwardIcon sx={{ fontSize: 14, color: '#4CAF50' }} />
                        ) : (
                          <ArrowDownwardIcon sx={{ fontSize: 14, color: '#F44336' }} />
                        )}
                        <Typography variant="caption" sx={{ color: item.trendUp ? '#4CAF50' : '#F44336', fontWeight: 600 }}>
                          {item.trend}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">• {item.subtitle}</Typography>
                      </Box>
                    </Box>
                    <StatIconWrapper color={item.color}>
                      {item.icon}
                    </StatIconWrapper>
                  </Box>
                </CardContent>
              </AnimatedCard>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* ─── GRAPHIQUES ────────────────────────────────────────────── */}
      <Grid container spacing={4}>
        {/* Évolution */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Fade in timeout={400}>
            <GlassPaper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon sx={{ color: '#FFC107' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Évolution des courriers
                  </Typography>
                </Box>
                <GradientChip 
                  label={`${evolutionData.length} mois`} 
                  size="small"
                  sx={{ bgcolor: alpha('#FFC107', 0.1), color: '#FFC107' }}
                />
              </Box>
              <ResponsiveContainer width="100%" height={340}>
                <ComposedChart data={evolutionData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorEntrants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFC107" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FFC107" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorSortants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      borderRadius: 12,
                      border: 'none',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      padding: '12px 16px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="entrants" fill="url(#colorEntrants)" name="Entrants" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="sortants" fill="url(#colorSortants)" name="Sortants" radius={[6, 6, 0, 0]} />
                  <Line 
                    type="monotone" 
                    dataKey="cumul" 
                    stroke="#F44336" 
                    strokeWidth={3} 
                    name="Cumul" 
                    dot={{ fill: '#F44336', r: 6, strokeWidth: 0 }}
                    activeDot={{ r: 8, stroke: '#F44336', strokeWidth: 2, fill: '#fff' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </GlassPaper>
          </Fade>
        </Grid>

        {/* Répartition par statut */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Fade in timeout={600}>
            <GlassPaper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
                Répartition par statut
              </Typography>
              {statutData.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
                  <Typography color="text.secondary">Aucune donnée</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <defs>
                      {statutData.map((entry, index) => (
                        <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.5}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={statutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={105}
                      dataKey="value"
                      label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                      labelLine={{ strokeWidth: 1, strokeOpacity: 0.3 }}
                      paddingAngle={4}
                    >
                      {statutData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#grad-${index})`} 
                          stroke={theme.palette.background.paper} 
                          strokeWidth={3} 
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                {statutData.map(item => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 14, 
                      height: 14, 
                      borderRadius: '50%', 
                      background: `linear-gradient(135deg, ${item.color}, ${item.color}80)` 
                    }} />
                    <Typography variant="caption" fontWeight={500}>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">({item.value})</Typography>
                  </Box>
                ))}
              </Box>
            </GlassPaper>
          </Fade>
        </Grid>

        {/* Répartition par type */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Fade in timeout={700}>
            <GlassPaper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
                Répartition par type
              </Typography>
              {typeData.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
                  <Typography color="text.secondary">Aucune donnée</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                      labelLine={{ strokeWidth: 1 }}
                      paddingAngle={4}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke={theme.palette.background.paper} strokeWidth={3} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
                {typeData.map(item => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="caption" fontWeight={500}>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">({item.value})</Typography>
                  </Box>
                ))}
              </Box>
            </GlassPaper>
          </Fade>
        </Grid>

        {/* Performance des agents */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Fade in timeout={800}>
            <GlassPaper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon sx={{ color: '#FFC107' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Performance des agents
                  </Typography>
                </Box>
                <Chip 
                  label={`${agents.length} agents`} 
                  size="small" 
                  sx={{ bgcolor: alpha('#FFC107', 0.1), color: '#FFC107', fontWeight: 600 }}
                />
              </Box>
              {agentStats.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <Typography color="text.secondary">Aucun agent</Typography>
                </Box>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <Box component="thead">
                      <Box component="tr" sx={{ bgcolor: alpha('#FFC107', 0.06), borderRadius: 2 }}>
                        <Box component="th" sx={{ p: 1.5, textAlign: 'left', fontWeight: 700, fontSize: 12 }}>Agent</Box>
                        <Box component="th" sx={{ p: 1.5, textAlign: 'center', fontWeight: 700, fontSize: 12 }}>Taux</Box>
                        <Box component="th" sx={{ p: 1.5, textAlign: 'center', fontWeight: 700, fontSize: 12 }}>Progression</Box>
                      </Box>
                    </Box>
                    <Box component="tbody">
                      {agentStats.map((row, index) => (
                        <Box 
                          component="tr" 
                          key={row.agent} 
                          sx={{ 
                            transition: 'all 0.2s ease',
                            '&:hover': { bgcolor: alpha('#FFC107', 0.04) },
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                          }}
                        >
                          <Box component="td" sx={{ p: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar 
                                sx={{ 
                                  width: 30, 
                                  height: 30, 
                                  bgcolor: alpha('#FFC107', 0.15), 
                                  color: '#FFC107',
                                  fontWeight: 700,
                                  fontSize: 12
                                }}
                              >
                                {row.agent.charAt(0)}
                              </Avatar>
                              <Typography variant="body2" fontWeight={600} fontSize={13}>{row.agent}</Typography>
                              {index === 0 && row.taux > 0 && (
                                <StarIcon sx={{ color: '#FFC107', fontSize: 14 }} />
                              )}
                            </Box>
                          </Box>
                          <Box component="td" sx={{ p: 1.5, textAlign: 'center' }}>
                            <Chip
                              label={`${row.taux}%`}
                              size="small"
                              sx={{
                                bgcolor: row.taux >= 80 ? alpha('#4CAF50', 0.15) : row.taux >= 50 ? alpha('#FFC107', 0.15) : alpha('#F44336', 0.15),
                                color: row.taux >= 80 ? '#4CAF50' : row.taux >= 50 ? '#FFC107' : '#F44336',
                                fontWeight: 700,
                                borderRadius: 2,
                                height: 24,
                                fontSize: 11,
                              }}
                            />
                          </Box>
                          <Box component="td" sx={{ p: 1.5, minWidth: 100 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={row.taux}
                                sx={{
                                  flex: 1,
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 3,
                                    background: row.taux >= 80 
                                      ? 'linear-gradient(90deg, #66BB6A, #4CAF50)' 
                                      : row.taux >= 50 
                                        ? 'linear-gradient(90deg, #FFD54F, #FFC107)' 
                                        : 'linear-gradient(90deg, #EF5350, #F44336)',
                                  },
                                }}
                              />
                              <Typography variant="caption" fontWeight={600} sx={{ minWidth: 32, textAlign: 'right', fontSize: 11 }}>
                                {row.taux}%
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </GlassPaper>
          </Fade>
        </Grid>

        {/* Résumé rapide / tendances */}
        <Grid size={{ xs: 12, md: 12 }}>
          <Fade in timeout={900}>
            <GlassPaper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon sx={{ color: '#FFC107' }} />
                Résumé d'activité
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ p: 2, bgcolor: alpha('#FFC107', 0.05), borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Aujourd'hui</Typography>
                    <Typography variant="h5" fontWeight={700} color="#FFC107">{todayCount}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ p: 2, bgcolor: alpha('#4CAF50', 0.05), borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Hier</Typography>
                    <Typography variant="h5" fontWeight={700} color="#4CAF50">{yesterdayCount}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ p: 2, bgcolor: alpha('#2196F3', 0.05), borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Tendance</Typography>
                    <Typography variant="h5" fontWeight={700} color={trend >= 0 ? '#4CAF50' : '#F44336'}>
                      {trend >= 0 ? '+' : ''}{trend}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ p: 2, bgcolor: alpha('#FF9800', 0.05), borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Taux de réussite</Typography>
                    <Typography variant="h5" fontWeight={700} color="#FF9800">{tauxReussite}%</Typography>
                  </Box>
                </Grid>
              </Grid>
            </GlassPaper>
          </Fade>
        </Grid>
      </Grid>

      {/* CSS pour les animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </Box>
  );
}