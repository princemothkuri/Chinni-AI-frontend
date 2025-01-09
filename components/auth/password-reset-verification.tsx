"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface PasswordResetVerificationProps {
  onVerificationSuccess: (email: string) => void;
}

export function PasswordResetVerification({
  onVerificationSuccess,
}: PasswordResetVerificationProps) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      username: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check your input and try again.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const verifyReset = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password/verify`,
        {
          email: formData.email,
          username: formData.username,
        }
      );

      if (verifyReset?.data?.status === 200) {
        toast({
          title: "Verification Successful",
          description: "You can now reset your password.",
        });
        onVerificationSuccess(formData.email);
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "Invalid email or username combination.",
        });
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 404) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error?.response?.data?.detail ||
            "Invalid email or username combination.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "An error occurred during verification. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={cn(
            "bg-background/50",
            errors.email && "border-destructive"
          )}
          placeholder="Enter your email"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className={cn(
            "bg-background/50",
            errors.username && "border-destructive"
          )}
          placeholder="Enter your username"
          disabled={isLoading}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full relative group overflow-hidden"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 group-hover:opacity-100 opacity-0 transition-opacity"
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="relative">Verify Account</span>
          </>
        )}
      </Button>
    </form>
  );
}
