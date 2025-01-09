"use client";

import { CheckSquare, Bell, Brain, Search, Image, Mail } from "lucide-react";
import { FeatureCard } from "@/components/feature-card";

export function FeaturesSection() {
  const features = [
    {
      title: "Task Manager",
      description:
        "Stay organized with smart notifications and intelligent task prioritization.",
      icon: CheckSquare,
      isUpcoming: false,
    },
    {
      title: "Alarm Manager",
      description:
        "Set customizable alarms with sound options and flexible recurring schedules.",
      icon: Bell,
      isUpcoming: false,
    },
    {
      title: "Conversation Memory",
      description:
        "Experience personalized assistance with context-aware conversation history.",
      icon: Brain,
      isUpcoming: false,
    },
    {
      title: "Real-time Search",
      description: "Access instant, relevant information from trusted sources.",
      icon: Search,
      isUpcoming: false,
    },
    {
      title: "Image Generator",
      description:
        "Create stunning visuals with our advanced AI-powered image generation.",
      icon: Image,
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

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={index * 0.2} />
          ))}
        </div>
      </div>
    </section>
  );
}
