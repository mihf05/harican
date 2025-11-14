"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { PhoneInput } from "@/component/ui/phone-input";
import { cn } from "@/lib/utils";
import { User, Mail, Phone, GraduationCap, Briefcase, Award, Edit3, Save, X, Plus, Trash2, FileText, Upload, Camera, Zap, Target, CheckCircle2 } from "lucide-react";
import type { Skill } from "@/lib/api";
import Image from "next/image";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { getSkills, addSkills, removeSkill, updateProfile, isLoading } = useProfile();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState({ skillName: "", level: "Beginner" as const });
  const [profileImage, setProfileImage] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    bio: string;
    educationLevel: string;
    department: string;
    experienceLevel: 'Fresher' | 'Junior' | 'Mid' | 'Senior';
    preferredCareerTrack: string;
    cvText: string;
  }>({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    educationLevel: "",
    department: "",
    experienceLevel: "Fresher",
    preferredCareerTrack: "",
    cvText: "",
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
        cvText: user.cvText || "",
      });
      setProfileImage(user.profileImage || "");
      setPreviewImage(user.profileImage || "");
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
      await updateProfile({ ...profileData, profileImage });
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setProfileImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        cvText: user.cvText || "",
      });
      setProfileImage(user.profileImage || "");
      setPreviewImage(user.profileImage || "");
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Profile Header with Gradient */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Zap className="h-10 w-10" />
                My Profile
              </h1>
              <p className="text-blue-100 text-lg">
                Manage your personal information and skills 🚀
              </p>
            </div>
          </div>

          {/* Profile Picture & Basic Info Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-white"
                      >
                        <Camera className="h-8 w-8" />
                      </button>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Name & Role */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user?.fullName || "Your Name"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {user?.email || "your.email@example.com"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-md">
                    {user?.role || "USER"}
                  </span>
                  {user?.phoneVerified && (
                    <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium shadow-md flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Phone Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Edit/Save Buttons */}
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleUpdateProfile} disabled={isLoading} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full shadow-lg flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="rounded-full flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>

            {previewImage && isEditing && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-900 dark:text-blue-100">Profile picture updated</span>
                  </div>
                  <Button onClick={handleRemoveImage} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-lg"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100 py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      {user?.fullName || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-lg"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100 py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      {user?.email || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold">
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
                    <p className="text-sm text-gray-900 dark:text-gray-100 py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-2">
                      {user?.phone || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-semibold">Bio</Label>
                  {isEditing ? (
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-lg"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100 py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      {user?.bio || "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Educational Background */}
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                Educational Background
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="educationLevel" className="text-sm font-semibold">Education Level</Label>
                  {isEditing ? (
                    <Input
                      id="educationLevel"
                      value={profileData.educationLevel}
                      onChange={(e) => setProfileData({ ...profileData, educationLevel: e.target.value })}
                      placeholder="e.g., Bachelor's, Master's"
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 rounded-lg"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100 py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      {user?.educationLevel || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-semibold">Department/Major</Label>
                  {isEditing ? (
                    <Input
                      id="department"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      placeholder="e.g., Computer Science"
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 rounded-lg"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100 py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      {user?.department || "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Career Information */}
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                Career Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel" className="text-sm font-semibold">Experience Level</Label>
                  {isEditing ? (
                    <select
                      id="experienceLevel"
                      value={profileData.experienceLevel}
                      onChange={(e) => setProfileData({ ...profileData, experienceLevel: e.target.value as any })}
                      className="block w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 shadow-sm"
                    >
                      <option value="Fresher">Fresher</option>
                      <option value="Junior">Junior (1-3 years)</option>
                      <option value="Mid">Mid-level (3-5 years)</option>
                      <option value="Senior">Senior (5+ years)</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100 py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      {user?.experienceLevel || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredCareerTrack" className="flex items-center gap-2 text-sm font-semibold">
                    <Target className="h-4 w-4" />
                    Preferred Career Track
                  </Label>
                  {isEditing ? (
                    <Input
                      id="preferredCareerTrack"
                      value={profileData.preferredCareerTrack}
                      onChange={(e) => setProfileData({ ...profileData, preferredCareerTrack: e.target.value })}
                      placeholder="e.g., Software Development"
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 rounded-lg"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100 py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      {user?.preferredCareerTrack || "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CV / Resume Section */}
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                CV / Resume
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  (For AI-powered job matching)
                </span>
              </h2>

              <div className="space-y-2">
                <Label htmlFor="cvText" className="text-sm font-semibold">CV Text</Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      id="cvText"
                      value={profileData.cvText}
                      onChange={(e) => setProfileData({ ...profileData, cvText: e.target.value })}
                      placeholder="Paste your CV text here for AI analysis...&#10;&#10;Include your work experience, education, skills, projects, certifications, and achievements."
                      rows={10}
                      className="block w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-orange-500 resize-y shadow-sm"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
                      💡 Tip: Paste your full CV text or upload a file below. Our AI will analyze it to match you with relevant jobs and resources.
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-900 dark:text-gray-100 py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm max-h-60 overflow-y-auto">
                    {user?.cvText ? (
                      <pre className="whitespace-pre-wrap font-sans">{user.cvText}</pre>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">No CV text added yet</p>
                    )}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        Upload CV File (Coming Soon)
                      </h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        File upload for PDF/DOCX will be available in the next update. For now, please paste your CV text above.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              Skills
            </h2>

            {/* Add Skill */}
            <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Skill
              </h3>
              <div className="flex gap-3 flex-wrap">
                <Input
                  placeholder="Skill name (e.g., Python, JavaScript)"
                  value={newSkill.skillName}
                  onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                  className="flex-1 min-w-[200px] border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 rounded-lg shadow-sm"
                />
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
                  className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 shadow-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <Button onClick={handleAddSkill} disabled={!newSkill.skillName || isLoading} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Skill
                </Button>
              </div>
            </div>

            {/* Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    No skills added yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Add your first skill above!
                  </p>
                </div>
              ) : (
                skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group relative flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">{skill.skillName}</p>
                      <span className={cn(
                        "inline-block px-3 py-1 rounded-full text-xs font-bold",
                        skill.level === "Advanced" && "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
                        skill.level === "Intermediate" && "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
                        skill.level === "Beginner" && "bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
                      )}>
                        {skill.level || "Beginner"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="opacity-0 group-hover:opacity-100 transition text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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
  );
}
