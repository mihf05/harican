"use client";

import { Button } from "@/component/ui/button";
import { 
  Briefcase, BookOpen, TrendingUp, Users, Activity, 
  BarChart3, PieChart as PieChartIcon, Target, CheckCircle2, 
  Building, User
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, PieChart as RPieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

interface AdminDashboardProps {
  data: any;
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  // Mock data for admin charts
  const userGrowthData = [
    { month: 'Jan', seekers: 45, posters: 12 },
    { month: 'Feb', seekers: 58, posters: 18 },
    { month: 'Mar', seekers: 72, posters: 22 },
    { month: 'Apr', seekers: 89, posters: 28 },
    { month: 'May', seekers: 105, posters: 35 },
    { month: 'Jun', seekers: 128, posters: 42 },
  ];

  const jobStatsData = [
    { month: 'Jan', posted: 25, filled: 18 },
    { month: 'Feb', posted: 35, filled: 28 },
    { month: 'Mar', posted: 42, filled: 35 },
    { month: 'Apr', posted: 58, filled: 45 },
    { month: 'May', posted: 65, filled: 52 },
    { month: 'Jun', posted: 78, filled: 63 },
  ];

  const platformActivityData = [
    { name: 'Job Seekers', value: data.stats?.totalSeekers || 0 },
    { name: 'Job Posters', value: data.stats?.totalPosters || 0 },
    { name: 'Admins', value: (data.stats?.totalUsers || 0) - (data.stats?.totalSeekers || 0) - (data.stats?.totalPosters || 0) },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-pink-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Activity className="h-10 w-10" />
              Admin Dashboard
            </h1>
            <p className="text-purple-100 text-lg">
              Platform overview and management 🎯
            </p>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-blue-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalUsers || 0}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +15% this month
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-green-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Job Seekers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalSeekers || 0}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <User className="h-3 w-3" /> Active talent pool
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <User className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-purple-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Job Posters</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalPosters || 0}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                  <Building className="h-3 w-3" /> Companies hiring
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                <Building className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalJobs || 0}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> All postings
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-emerald-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.activeJobs || 0}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Currently open
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-pink-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Resources</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalResources || 0}
                </p>
                <p className="text-xs text-pink-600 dark:text-pink-400 mt-1 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> Learning materials
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              User Growth Trends
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorSeekers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPosters" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="seekers" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSeekers)" />
                <Area type="monotone" dataKey="posters" stroke="#10b981" fillOpacity={1} fill="url(#colorPosters)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Jobs Posted vs Filled */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Jobs Posted vs People Hired
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={jobStatsData}>
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
                <Bar dataKey="posted" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Jobs Posted" />
                <Bar dataKey="filled" fill="#10b981" radius={[8, 8, 0, 0]} name="People Hired" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Activity Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-green-600" />
              Platform User Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RPieChart>
                <Pie
                  data={platformActivityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformActivityData.map((entry, index) => (
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
              </RPieChart>
            </ResponsiveContainer>
          </div>

          {/* Success Rate */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Platform Success Rate
            </h3>
            <div className="text-center py-8">
              <div className="text-6xl font-bold mb-2">
                {((jobStatsData[jobStatsData.length - 1].filled / jobStatsData[jobStatsData.length - 1].posted) * 100).toFixed(0)}%
              </div>
              <p className="text-green-100 text-lg mb-4">Jobs Successfully Filled</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="text-2xl font-bold">{jobStatsData[jobStatsData.length - 1].posted}</div>
                  <div className="text-sm text-green-100">Total Posted</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="text-2xl font-bold">{jobStatsData[jobStatsData.length - 1].filled}</div>
                  <div className="text-sm text-green-100">People Hired</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              Recent Jobs
            </h2>
            {data.recentJobs && data.recentJobs.length > 0 ? (
              <div className="space-y-3">
                {data.recentJobs.map((job: any) => (
                  <div key={job.id} className="border dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <h3 className="font-semibold text-sm mb-1">{job.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      by {job.postedBy?.fullName || 'Unknown'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">No recent jobs</p>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              Recent Users
            </h2>
            {data.recentUsers && data.recentUsers.length > 0 ? (
              <div className="space-y-3">
                {data.recentUsers.map((user: any) => (
                  <div key={user.id} className="border dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <h3 className="font-semibold text-sm mb-1">{user.fullName}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded mr-2">
                        {user.role}
                      </span>
                      {user.email}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
