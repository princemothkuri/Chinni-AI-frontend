"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LoginForm({
  onSubmit,
  isLoading,
  setIsLoading,
}: LoginFormProps) {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      identifier: "",
      password: "",
    };

    if (!formData.identifier) {
      newErrors.identifier = "Username or email is required";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">Username or Email</Label>
        <Input
          id="identifier"
          type="text"
          value={formData.identifier}
          onChange={(e) =>
            setFormData({ ...formData, identifier: e.target.value })
          }
          className={cn(
            "bg-background/50 backdrop-blur-sm",
            errors.identifier && "border-destructive"
          )}
          disabled={isLoading}
          placeholder="Enter your username or email"
        />
        {errors.identifier && (
          <p className="text-sm text-destructive">{errors.identifier}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={cn(
              "bg-background/50 backdrop-blur-sm pr-10",
              errors.password && "border-destructive"
            )}
            disabled={isLoading}
            placeholder="Enter your password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>
      <div className="flex flex-row justify-end">
        <Link
          href="/reset-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
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
            Logging in...
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
            <span className="relative">Login</span>
          </>
        )}
      </Button>
    </form>
  );
}
