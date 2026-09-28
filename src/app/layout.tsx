import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heuristic Hackers | Predictive Risk Governance | SIH 2026",
  description:
    "AI-Powered Early Warning and Decision Support Platform for Government Infrastructure Projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}