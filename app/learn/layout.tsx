"use client";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If authenticated, render the children
  return <>{children}</>;
}
