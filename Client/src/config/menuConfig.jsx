/* ICONS */
import DashboardIcon from '@mui/icons-material/Dashboard';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import EggIcon from '@mui/icons-material/Egg';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { Folder as FolderIcon } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 

const menuConfig = [
  {
    type: "collapse",
    name: "Tableau de bord",
    key: "Tableau de bord",
    icon: <DashboardIcon />,
    route: "/",
    UserRole: ["All"]
  },
  {
    type: "collapse",
    name: "Courrier Entrant",
    key: "Courrier Entrant",
    icon: <MoveToInboxIcon />,
    route: "/Courrier Entrant",
    UserRole: ["Bureau d'ordre"]
  },
  {
    type: "collapse",
    name: "Courrier Sortant",
    key: "Courrier Sortant",
    icon: <OutboxIcon />,
    route: "/Courrier Sortant",
    UserRole: ["Bureau d'ordre"]
  },
  {
    type: "collapse",
    name: "dossiers",
    key: "dossiers",
    icon: <FolderIcon />,
    route: "/dossiers",
    UserRole: ["All"]
  },
  {
    type: "collapse",
    name: "Validation",
    key: "Validation",
    icon: <CheckCircleIcon />,
    route: "/validation",
    UserRole: ["pdg"]
  },
  {
    type: "collapse",
    name: "Production des œufs",
    key: "Production des œufs",
    icon: <EggIcon />,
    route: "/Ouef Production",
    UserRole: ["chef centre"]
  },
  {
    type: "collapse",
    name: "Historique des Productions",
    key: "Historique des Productions",
    icon: <HistoryIcon />,
    route: "/Historique des Productions",
    UserRole: ["chef centre"]
  },
  {
    type: "collapse",
    name: "Mortalité",
    key: "Mortalité",
    icon: <DangerousIcon />,
    route: "/Mortalite",
    UserRole: ["chef centre"]
  },
  {
    type: "collapse",
    name: "Historique des Mortalité",
    key: "Historique des Mortalité",
    icon: <HistoryIcon />,
    route: "/Historique des Mortalité",
    UserRole: ["chef centre"]
  },
  {
    type: "collapse",
    name: "Paramètres",
    key: "Paramètres",
    icon: <SettingsIcon />,
    route: "/paramètres",
    UserRole: ["All"]
  },
];

export default menuConfig;