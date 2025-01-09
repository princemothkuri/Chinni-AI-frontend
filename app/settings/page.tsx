"use client";

import { motion } from "framer-motion";
import { SettingsHeader } from "@/components/settings/settings-header";
import { CustomInstructions } from "@/components/settings/custom-instructions";
import { ParticlesBackground } from "@/components/shared/particles-background";
import { Footer } from "@/components/footer";
import { CustomApiKey } from "@/components/settings/custom-api-key";

export default function SettingsPage() {
  return (
    <div className="min-h-screen pt-16 relative">
      <ParticlesBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <SettingsHeader />
          <CustomApiKey />
          {/* <CustomInstructions /> */}
        </motion.div>
      </div>
      <div className="w-full backdrop-blur-sm">
        <Footer />
      </div>
    </div>
  );
}
