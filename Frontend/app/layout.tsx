import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "MediCare Plus - Complete Hospital Management System",
  description:
    "Complete hospital management system with appointments, telemedicine, pharmacy, lab tests, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning prevents false hydration errors caused by browser
    // extensions (e.g. ColorZilla's `cz-shortcut-listen`, Grammarly) that inject
    // attributes into <html>/<body> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
