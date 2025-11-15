import { Users, Eye, Calendar, Award, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/component/ui/button";

interface ApplicationsStatsProps {
  stats: {
    total: number;
    pending: number;
    reviewed: number;
    interviewScheduled: number;
    hired: number;
    rejected: number;
  };
}

export function ApplicationsStats({ stats }: ApplicationsStatsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Applications
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage candidate applications
            </p>
          </div>
        </div>
        <Link href="/applications">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            View All
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Reviewed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.reviewed}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Interviews</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.interviewScheduled}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Hired</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.hired}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4 border border-red-200 dark:border-red-700">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
        </div>
      </div>
    </div>
  );
}
