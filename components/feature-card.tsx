"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./ui/badge";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
  isUpcoming: boolean;
}

export function FeatureCard({ title, description, icon: Icon, delay = 0, isUpcoming }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="relative bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300">
        {isUpcoming && (
          <Badge className="absolute top-1 right-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white" style={{ fontSize: "0.6rem", padding: "2px 5px", borderRadius: "20px 0px 0px 20px" }}>
            Upcoming
          </Badge>
        )}
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon className="w-6 h-6 text-primary" />
            <span>{title}</span>

          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}