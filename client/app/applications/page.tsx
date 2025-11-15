"use client";

import { ApplicationManagement } from "@/component/dashboard/ApplicationManagement";
import { ProtectedRoute } from "@/component/protected-route";

export default function ApplicationsPage() {
  return (
    <ProtectedRoute allowedRoles={["POSTER", "ADMIN"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ApplicationManagement showAllJobs={true} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
