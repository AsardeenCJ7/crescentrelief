import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import CampaignsPage from "../pages/CampaignsPage";
import CampaignDetailPage from "../pages/CampaignDetailPage";
import ImpactPage from "../pages/ImpactPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import TermsPage from "../pages/TermsPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/campaigns" element={<CampaignsPage />} />
    <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
    <Route path="/impact" element={<ImpactPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
