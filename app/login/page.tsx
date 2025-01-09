"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ParticlesBackground } from "@/components/shared/particles-background";
import { LoginForm } from "@/components/auth/login-form";
import { Footer } from "@/components/footer";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import {
  setProfile,
  setToken,
} from "@/lib/redux/features/chinniMain/chinniMainSlice";
import { toast } from "@/hooks/use-toast";
import { LoadingScreen } from "@/components/shared/loading-screen";

interface CustomTokenJwtPayload {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  image: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [chatInterfaceLoading, setChatInterfaceLoading] = useState(false);

  const dispatch = useDispatch();

  const handleLogin = async (data: any) => {
    try {
      setIsLoading(true);

      // Send login credentials to the backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        usernameOrEmail: data.identifier,
        password: data.password,
      });


      if (response.data?.status === 200) {
        if (response.data?.token) {
          setChatInterfaceLoading(true);
          dispatch(setToken(response.data?.token));

          const tokenDecoded = jwtDecode<CustomTokenJwtPayload>(
            response.data?.token
          );

          toast({
            title: "Success",
            description: "You have successfully logged in.",
          });

          // Save the token to localStorage or cookies (adjust based on your use case)
          dispatch(
            setProfile({
              firstName: tokenDecoded?.firstName || "",
              lastName: tokenDecoded?.lastName || "",
              email: tokenDecoded?.email || "",
              username: tokenDecoded?.username || "",
              image: tokenDecoded?.image || "",
            })
          );

          setTimeout(() => {
            router.push("/chat"); // Redirect to chat page
          }, 1000);

        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid credentials. Please try again.",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log("Error:", error);
      if (error.response.status === 401) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.response?.data?.detail ||
            "Invalid credentials. Please try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.response?.data?.error || "An error occurred during login.",
        });
      }
      setIsLoading(false);
    }
  };

  if (chatInterfaceLoading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] mt-16 relative flex items-center justify-center p-4">
        <ParticlesBackground />
        <div className="relative z-10 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card/50 backdrop-blur-sm border-2 rounded-xl p-6 md:p-8 space-y-6"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <Brain className="w-12 h-12 md:w-16 md:h-16 text-primary animate-pulse" />
            </motion.div>

            <div className="text-center space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Welcome Back to ChinniAI
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Your personal assistant is just a click away.
              </p>
            </div>

            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <div className="w-full backdrop-blur-sm">
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;
