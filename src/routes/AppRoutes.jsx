import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import CampaignsPage from "../pages/CampaignsPage";
import CampaignDetailPage from "../pages/CampaignDetailPage";
import ImpactPage from "../pages/ImpactPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import TermsPage from "../pages/TermsPage";
import DashboardPage from "../pages/DashboardPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCampaigns from "../pages/admin/AdminCampaigns";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminSettings from "../pages/admin/AdminSettings";
import SetupPassword from "../pages/admin/SetupPassword";
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = ({ darkMode, toggleDark }) => (
  <Routes>
    {/* Public Routes */}
    <Route element={<PublicLayout darkMode={darkMode} toggleDark={toggleDark} />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/campaigns" element={<CampaignsPage />} />
      <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
      <Route path="/impact" element={<ImpactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="/setup-password/:userId" element={<SetupPassword />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>

    {/* Admin Routes */}
    <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
      <Route path="/admin" element={<AdminLayout darkMode={darkMode} toggleDark={toggleDark} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="campaigns" element={<AdminCampaigns />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
