import HeroSection from "../components/hero/HeroSection";
import LiveStatsSection from "../components/sections/LiveStatsSection";
import FeaturedCampaigns from "../components/sections/FeaturedCampaigns";
import HowItWorks from "../components/sections/HowItWorks";
import ImpactSection from "../components/sections/ImpactSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import VolunteerCTA from "../components/sections/VolunteerCTA";
import MonthlyDonorCTA from "../components/sections/MonthlyDonorCTA";
import PartnersSection from "../components/sections/PartnersSection";
import FAQSection from "../components/sections/FAQSection";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <LiveStatsSection />
      <FeaturedCampaigns />
      <HowItWorks />
      <ImpactSection />
      <MonthlyDonorCTA />
      <TestimonialsSection />
      <VolunteerCTA />
      <PartnersSection />
      <FAQSection />
    </>
  );
};

export default HomePage;
