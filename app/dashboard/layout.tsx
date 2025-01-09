"use client";

import AuthLoadingScreen from "@/components/shared/auth-loading-screen";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useSelector((state: RootState) => state.chinniMain);
  const router = useRouter();

  // If user is not signed in, redirect to the sign-in page
  if (!isLoggedIn) {
    router.push("/login");
    return <AuthLoadingScreen />;
  } else {
    // If authenticated, render the children
    return <>{children}</>;
  }
}
