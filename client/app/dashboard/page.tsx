"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { dashboardAPI } from "@/lib/api";
import { SeekerDashboard } from "@/component/dashboard/SeekerDashboard";
import { PosterDashboard } from "@/component/dashboard/PosterDashboard";
import { AdminDashboard } from "@/component/dashboard/AdminDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getDashboard();
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render different dashboards based on role
  if (user?.role === 'ADMIN') {
    return <AdminDashboard data={dashboardData} />;
  } else if (user?.role === 'POSTER') {
    return <PosterDashboard data={dashboardData} onRefresh={fetchDashboard} />;
  } else {
    return <SeekerDashboard data={dashboardData} />;
  }
}
