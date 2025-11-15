"use client";

import { useState, useEffect } from "react";
import { applicationsAPI } from "@/lib/api";
import { 
  Users, Mail, CheckCircle, XCircle, Clock, 
  Calendar, Eye, Send, Award, Filter, Search,
  UserCheck, FileText, Briefcase
} from "lucide-react";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/component/ui/dialog";

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  interviewDate?: string;
  interviewNotes?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    educationLevel?: string;
    experienceLevel?: string;
    bio?: string;
    cvText?: string;
    skills?: Array<{ skillName: string; level?: string }>;
  };
  job: {
    id: string;
    title: string;
    company: string;
  };
}

interface ApplicationManagementProps {
  jobId?: string;
  showAllJobs?: boolean;
}

export function ApplicationManagement({ jobId, showAllJobs = false }: ApplicationManagementProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Interview invitation form
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [jobId, showAllJobs]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let response;
      
      if (showAllJobs) {
        response = await applicationsAPI.getAllMyApplications();
        if (response.success && response.data) {
          // Flatten applications from all jobs
          const allApps: Application[] = [];
          response.data.forEach((job: any) => {
            job.jobApplications?.forEach((app: any) => {
              allApps.push({
                ...app,
                job: {
                  id: job.id,
                  title: job.title,
                  company: job.company,
                }
              });
            });
          });
          setApplications(allApps);
        }
      } else if (jobId) {
        response = await applicationsAPI.getJobApplications(jobId);
        if (response.success && response.data) {
          setApplications(response.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const response = await applicationsAPI.updateApplicationStatus(applicationId, {
        status: newStatus as any,
      });

      if (response.success) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleSendInterviewInvitation = async () => {
    if (!selectedApplication) return;

    setSending(true);
    try {
      const response = await applicationsAPI.sendInterviewInvitation(selectedApplication.id, {
        interviewDate,
        interviewNotes,
        subject: emailSubject,
        message: emailMessage,
      });

      if (response.success) {
        setShowInterviewDialog(false);
        fetchApplications();
        // Reset form
        setInterviewDate("");
        setInterviewNotes("");
        setEmailSubject("");
        setEmailMessage("");
      }
    } catch (error) {
      console.error("Failed to send interview invitation:", error);
    } finally {
      setSending(false);
    }
  };

  const openInterviewDialog = (application: Application) => {
    setSelectedApplication(application);
    setEmailSubject(`Interview Invitation - ${application.job?.title || 'Position'}`);
    setEmailMessage(`Dear ${application.user.fullName},\n\nWe are pleased to invite you for an interview for the position of ${application.job?.title || 'the position'} at ${application.job?.company || 'our company'}.\n\nPlease let us know your availability.\n\nBest regards`);
    setShowInterviewDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: Clock },
      REVIEWED: { color: "bg-blue-100 text-blue-800 border-blue-300", icon: Eye },
      INTERVIEW_SCHEDULED: { color: "bg-purple-100 text-purple-800 border-purple-300", icon: Calendar },
      HIRED: { color: "bg-green-100 text-green-800 border-green-300", icon: Award },
      REJECTED: { color: "bg-red-100 text-red-800 border-red-300", icon: XCircle },
      ACCEPTED: { color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  const filteredApplications = applications
    .filter(app => filterStatus === "all" || app.status === filterStatus)
    .filter(app => 
      app.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Applications Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name, email, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="HIRED">Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Applications Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || filterStatus !== "all" 
              ? "Try adjusting your filters" 
              : "No one has applied to this position yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {application.user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {application.user.fullName}
                    </h3>
                    {showAllJobs && application.job && (
                      <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-1">
                        <Briefcase className="h-3 w-3" />
                        {application.job.title} at {application.job.company}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                      {application.user.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {application.user.email}
                        </span>
                      )}
                      {application.user.experienceLevel && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {application.user.experienceLevel}
                        </span>
                      )}
                    </div>
                    {application.user.skills && application.user.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {application.user.skills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                          >
                            {skill.skillName}
                          </span>
                        ))}
                        {application.user.skills.length > 5 && (
                          <span className="text-xs text-gray-500">
                            +{application.user.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  {getStatusBadge(application.status)}
                  <p className="text-xs text-gray-500">
                    Applied {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedApplication(application);
                    setShowDetailsDialog(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>

                {application.status === "PENDING" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(application.id, "REVIEWED")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Reviewed
                  </Button>
                )}

                {(application.status === "PENDING" || application.status === "REVIEWED") && (
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => openInterviewDialog(application)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send Interview
                  </Button>
                )}

                {(application.status === "INTERVIEW_SCHEDULED" || application.status === "REVIEWED") && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleStatusUpdate(application.id, "HIRED")}
                  >
                    <Award className="h-4 w-4 mr-1" />
                    Hire
                  </Button>
                )}

                {application.status !== "REJECTED" && application.status !== "HIRED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                    onClick={() => handleStatusUpdate(application.id, "REJECTED")}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {selectedApplication.user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedApplication.user.fullName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedApplication.user.email}</p>
                  {selectedApplication.user.phone && (
                    <p className="text-gray-600 dark:text-gray-400">{selectedApplication.user.phone}</p>
                  )}
                </div>
                {getStatusBadge(selectedApplication.status)}
              </div>

              {selectedApplication.user.bio && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Bio</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedApplication.user.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedApplication.user.educationLevel && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Education</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedApplication.user.educationLevel}</p>
                  </div>
                )}
                {selectedApplication.user.experienceLevel && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Experience</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedApplication.user.experienceLevel}</p>
                  </div>
                )}
              </div>

              {selectedApplication.user.skills && selectedApplication.user.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.user.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                      >
                        {skill.skillName} {skill.level && `• ${skill.level}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApplication.user.cvText && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CV Content
                  </h4>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {selectedApplication.user.cvText}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Interview Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Interview Invitation</DialogTitle>
            <DialogDescription>
              Schedule an interview with {selectedApplication?.user.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Interview Date & Time
              </label>
              <Input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Interview Notes
              </label>
              <textarea
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Meeting link, location, or other details..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Email Subject
              </label>
              <Input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Email Message
              </label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={6}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSendInterviewInvitation}
                disabled={sending}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {sending ? "Sending..." : "Send Invitation"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInterviewDialog(false)}
                disabled={sending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
