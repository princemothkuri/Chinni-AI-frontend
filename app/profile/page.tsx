"use client";

import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileActions } from "@/components/profile/profile-actions";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

export default function ProfilePage() {
  const { firstName, lastName, email, username } = useSelector(
    (state: RootState) => state.chinniMain
  );
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileHeader />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <ProfileCard initialProfileData={{ firstName, lastName, email, username }} />
            <ProfileActions />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
