"use client";

import AuthLoadingScreen from "@/components/shared/auth-loading-screen";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoggedIn } = useSelector((state: RootState) => state.chinniMain);
  const [load, setLoad] = useState(2);

  useEffect(() => {
    if (isLoggedIn) {
      setLoad(0);
    } else {
      setLoad(1);
    }
  }, []);

  if (load === 0) {
    router.push("/");
    return <AuthLoadingScreen />;
  } else if (load === 1) {
    return <>{children}</>;
  } else {
    return <AuthLoadingScreen />;
  }
}
