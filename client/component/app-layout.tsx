"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import LandingNavbar from "@/component/landing-navbar";
import DashboardNavbar from "@/component/dashboard-navbar";
import { ProtectedRoute } from "@/component/protected-route";
import Footer from "@/component/footer";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/profile');
  const isLandingPage = pathname === '/';

  const isAuthPage = pathname.startsWith('/login') || 
                     pathname.startsWith('/signup') || 
                     pathname.startsWith('/forgot-password') ||
                     pathname.startsWith('/verify-email') ||
                     pathname.startsWith('/verify-otp');

  if (isLandingPage || isAuthPage) {
    return <>{children}</>;
  }

  if (isDashboardRoute) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
          <DashboardNavbar />
          <main className={pathname.startsWith('/dashboard') ? "max-w-screen-xl mx-auto px-4 py-8 flex-1" : "flex-1"}>
            {children}
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <LandingNavbar />
      <main className="pt-16 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
