"use client";

import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";
import { 
  Briefcase, TrendingUp, FileText, CheckCircle2, XCircle, 
  Plus, MapPin, Clock, Activity, PieChart as PieChartIcon
} from "lucide-react";
import { 
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface PosterDashboardProps {
  data: any;
}

export function PosterDashboard({ data }: PosterDashboardProps) {
  // Mock data for charts
  const jobPerformanceData = [
    { month: 'Jan', posted: 5, active: 4 },
    { month: 'Feb', posted: 8, active: 7 },
    { month: 'Mar', posted: 6, active: 5 },
    { month: 'Apr', posted: 10, active: 9 },
    { month: 'May', posted: 7, active: 6 },
    { month: 'Jun', posted: 12, active: 11 },
  ];

  const jobStatusData = [
    { name: 'Active', value: data.stats?.activeJobs || 0 },
    { name: 'Inactive', value: data.stats?.inactiveJobs || 0 },
  ];

  const COLORS = ['#10b981', '#6b7280'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 dark:from-gray-950 dark:via-green-950 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Briefcase className="h-10 w-10" />
              Welcome, {data.user.fullName}!
            </h1>
            <p className="text-green-100 text-lg">
              Manage and track your job postings 📊
            </p>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-blue-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Total Posted</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalPosted || 0}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> All time
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-green-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.activeJobs || 0}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Currently hiring
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Inactive</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.inactiveJobs || 0}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Not hiring
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Job Posting Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Job Posting Trends
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={jobPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="posted" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Job Status Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-green-600" />
              Job Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={jobStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Posted Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              Your Job Postings
            </h2>
            <Button size="sm" className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </div>

          {data.postedJobs && data.postedJobs.length > 0 ? (
            <div className="space-y-4">
              {data.postedJobs.map((job: any) => (
                <div key={job.id} className="border dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                          <Clock className="h-3 w-3" />
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                    <span className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold shadow-md",
                      job.isActive 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    )}>
                      {job.isActive ? '✓ Active' : '○ Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No jobs posted yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by posting your first job and find talented candidates
              </p>
              <Button className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Job
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
