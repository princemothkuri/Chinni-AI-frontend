"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegisterFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  setIsLoading,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
      isValid = false;
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-x-2 flex flex-row w-full">
        <div className="w-[50%]">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className={cn(
              "bg-background/50 backdrop-blur-sm",
              errors.firstName && "border-destructive"
            )}
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName}</p>
          )}
        </div>
        <div className="w-[50%]">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className={cn(
              "bg-background/50 backdrop-blur-sm",
              errors.lastName && "border-destructive"
            )}
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName}</p>
          )}
        </div>
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
            "bg-background/50 backdrop-blur-sm",
            errors.username && "border-destructive"
          )}
          disabled={isLoading}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={cn(
            "bg-background/50 backdrop-blur-sm",
            errors.email && "border-destructive"
          )}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className={cn(
              "bg-background/50 backdrop-blur-sm pr-10",
              errors.confirmPassword && "border-destructive"
            )}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showConfirmPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
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
            Creating Account...
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
            <span className="relative">Sign Up</span>
          </>
        )}
      </Button>
    </form>
  );
}
