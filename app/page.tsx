import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { ParticlesBackground } from "@/components/learn/particles-background";

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        <ParticlesBackground />
        <div className="relative z-10">
          <HeroSection />
          <FeaturesSection />
          <Footer />
        </div>
      </div>
    </>
  );
}
