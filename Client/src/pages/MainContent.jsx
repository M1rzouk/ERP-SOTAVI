import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { styled, alpha, useTheme } from '@mui/material/styles';

// Icons
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const projects = [
  { company: 'Material UI', members: 12, budget: '$2,400', completion: 85 },
  { company: 'Argon Design', members: 8, budget: '$1,800', completion: 60 },
  { company: 'Now UI Kit', members: 5, budget: '$950', completion: 40 },
];

const orders = [
  { title: '$2400, Design changes', date: '22 DEC 7:20 PM', change: '-12%' },
  { title: 'New order #1832412', date: '11 DEC 11 PM', change: '+24%' },
  { title: 'Server payments for April', date: '21 DEC 9:34 PM', change: '+8%' },
];

const drawerWidth = 260;


export default function MainContent() {
  const theme = useTheme();

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: theme.palette.background.paper, minHeight: '70vh', width: `100%` }}>      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          Welcome back, MARZOUK! Here's what's happening today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 1.5 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>Website Views</Typography>
                <ShowChartIcon sx={{ color: '#FFC107' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>24,983</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 500 }}>+15% </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}> vs last week</Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>campaign sent 2 days ago</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 1.5 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>Daily Sales</Typography>
                <TrendingUpIcon sx={{ color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>$3,429</Typography>
              <Chip label="+15% increase today" size="small" sx={{ bgcolor: theme.palette.background.default, color: theme.palette.primary.main, fontWeight: 500, mb: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>updated 4 min ago</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 1.5 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>Completed Tasks</Typography>
                <TaskAltIcon sx={{ color: '#FFC107' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>165</Typography>
              <LinearProgress variant="determinate" value={75} sx={{ mb: 1, height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#FFC107' } }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748B' }}>30 done this month</Typography>
                <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 500 }}>+24%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Projects Table + Orders Overview */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Projects</Typography>
                <Button size="small" startIcon={<AddIcon />} sx={{ color: '#FFC107' }}>Add Progress Track</Button>
              </Box>
              <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { bgcolor: '#F8FAFC', fontWeight: 600, color: '#1E293B', borderBottom: '1px solid #E2E8F0' } }}>
                      <TableCell>COMPANIES</TableCell>
                      <TableCell>MEMBERS</TableCell>
                      <TableCell>BUDGET</TableCell>
                      <TableCell>COMPLETION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((project, idx) => (
                      <TableRow key={idx} sx={{ '& td': { borderBottom: '1px solid #F1F5F9' } }}>
                        <TableCell sx={{ fontWeight: 500 }}>{project.company}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {[...Array(3)].map((_, i) => (
                              <Avatar key={i} sx={{ width: 24, height: 24, bgcolor: '#E2E8F0', fontSize: 12, color: '#1E293B' }}>
                                {String.fromCharCode(65 + i)}
                              </Avatar>
                            ))}
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>+{project.members - 3}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{project.budget}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress variant="determinate" value={project.completion} sx={{ width: 80, height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#FFC107' } }} />
                            <Typography variant="caption">{project.completion}%</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 1.5, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Orders overview</Typography>
                <ShoppingCartIcon sx={{ color: '#FFC107' }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>24%</Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>this month</Typography>
                <Chip label="+12%" size="small" sx={{ bgcolor: '#FEF9E6', color: '#FFC107' }} />
              </Box>
              {orders.map((order, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: idx !== orders.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 12 }} /> {order.date}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: order.change.includes('-') ? '#F44336' : '#10B981' }}>{order.change}</Typography>
                </Box>
              ))}
              <Button fullWidth variant="outlined" sx={{ mt: 2, borderColor: '#FFC107', color: '#FFC107', '&:hover': { borderColor: '#FFC107', bgcolor: '#FFF9E6' } }}>
                View all orders
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}