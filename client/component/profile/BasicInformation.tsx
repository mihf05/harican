'use client'

import { Input } from '@/component/ui/input'
import { Label } from '@/component/ui/label'
import { PhoneInput } from '@/component/ui/phone-input'
import { User, Mail, Phone, GraduationCap, Briefcase, Target, FileText } from 'lucide-react'

interface BasicInformationProps {
  isEditing: boolean
  profileData: {
    fullName: string
    email: string
    phone: string
    educationLevel: string
    department: string
    experienceLevel: string
    preferredCareerTrack: string
    bio: string
    cvText: string
  }
  onChange: (field: string, value: string) => void
}

export default function BasicInformation({ isEditing, profileData, onChange }: BasicInformationProps) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
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
              onChange={(e) => onChange('fullName', e.target.value)}
              className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-lg shadow-sm"
            />
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">{profileData.fullName || 'Not provided'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white">{profileData.email || 'Not provided'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold">Phone</Label>
          {isEditing ? (
            <PhoneInput
              id="phone"
              value={profileData.phone}
              onChange={(value) => onChange('phone', value || '')}
              className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-lg shadow-sm"
            />
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">{profileData.phone || 'Not provided'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="educationLevel" className="text-sm font-semibold">Education Level</Label>
          {isEditing ? (
            <Input
              id="educationLevel"
              value={profileData.educationLevel}
              onChange={(e) => onChange('educationLevel', e.target.value)}
              placeholder="e.g., Bachelor's, Master's"
              className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-lg shadow-sm"
            />
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">{profileData.educationLevel || 'Not provided'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department" className="text-sm font-semibold">Department/Field</Label>
          {isEditing ? (
            <Input
              id="department"
              value={profileData.department}
              onChange={(e) => onChange('department', e.target.value)}
              placeholder="e.g., Computer Science, Business"
              className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-lg shadow-sm"
            />
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-white">{profileData.department || 'Not provided'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceLevel" className="text-sm font-semibold">Experience Level</Label>
          {isEditing ? (
            <select
              id="experienceLevel"
              value={profileData.experienceLevel}
              onChange={(e) => onChange('experienceLevel', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="Fresher">Fresher</option>
              <option value="Junior">Junior (1-2 years)</option>
              <option value="Mid">Mid (3-5 years)</option>
              <option value="Senior">Senior (5+ years)</option>
            </select>
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">{profileData.experienceLevel || 'Not provided'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="preferredCareerTrack" className="text-sm font-semibold">Preferred Career Track</Label>
          {isEditing ? (
            <Input
              id="preferredCareerTrack"
              value={profileData.preferredCareerTrack}
              onChange={(e) => onChange('preferredCareerTrack', e.target.value)}
              placeholder="e.g., Backend Development, Data Science"
              className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-lg shadow-sm"
            />
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">{profileData.preferredCareerTrack || 'Not provided'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio" className="text-sm font-semibold">Bio</Label>
          {isEditing ? (
            <textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => onChange('bio', e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 shadow-sm resize-none"
            />
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{profileData.bio || 'No bio provided'}</p>
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cvText" className="text-sm font-semibold">CV Text</Label>
          {isEditing ? (
            <textarea
              id="cvText"
              value={profileData.cvText}
              onChange={(e) => onChange('cvText', e.target.value)}
              rows={6}
              placeholder="Paste your CV text here for skill extraction and job matching..."
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 shadow-sm resize-none"
            />
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{profileData.cvText || 'No CV text provided'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
