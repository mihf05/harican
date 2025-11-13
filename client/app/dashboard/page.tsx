"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { dashboardAPI, jobsAPI, resourcesAPI, type Job, type LearningResource } from "@/lib/api";
import { ProtectedRoute } from "@/component/protected-route";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";
import { 
  Briefcase, BookOpen, TrendingUp, Users, MapPin, Star, 
  ExternalLink, Target, Award, Clock, Building, User,
  ChevronRight, Plus, FileText
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
    return <PosterDashboard data={dashboardData} />;
  } else {
    return <SeekerDashboard data={dashboardData} />;
  }
}

// Job Seeker Dashboard
function SeekerDashboard({ data }: { data: any }) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {data.user.fullName}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's what's happening with your career journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalJobs || 0}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Matched Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.matchedJobs || 0}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your Skills</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalSkills || 0}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Remote Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.remoteJobs || 0}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Profile
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/profile">
                Edit Profile <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Education:</span>
              <p className="font-medium">{data.user.educationLevel || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Experience:</span>
              <p className="font-medium">{data.user.experienceLevel || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Career Track:</span>
              <p className="font-medium">{data.user.preferredCareerTrack || 'Not specified'}</p>
            </div>
          </div>
          {data.user.skills && data.user.skills.length > 0 && (
            <div className="mt-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Skills:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.user.skills.map((skill: any) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommended Jobs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Recommended Jobs
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/jobs">
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {data.recommendedJobs && data.recommendedJobs.length > 0 ? (
              <div className="space-y-4">
                {data.recommendedJobs.slice(0, 3).map((job: any) => (
                  <div key={job.id} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                    </div>
                    {job.matchReason && (
                      <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                        ✓ {job.matchReason}
                      </p>
                    )}
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link href={`/jobs`}>View Details</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">No job recommendations yet</p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/profile">Add Skills to Get Recommendations</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Recommended Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Resources
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/resources">
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {data.recommendedResources && data.recommendedResources.length > 0 ? (
              <div className="space-y-4">
                {data.recommendedResources.slice(0, 3).map((resource: any) => (
                  <div key={resource.id} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {resource.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>{resource.platform}</span>
                      {resource.costType === 'Free' && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                          FREE
                        </span>
                      )}
                    </div>
                    {resource.matchReason && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                        ✓ {resource.matchReason}
                      </p>
                    )}
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        View Resource <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">No resource recommendations yet</p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/profile">Add Skills to Get Recommendations</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Job Poster Dashboard
function PosterDashboard({ data }: { data: any }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {data.user.fullName}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your job postings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Posted</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalPosted || 0}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.activeJobs || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.inactiveJobs || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Posted Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Your Job Postings
            </h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </div>

          {data.postedJobs && data.postedJobs.length > 0 ? (
            <div className="space-y-4">
              {data.postedJobs.map((job: any) => (
                <div key={job.id} className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      job.isActive 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    )}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No jobs posted yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start by posting your first job
              </p>
              <Button>
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

// Admin Dashboard
function AdminDashboard({ data }: { data: any }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Platform overview and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalUsers || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Job Seekers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalSeekers || 0}
                </p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Job Posters</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalPosters || 0}
                </p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalJobs || 0}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.activeJobs || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Resources</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalResources || 0}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Recent Jobs
            </h2>
            {data.recentJobs && data.recentJobs.length > 0 ? (
              <div className="space-y-3">
                {data.recentJobs.map((job: any) => (
                  <div key={job.id} className="border dark:border-gray-700 rounded p-3">
                    <h3 className="font-medium text-sm">{job.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      by {job.postedBy?.fullName || 'Unknown'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No recent jobs</p>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Users
            </h2>
            {data.recentUsers && data.recentUsers.length > 0 ? (
              <div className="space-y-3">
                {data.recentUsers.map((user: any) => (
                  <div key={user.id} className="border dark:border-gray-700 rounded p-3">
                    <h3 className="font-medium text-sm">{user.fullName}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {user.role} • {user.email}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
