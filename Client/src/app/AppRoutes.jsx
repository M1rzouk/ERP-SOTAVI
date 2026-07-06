import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoadingFallback from './../shared/components/LoadingFallback';

// Lazy loading des pages
const Dashboard = lazy(() => import('./../features/dashboard/pages/Dashboard'));
const IncomingMail = lazy(() => import('./../features/Registry office/pages/IncomingMail/IncomingMail'));
const OutGoingMail = lazy(() => import('./../features/Registry office/pages/OutgoingMail/OutgoingMail'));
const EggProduction = lazy(() => import('./../features/production/pages/EggProduction/EggProduction'));
const ProductionHistory = lazy(() => import('./../features/production/pages/EggProduction/ProductionHistory'));
const MortalityHistory = lazy(() => import('./../features/production/pages/Mortality/MortalityHistory'));
const ApplicationSettings = lazy(() => import('./../features/settings/pages/ApplicationSettings'));
const Profile = lazy(() => import('../features/Profile/Pages/Profile'));
const Mortality = lazy(() => import('./../features/production/pages/Mortality/Mortality'));
const Dossiers = lazy(() => import('./../features/Registry office/Pages/Dossiers/Dossiers'));
const Validation = lazy(() => import('./../features/Registry office/pages/validation/Validation'));
const Statistics = lazy(() => import('./../features/Registry office/pages/statistics/Statistics'));
const AdminUsers = lazy(() => import('./../features/Admin/pages/AdminUsers'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Routes avec layout principal */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="Courrier Entrant" element={<IncomingMail />} />
          <Route path="Courrier Sortant" element={<OutGoingMail />} />
          <Route path="Ouef Production" element={<EggProduction />} />
          <Route path="Historique des Productions" element={<ProductionHistory />} />
          <Route path="Mortalite" element={<Mortality />} />
          <Route path="Historique des Mortalité" element={<MortalityHistory />} />
          <Route path="paramètres" element={<ApplicationSettings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="dossiers" element={<Dossiers />} />
          <Route path="validation" element={<Validation />} />
          <Route path="statistiques" element={<Statistics />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </Suspense>
  );
}