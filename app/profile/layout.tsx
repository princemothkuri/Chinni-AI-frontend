"use client";

import { Footer } from "@/components/footer";
import AuthLoadingScreen from "@/components/shared/auth-loading-screen";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ChatLayout({
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
    return (
      <>
        {children}
        <div className="w-full backdrop-blur-sm">

          <Footer />
        </div>
      </>
    );
  }
}
