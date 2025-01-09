"use client";

import { motion } from "framer-motion";

export function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-2"
    >
      <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground text-lg">
        Manage your alarms and tasks efficiently
      </p>
    </motion.div>
  );
}
