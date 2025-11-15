"use client";
import React, { useState } from "react";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/component/ui/dialog";
import { 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Briefcase, 
  Filter,
  ExternalLink,
  DollarSign,
  X,
  Loader2
} from "lucide-react";
import { jobsAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const jobs = [
  {
    id: 1,
    title: "Junior Web Developer",
    company: "TechStart Bangladesh",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    experience: "Entry Level",
    salary: "৳25,000-35,000/month",
    requiredSkills: ["JavaScript", "React", "HTML", "CSS"],
    description: "Join our growing team to build modern web applications using React and Node.js.",
    posted: "2 days ago",
    applications: 45,
    remote: false,
  },
  {
    id: 2,
    title: "Digital Marketing Intern",
    company: "Growth Labs",
    location: "Remote",
    type: "Internship",
    experience: "Fresher",
    salary: "৳15,000-20,000/month",
    requiredSkills: ["Social Media", "Content Writing", "Analytics", "Communication"],
    description: "Learn digital marketing strategies while working on real campaigns for clients.",
    posted: "1 day ago",
    applications: 32,
    remote: true,
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "DataCorp Ltd",
    location: "Chittagong, Bangladesh",
    type: "Part-time",
    experience: "Junior",
    salary: "৳30,000-40,000/month",
    requiredSkills: ["Excel", "Python", "SQL", "Statistics"],
    description: "Analyze business data to provide insights and recommendations for decision making.",
    posted: "3 days ago",
    applications: 28,
    remote: false,
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "Design Studio Pro",
    location: "Sylhet, Bangladesh",
    type: "Freelance",
    experience: "Mid",
    salary: "৳500-800/hour",
    requiredSkills: ["Figma", "Adobe XD", "Photoshop", "User Research"],
    description: "Create beautiful and functional user interfaces for mobile and web applications.",
    posted: "5 days ago",
    applications: 52,
    remote: true,
  },
  {
    id: 5,
    title: "Content Writer",
    company: "Media House BD",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    experience: "Entry Level",
    salary: "৳20,000-25,000/month",
    requiredSkills: ["Writing", "SEO", "Research", "English"],
    description: "Write engaging content for websites, blogs, and social media platforms.",
    posted: "1 week ago",
    applications: 67,
    remote: false,
  },
];

export default function JobsPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const jobTypes = ["all", "Full-time", "Part-time", "Internship", "Freelance"];
  const experienceLevels = ["all", "Fresher", "Entry Level", "Junior", "Mid"];

  const filteredJobs = jobs
    .filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(job => 
      selectedType === "all" || job.type === selectedType
    )
    .filter(job => 
      selectedExperience === "all" || job.experience === selectedExperience
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.posted).getTime() - new Date(a.posted).getTime();
        case "applications":
          return b.applications - a.applications;
        default:
          return 0;
      }
    });

  const getMatchingSkills = (job: typeof jobs[0], userSkills: string[] = ["JavaScript", "Communication"]) => {
    return job.requiredSkills.filter(skill => 
      userSkills.some(userSkill => 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
  };

  const handleApplyToJob = async (jobId: number) => {
    if (!isAuthenticated) {
      setToastMessage("Please login to apply for jobs");
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setApplyingJobId(jobId);
    try {
      const response = await jobsAPI.applyToJob(jobId.toString());
      if (response.success) {
        setAppliedJobs(prev => new Set([...prev, jobId]));
        setToastMessage("Application submitted successfully!");
        setToastType("success");
      } else {
        setToastMessage(response.errors?.[0]?.message || "Failed to apply");
        setToastType("error");
      }
    } catch (error: any) {
      setToastMessage(error.message || "Failed to apply to job");
      setToastType("error");
    } finally {
      setApplyingJobId(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          toastType === "success" 
            ? "bg-green-500 text-white" 
            : "bg-red-500 text-white"
        }`}>
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Find Your Next Opportunity
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover jobs that match your skills and career goals. Start building your future today.
            </p>
          </div>
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2 items-center">
              <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              </div>
              
              {/* Mobile Filter Button */}
              <div className="md:hidden">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 px-4"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="h-5 w-5 text-gray-400" />
              </Button>
              </div>
              </div>
              
              {/* Desktop Filters */}
              <div className="hidden md:flex gap-4">
              <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
              {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </option>
              ))}
              </select>

              <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
              {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level === "all" ? "All Levels" : level}
              </option>
              ))}
              </select>

              <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
              <option value="recent">Most Recent</option>
              <option value="applications">Most Applied</option>
              </select>
              </div>
            </div>
            </div>

          {/* Filter Modal Dialog */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Job Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Experience Level
                  </label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => {
                      setSelectedExperience(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level === "all" ? "All Levels" : level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="applications">Most Applied</option>
                  </select>
                </div>

                {/* Apply Button */}
                <Button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Found {filteredJobs.length} jobs matching your criteria
            </p>
          </div>

          {/* Job Listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {filteredJobs.map((job) => {
              const matchingSkills = getMatchingSkills(job);
              return (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col"
                >
                  <div className="flex flex-col gap-4 h-full">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {job.title}
                          </h3>
                          <p className="text-lg text-blue-600 dark:text-blue-400 mb-2">
                            {job.company}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {job.remote && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Remote
                            </span>
                          )}
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {job.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.experience}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.posted}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {job.applications} applications
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {job.description}
                      </p>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Required Skills:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills.map((skill, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1 text-xs rounded-full ${
                                matchingSkills.includes(skill)
                                  ? "bg-green-100 text-green-800 border border-green-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {skill}
                              {matchingSkills.includes(skill) && " ✓"}
                            </span>
                          ))}
                        </div>
                        {matchingSkills.length > 0 && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ You match {matchingSkills.length} required skills
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button 
                        className={`w-full ${
                          appliedJobs.has(job.id)
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white`}
                        onClick={() => handleApplyToJob(job.id)}
                        disabled={applyingJobId === job.id || appliedJobs.has(job.id)}
                      >
                        {applyingJobId === job.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Applying...
                          </>
                        ) : appliedJobs.has(job.id) ? (
                          "✓ Applied"
                        ) : (
                          <>
                            Apply Now
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="w-full">
                        Save Job
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </div>
          )}
        
      </div>
    </div>
  );
}
