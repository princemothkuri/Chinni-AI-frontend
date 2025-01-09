"use client";

import { motion } from "framer-motion";
import { CheckSquare, Bell, Brain, Search, Image, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";

const features = [
  {
    icon: CheckSquare,
    title: "Task Manager",
    description:
      "Stay organized with smart notifications and intelligent task prioritization.",
    isUpcoming: false,
  },
  {
    icon: Bell,
    title: "Alarm Manager",
    description:
      "Set customizable alarms with sound options and flexible recurring schedules.",
    isUpcoming: false,
  },
  {
    icon: Brain,
    title: "Conversation Memory",
    description:
      "Experience personalized assistance with context-aware conversation history.",
    isUpcoming: false,
  },
  {
    icon: Search,
    title: "Real-time Search",
    description: "Access instant, relevant information from trusted sources.",
    isUpcoming: false,
  },
  {
    icon: Image,
    title: "Image Generator",
    description:
      "Create stunning visuals with our advanced AI-powered image generation.",
    isUpcoming: true,
  },
  {
    title: "Smart Email Assistant",
    description:
      "Compose, manage, and schedule emails with AI-powered suggestions and templates.",
    icon: Mail,
    isUpcoming: true,
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Powerful Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300">
                {feature.isUpcoming && (
                  <Badge className="absolute top-6 right-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white">
                    Upcoming
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="w-6 h-6 text-primary" />
                    <span>{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
