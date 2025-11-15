import { Briefcase, MapPin, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateJobDialog } from "../CreateJobDialog";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  isActive: boolean;
  createdAt?: string;
}

interface JobsListProps {
  jobs: Job[];
  onJobCreated?: () => void;
}

export function JobsList({ jobs, onJobCreated }: JobsListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Job Postings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage all your job listings
            </p>
          </div>
        </div>
        <CreateJobDialog onJobCreated={onJobCreated} />
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="group border dark:border-gray-700 rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-800/50 dark:to-gray-900 hover:scale-[1.01] cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          <MapPin className="h-3.5 w-3.5 text-blue-500" />
                          <span className="font-medium">{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          <Clock className="h-3.5 w-3.5 text-green-500" />
                          <span className="font-medium">{job.jobType}</span>
                        </span>
                        {job.createdAt && (
                          <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <Calendar className="h-3.5 w-3.5 text-purple-500" />
                            <span className="font-medium">
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <span className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all duration-300 flex items-center gap-2 whitespace-nowrap ml-4",
                  job.isActive 
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                )}>
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    job.isActive ? "bg-white animate-pulse" : "bg-gray-500"
                  )}></span>
                  {job.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Briefcase className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No jobs posted yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Start by posting your first job and connect with talented candidates from around the world
          </p>
          <CreateJobDialog onJobCreated={onJobCreated} />
        </div>
      )}
    </div>
  );
}
