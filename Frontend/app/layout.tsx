import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "MediCare Plus - Complete Hospital Management System",
  description:
    "Complete hospital management system with appointments, telemedicine, pharmacy, lab tests, and more.",
};

// Runs before hydration so the correct theme class is set on first paint —
// without this, the page would flash light mode before React mounts.
const themeInitScript = `(function(){try{var s=localStorage.getItem('medicare-theme');var t=s||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark'){document.documentElement.classList.add('dark');}document.documentElement.style.colorScheme=t;}catch(e){}})();`;

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
