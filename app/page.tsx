import IntroOverlay from "@/components/IntroOverlay";
import HeroSection from "@/components/sections/HeroSection";
import ExpertiseSection from "@/components/sections/ExpertiseSection";
import WorkSectionSlider from "@/components/sections/work/WorkSectionSlider";
import AboutSectionAlt from "@/components/sections/about/AboutSectionAlt";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <main>
        <HeroSection />
        <ExpertiseSection />
        <AboutSectionAlt />
        <WorkSectionSlider />
        <ExperienceSection />
        <ContactSection />
      </main>
    </>
  );
}
