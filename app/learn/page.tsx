"use client";

import { LearnHero } from "@/components/learn/learn-hero";
import { FeatureShowcase } from "@/components/learn/feature-showcase";
import { InteractiveDemo } from "@/components/learn/interactive-demo";
import { Testimonials } from "@/components/learn/testimonials";
import { CallToAction } from "@/components/learn/call-to-action";
import { ParticlesBackground } from "@/components/learn/particles-background";
import { Footer } from "@/components/footer";

export default function LearnPage() {
  return (
    <div className="relative min-h-screen pt-16 overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <LearnHero />
        <FeatureShowcase />
        <InteractiveDemo />
        <Testimonials />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}
