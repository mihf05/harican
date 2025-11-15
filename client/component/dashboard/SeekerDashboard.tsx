"use client";

import { useState, useMemo } from "react";
import { Button } from "@/component/ui/button";
import { 
  Briefcase, BookOpen, TrendingUp, MapPin, Target, Award, 
  ExternalLink, CheckCircle2, ChevronRight, Zap, GraduationCap, User, Building, Users
} from "lucide-react";
import Link from "next/link";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import DashboardAISuggestions from "../DashboardAISuggestions";
import RoadmapGenerator from "../RoadmapGenerator";

interface SeekerDashboardProps {
  data: any;
}

export function SeekerDashboard({ data }: SeekerDashboardProps) {
  // Transform user skills into chart data
  const skillsData = useMemo(() => {
    if (!data.user.skills || data.user.skills.length === 0) return [];
    
    return data.user.skills.map((skill: any) => ({
      name: skill.skillName,
      level: skill.level === 'Advanced' ? 90 : skill.level === 'Intermediate' ? 70 : 50
    }));
  }, [data.user.skills]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section with Gradient */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Zap className="h-10 w-10" />
              Welcome back, {data.user.fullName}!
            </h1>
            <p className="text-blue-100 text-lg">
              Here's what's happening with your career journey 🚀
            </p>
          </div>
        </div>

        {/* Local Context & Real Impact Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                Local Opportunities & Impact
              </h2>
              <div className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                SDG 8: Decent Work & Economic Growth
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Government Programs */}
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Building className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold">Government Programs</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Skill India Mission:</span> Free training programs
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">PMKVY:</span> 1.4 lakh seats available
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">NSDC:</span> Sector skill councils
                  </div>
                </div>
              </div>

              {/* Local Job Boards */}
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold">Local Job Boards</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Naukri.com:</span> 50k+ local jobs
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Indeed India:</span> Entry-level positions
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Local Startups:</span> Growing opportunities
                  </div>
                </div>
              </div>

              {/* Disadvantaged Groups Support */}
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold">Support Programs</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Women Empowerment:</span> 30% reservations
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">SC/ST Initiatives:</span> Special training programs
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Rural Youth:</span> Skill development schemes
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Regional Focus Areas</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg">15k+</div>
                      <div>Jobs in Maharashtra</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">8k+</div>
                      <div>Jobs in Karnataka</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">12k+</div>
                      <div>Jobs in Tamil Nadu</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">6k+</div>
                      <div>Jobs in Delhi NCR</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90 mb-2">Economic Impact</div>
                  <div className="text-2xl font-bold">₹2.1L Cr</div>
                  <div className="text-sm opacity-90">Annual wage potential</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-blue-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalJobs}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> Available positions
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
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Matched Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.matchedJob}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <Target className="h-3 w-3" /> Perfect matches
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <Target className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-purple-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Your Skills</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.totalSkill}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                  <Award className="h-3 w-3" /> Keep learning!
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                <Award className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-400 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Remote Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.stats?.remoteJobs || 0}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Work from anywhere
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                <MapPin className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Skills Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Your Skills
            </h3>
            {skillsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={skillsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="level" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Proficiency" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px]">
                <Award className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No skills added yet</p>
                <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full">
                  <Link href="/profile">Add Your Skills</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Summary - Modern Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              Your Profile
            </h2>
            <Button asChild variant="outline" size="sm" className="rounded-full hover:shadow-lg transition-all">
              <Link href="/profile">
                Edit Profile <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </span>
              <p className="font-semibold text-lg">{data.user.educationLevel || 'Not specified'}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4" />
                Experience
              </span>
              <p className="font-semibold text-lg">{data.user.experienceLevel || 'Not specified'}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                Career Track
              </span>
              <p className="font-semibold text-lg">{data.user.preferredCareerTrack || 'Not specified'}</p>
            </div>
          </div>
          {data.user.skills && data.user.skills.length > 0 && (
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Your Skills
              </span>
                <div className="flex flex-wrap gap-2">
                {data.user.skills.map((skill: any) => (
                  <span
                  key={skill.id}
                  className="px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-black dark:text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all hover:scale-105"
                  >
                  {skill.skillName}
                  </span>
                ))}
                </div>
            </div>
          )}
        </div>

        {/* AI-Powered Suggestions Section - Replaces Recent Activity */}
        <div className="mb-8">
          <DashboardAISuggestions />
        </div>

        {/* Quick Actions Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <h3 className="text-xl font-bold mb-4">🚀 Accelerate Your Career</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-blue-100 mb-3">
                Get a personalized, AI-powered roadmap to achieve your dream career in just a few clicks!
              </p>
              <ul className="text-sm text-blue-100 space-y-1 mb-4">
                <li>• Step-by-step learning path</li>
                <li>• Skill recommendations</li>
                <li>• Project ideas & resources</li>
                <li>• Career advice from AI</li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <RoadmapGenerator 
                trigger={
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all font-semibold">
                    Generate My Roadmap
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommended Jobs - Enhanced */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                Recommended Jobs
              </h2>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/jobs">
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {data.recommendedJobs && data.recommendedJobs.length > 0 ? (
              <div className="space-y-4">
                {data.recommendedJobs.slice(0, 3).map((job: any) => (
                  <div key={job.id} className="group border dark:border-gray-700 rounded-xl p-4 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                        <Briefcase className="h-3 w-3" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                    </div>
                    {job.matchReason && (
                      <p className="text-xs text-green-600 dark:text-green-400 mb-3 flex items-center gap-1 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                        <CheckCircle2 className="h-3 w-3" />
                        {job.matchReason}
                      </p>
                    )}
                    <Button asChild size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg">
                      <Link href={`/jobs`}>View Details</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-10 w-10 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">No job recommendations yet</p>
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full">
                  <Link href="/profile">Add Skills to Get Recommendations</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Recommended Resources - Enhanced */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                Learning Resources
              </h2>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/resources">
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {data.recommendedResources && data.recommendedResources.length > 0 ? (
              <div className="space-y-4">
                {data.recommendedResources.slice(0, 3).map((resource: any) => (
                  <div key={resource.id} className="group border dark:border-gray-700 rounded-xl p-4 hover:shadow-lg hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {resource.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">{resource.platform}</span>
                      {resource.costType === 'Free' && (
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-xs font-bold shadow-md">
                          FREE
                        </span>
                      )}
                    </div>
                    {resource.matchReason && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                        <CheckCircle2 className="h-3 w-3" />
                        {resource.matchReason}
                      </p>
                    )}
                    <Button asChild size="sm" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        View Resource <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">No resource recommendations yet</p>
                <Button asChild size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full">
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
