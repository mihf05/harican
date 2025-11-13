"use client";
import { useState, useCallback } from "react";
import { profileAPI, type User, type Skill, type UpdateProfileData, type AddSkillsData } from "@/lib/api";

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileAPI.getProfile();
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileAPI.updateProfile(data);
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const getSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileAPI.getSkills();
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const addSkills = useCallback(async (data: AddSkillsData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileAPI.addSkills(data);
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const removeSkill = useCallback(async (skillId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await profileAPI.removeSkill(skillId);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    isLoading,
    error,
    getProfile,
    updateProfile,
    getSkills,
    addSkills,
    removeSkill,
  };
}
