import Preloader from "../components/Preloader";
import HeroSection from "../components/Home/HeroSection";
import StatsBanner from "../components/Home/StatsBanner";
import FeaturesSection from "../components/Home/FeaturesSection";
import InstructionsPreview from "../components/Home/InstructionsPreview";
import DoctorCallout from "../components/Home/DoctorCallout";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Preloader />
      <HeroSection />
      <StatsBanner />
      <FeaturesSection />
      <InstructionsPreview />
      <DoctorCallout />
    </div>
  );
}
