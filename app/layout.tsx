import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import StoreProvider from "@/providers/StoreProvider";
import SocketProvider from "@/providers/SocketProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChinniAI - Your Personal AI Assistant",
  description:
    "ChinniAI is your intelligent companion for managing tasks, setting alarms, and staying productive with AI-powered assistance.",
  icons: {
    icon: "/favicon.ico", // Path relative to the public directory
  },
};

// Move viewport configuration to generateViewport
export const generateViewport = () => ({
  width: "device-width",
  initialScale: 1,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/_next/static/media/favicon.ico" type="image/x-icon" />
      </head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <StoreProvider>
          <SocketProvider>
            <Providers>
              <Header />
              <main>{children}</main>
              <Toaster />
            </Providers>
          </SocketProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
