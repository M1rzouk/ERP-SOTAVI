import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Dashboard from "./pages/MainContent";
import ApplicationSettings from "./pages/ApplicationSettings";
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TranslateIcon from '@mui/icons-material/Translate';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <DashboardIcon />,
    route: "/dashboard",
    element: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <TableChartIcon />,
    route: "/tables",
    element: <Home />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <ReceiptIcon />,
    route: "/billing",
    element: <Profile />,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <TranslateIcon />,
    route: "/rtl",
    element: <Home />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <NotificationsIcon />,
    route: "/notifications",
    element: <Profile />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <PersonIcon />,
    route: "/profile",
    element: <Home />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "signin",
    icon: <LoginIcon />,
    route: "/signin",
    element: <Profile />,
  },
  {
    type: "collapse",
    name: "Settings",
    key: "settings",
    icon: <SettingsIcon />,
    route: "/settings",
    element: <ApplicationSettings />,
  },
];

export default routes;