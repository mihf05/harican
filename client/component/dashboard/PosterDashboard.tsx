"use client";

import { Briefcase, TrendingUp, FileText, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { dashboardAPI, applicationsAPI } from "@/lib/api";
import { WelcomeHeader } from "./poster/WelcomeHeader";
import { StatsCard } from "./poster/StatsCard";
import { JobPerformanceChart } from "./poster/JobPerformanceChart";
import { JobStatusChart } from "./poster/JobStatusChart";
import { JobsList } from "./poster/JobsList";
import { ApplicationsStats } from "./poster/ApplicationsStats";

interface PosterDashboardProps {
  data: any;
  onRefresh?: () => void;
}

export function PosterDashboard({ data, onRefresh }: PosterDashboardProps) {
  const [jobPerformanceData, setJobPerformanceData] = useState<Array<{ month: string; posted: number; active: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    interviewScheduled: 0,
    hired: 0,
    rejected: 0,
  });

  const handleJobCreated = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  useEffect(() => {
    const fetchTrendsData = async () => {
      try {
        const response = await dashboardAPI.getPosterJobTrends();

        if (response.success && response.data) {
          setJobPerformanceData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch poster trends data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchApplicationStats = async () => {
      try {
        const response = await applicationsAPI.getApplicationStats();
        if (response.success && response.data) {
          setApplicationStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch application stats:', error);
      }
    };

    fetchTrendsData();
    fetchApplicationStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <WelcomeHeader userName={data.user.fullName} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Posted"
            value={data.stats?.totalPosted || 0}
            subtitle="All time"
            icon={Briefcase}
            gradientFrom="from-blue-400"
            gradientTo="to-blue-600"
            hoverBorderColor="hover:border-blue-400"
            bgOpacityColor="bg-blue-500"
            textColor="text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            title="Active Jobs"
            value={data.stats?.activeJobs || 0}
            subtitle="Currently hiring"
            icon={CheckCircle2}
            gradientFrom="from-green-400"
            gradientTo="to-green-600"
            hoverBorderColor="hover:border-green-400"
            bgOpacityColor="bg-green-500"
            textColor="text-green-600 dark:text-green-400"
          />
          <StatsCard
            title="Inactive"
            value={data.stats?.inactiveJobs || 0}
            subtitle="Not hiring"
            icon={XCircle}
            gradientFrom="from-orange-400"
            gradientTo="to-orange-600"
            hoverBorderColor="hover:border-orange-400"
            bgOpacityColor="bg-orange-500"
            textColor="text-orange-600 dark:text-orange-400"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <JobPerformanceChart data={jobPerformanceData} loading={loading} />
          <JobStatusChart 
            activeJobs={data.stats?.activeJobs || 0}
            inactiveJobs={data.stats?.inactiveJobs || 0}
          />
        </div>

        {/* Applications Stats */}
        <ApplicationsStats stats={applicationStats} />

        {/* Jobs List */}
        <JobsList jobs={data.postedJobs} onJobCreated={handleJobCreated} />
      </div>
    </div>
  );
}
