"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/hooks/use-profile";
import { Zap } from "lucide-react";
import type { Skill } from "@/lib/api";
import ProfileHeader from "@/component/profile/ProfileHeader";
import BasicInformation from "@/component/profile/BasicInformation";
import SkillsSection from "@/component/profile/SkillsSection";
import CVGenerator from "@/component/CVGenerator";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { getSkills, addSkills, removeSkill, updateProfile, isLoading } = useProfile();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleAddSkill = async (skill: { skillName: string; level: 'Beginner' | 'Intermediate' | 'Advanced' }) => {
    if (!skill.skillName) return;
    
    try {
      await addSkills({ skills: [skill] });
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

  const handleExtractedSkills = async (extractedSkills: string[]) => {
    try {
      // Add all extracted skills with default level "Intermediate"
      const skillsToAdd = extractedSkills.map(skillName => ({
        skillName,
        level: "Intermediate" as const
      }));
      
      await addSkills({ skills: skillsToAdd });
      await loadSkills();
    } catch (error) {
      console.error("Failed to add extracted skills:", error);
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
          {/* Profile Header Component */}
          <ProfileHeader
            user={user}
            isEditing={isEditing}
            previewImage={previewImage}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            onEditClick={() => setIsEditing(true)}
            onSaveClick={handleUpdateProfile}
            onCancelClick={handleCancel}
            isLoading={isLoading}
          />

          {/* Basic Information Component */}
          <BasicInformation
            profileData={profileData}
            isEditing={isEditing}
            onChange={(field, value) => setProfileData({ ...profileData, [field]: value })}
          />

          {/* CV Generator Component */}
          <CVGenerator />

          {/* Skills Section Component */}
          <SkillsSection
            skills={skills}
            isLoading={isLoading}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
            onExtractedSkills={handleExtractedSkills}
            cvText={profileData.cvText}
          />
        </div>
      </div>
  );
}
