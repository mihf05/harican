"use client";

import { useEffect, useState } from "react";
import { applicationsAPI } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/component/protected-route";

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  interviewDate?: string;
  interviewNotes?: string;
  job: {
    id: string;
    title: string;
    company: string;
  };
}

export default function SeekerApplicationsPage() {
  return (
    <ProtectedRoute allowedRoles={["SEEKER"]}>
      <SeekerApplicationsContent />
    </ProtectedRoute>
  );
}

function SeekerApplicationsContent() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationsAPI.getAllMyApplications();
      if (response.success && response.data) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Job Applications</h1>
      {loading ? (
        <div>Loading...</div>
      ) : applications.length === 0 ? (
        <div>No applications found.</div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{app.job.title}</div>
                    <div className="text-sm text-gray-500">{app.job.company}</div>
                  </div>
                  <Badge>{app.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div>Applied At: {new Date(app.appliedAt).toLocaleString()}</div>
                {app.interviewDate && (
                  <div>Interview Date: {new Date(app.interviewDate).toLocaleString()}</div>
                )}
                {app.interviewNotes && (
                  <div>Notes: {app.interviewNotes}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
