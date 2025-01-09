"use client";

import { motion } from "framer-motion";

export function ProfileHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-center"
    >
      <h1 className="text-4xl font-bold tracking-tight mb-2">My Profile</h1>
      <p className="text-muted-foreground">
        Manage your personal information and account settings
      </p>
    </motion.div>
  );
}
