"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/hooks/use-profile";
import { ProtectedRoute } from "@/component/protected-route";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { PhoneInput } from "@/component/ui/phone-input";
import { cn } from "@/lib/utils";
import { User, Mail, Phone, GraduationCap, Briefcase, Award, Edit3, Save, X, Plus, Trash2 } from "lucide-react";
import type { Skill } from "@/lib/api";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { getSkills, addSkills, removeSkill, updateProfile, isLoading } = useProfile();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState({ skillName: "", level: "Beginner" as const });
  const [profileData, setProfileData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    bio: string;
    educationLevel: string;
    department: string;
    experienceLevel: 'Fresher' | 'Junior' | 'Mid' | 'Senior';
    preferredCareerTrack: string;
  }>({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    educationLevel: "",
    department: "",
    experienceLevel: "Fresher",
    preferredCareerTrack: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        educationLevel: user.educationLevel || "",
        department: user.department || "",
        experienceLevel: user.experienceLevel || "Fresher",
        preferredCareerTrack: user.preferredCareerTrack || "",
      });
    }
  }, [user]);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await getSkills();
      if (data) setSkills(data);
    } catch (error) {
      console.error("Failed to load skills:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(profileData);
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.skillName) return;
    
    try {
      await addSkills({ skills: [newSkill] });
      setNewSkill({ skillName: "", level: "Beginner" });
      await loadSkills();
    } catch (error) {
      console.error("Failed to add skill:", error);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await removeSkill(skillId);
      await loadSkills();
    } catch (error) {
      console.error("Failed to remove skill:", error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        educationLevel: user.educationLevel || "",
        department: user.department || "",
        experienceLevel: user.experienceLevel || "Fresher",
        preferredCareerTrack: user.preferredCareerTrack || "",
      });
    }
    setIsEditing(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-8 w-8" />
                My Profile
              </h1>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleUpdateProfile} disabled={isLoading} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {user?.fullName || "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {user?.email || "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <PhoneInput
                      defaultCountry="BD"
                      value={profileData.phone}
                      onChange={(value) => setProfileData({ ...profileData, phone: value || "" })}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center gap-2">
                      {user?.phone || "Not set"}
                      {user?.phoneVerified && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                          Verified
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {user?.bio || "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Educational Background */}
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Educational Background
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="educationLevel">Education Level</Label>
                  {isEditing ? (
                    <Input
                      id="educationLevel"
                      value={profileData.educationLevel}
                      onChange={(e) => setProfileData({ ...profileData, educationLevel: e.target.value })}
                      placeholder="e.g., Bachelor's, Master's"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {user?.educationLevel || "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="department">Department/Major</Label>
                  {isEditing ? (
                    <Input
                      id="department"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      placeholder="e.g., Computer Science"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {user?.department || "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Career Information */}
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Career Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  {isEditing ? (
                    <select
                      id="experienceLevel"
                      value={profileData.experienceLevel}
                      onChange={(e) => setProfileData({ ...profileData, experienceLevel: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="Fresher">Fresher</option>
                      <option value="Junior">Junior (1-3 years)</option>
                      <option value="Mid">Mid-level (3-5 years)</option>
                      <option value="Senior">Senior (5+ years)</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {user?.experienceLevel || "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="preferredCareerTrack">Preferred Career Track</Label>
                  {isEditing ? (
                    <Input
                      id="preferredCareerTrack"
                      value={profileData.preferredCareerTrack}
                      onChange={(e) => setProfileData({ ...profileData, preferredCareerTrack: e.target.value })}
                      placeholder="e.g., Software Development"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {user?.preferredCareerTrack || "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="h-6 w-6" />
              Skills
            </h2>

            {/* Add Skill */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Add New Skill</h3>
              <div className="flex gap-2 flex-wrap">
                <Input
                  placeholder="Skill name (e.g., Python, JavaScript)"
                  value={newSkill.skillName}
                  onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                  className="flex-1 min-w-[200px]"
                />
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <Button onClick={handleAddSkill} disabled={!newSkill.skillName || isLoading} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            {/* Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skills.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 col-span-2 text-center py-8">
                  No skills added yet. Add your first skill above!
                </p>
              ) : (
                skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{skill.skillName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Level: <span className={cn(
                          "font-medium",
                          skill.level === "Advanced" && "text-green-600 dark:text-green-400",
                          skill.level === "Intermediate" && "text-blue-600 dark:text-blue-400",
                          skill.level === "Beginner" && "text-yellow-600 dark:text-yellow-400"
                        )}>
                          {skill.level || "Beginner"}
                        </span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="opacity-0 group-hover:opacity-100 transition text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
