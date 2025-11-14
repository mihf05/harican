"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/component/ui/dialog";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { Plus, Loader2, X } from "lucide-react";
import { jobsAPI } from "@/lib/api";

interface CreateJobDialogProps {
  trigger?: React.ReactNode;
  onJobCreated?: () => void;
}

export function CreateJobDialog({ trigger, onJobCreated }: CreateJobDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentRequirement, setCurrentRequirement] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    isRemote: false,
    jobType: "Full-time" as "Internship" | "Part-time" | "Full-time" | "Freelance",
    experienceLevel: "Fresher" as "Fresher" | "Junior" | "Mid" | "Senior",
    description: "",
    salary: "",
    applicationUrl: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addRequirement = () => {
    if (currentRequirement.trim() && !requirements.includes(currentRequirement.trim())) {
      setRequirements([...requirements, currentRequirement.trim()]);
      setCurrentRequirement("");
    }
  };

  const removeRequirement = (reqToRemove: string) => {
    setRequirements(requirements.filter(req => req !== reqToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (skills.length === 0) {
      setError("Please add at least one skill");
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        ...formData,
        skills,
        requirements: requirements.length > 0 ? requirements : undefined,
        applicationUrl: formData.applicationUrl || undefined,
        salary: formData.salary || undefined,
      };

      const response = await jobsAPI.createJob(jobData);

      if (response.success) {
        // Reset form
        setFormData({
          title: "",
          company: "",
          location: "",
          isRemote: false,
          jobType: "Full-time",
          experienceLevel: "Fresher",
          description: "",
          salary: "",
          applicationUrl: "",
        });
        setSkills([]);
        setRequirements([]);
        setOpen(false);
        
        // Call callback if provided
        if (onJobCreated) {
          onJobCreated();
        }
      } else {
        setError(response.message || "Failed to create job");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-md bg-white/10 border border-white/20 shadow-xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Create New Job Posting</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {error && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-red-100 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Basic Information</h3>
            
            <div>
              <Label htmlFor="title" className="text-white">Job Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Senior Web Developer"
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                required
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-white">Company Name *</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g. Tech Solutions Ltd"
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-white">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isRemote"
                    checked={formData.isRemote}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-white/30 bg-white/10"
                  />
                  <span className="text-sm font-medium text-white">Remote Position</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobType" className="text-white">Job Type *</Label>
                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/10 backdrop-blur-sm text-white"
                  required
                >
                  <option value="Internship" className="bg-gray-800">Internship</option>
                  <option value="Part-time" className="bg-gray-800">Part-time</option>
                  <option value="Full-time" className="bg-gray-800">Full-time</option>
                  <option value="Freelance" className="bg-gray-800">Freelance</option>
                </select>
              </div>

              <div>
                <Label htmlFor="experienceLevel" className="text-white">Experience Level *</Label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/10 backdrop-blur-sm text-white"
                  required
                >
                  <option value="Fresher" className="bg-gray-800">Fresher</option>
                  <option value="Junior" className="bg-gray-800">Junior</option>
                  <option value="Mid" className="bg-gray-800">Mid-level</option>
                  <option value="Senior" className="bg-gray-800">Senior</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="salary" className="text-white">Salary Range</Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="e.g. ৳30,000 - ৳50,000/month"
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-white">Required Skills *</h3>
            <div className="flex gap-2">
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Add a skill (e.g. JavaScript)"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
              />
              <Button type="button" onClick={addSkill} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 bg-blue-400/30 text-white px-3 py-1 rounded-full text-sm border border-blue-300/50"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-blue-300/30 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-white">Job Requirements</h3>
            <div className="flex gap-2">
              <Input
                value={currentRequirement}
                onChange={(e) => setCurrentRequirement(e.target.value)}
                placeholder="Add a requirement"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
              />
              <Button type="button" onClick={addRequirement} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                Add
              </Button>
            </div>
            {requirements.length > 0 && (
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="flex-1 p-2 bg-white/10 rounded border border-white/10 text-white">
                      {req}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRequirement(req)}
                      className="text-red-300 hover:text-red-200 p-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white">Job Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={5}
              className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/10 text-white placeholder:text-white/50"
            />
          </div>

          {/* Application URL */}
          <div>
            <Label htmlFor="applicationUrl" className="text-white">Application URL</Label>
            <Input
              id="applicationUrl"
              name="applicationUrl"
              type="url"
              value={formData.applicationUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/apply"
              className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end pt-4 border-t border-white/20">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </>
              )}
            </Button>
      </div>
      </form>
      </DialogContent>
    </Dialog>
  );
}
