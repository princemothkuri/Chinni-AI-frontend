"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    content:
      "ChinniAI has transformed how I organize my daily tasks. The smart notifications and AI-powered assistance are game-changers!",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    content:
      "The conversation memory feature is incredible. It remembers context from previous chats, making interactions feel natural and efficient.",
  },
  {
    name: "Emily Rodriguez",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    content:
      "As someone who works with visuals, the image generation capability has become an essential part of my creative process.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          What Our Users Say
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="object-cover"
                      />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
