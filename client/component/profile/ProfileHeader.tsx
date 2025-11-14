'use client'

import { useRef } from 'react'
import { Button } from '@/component/ui/button'
import { Camera, Edit3, Save, X, CheckCircle2, Trash2 } from 'lucide-react'
import { User } from '@/lib/api'
import Image from 'next/image'

interface ProfileHeaderProps {
  user: User | null
  isEditing: boolean
  previewImage: string
  isLoading: boolean
  onEditClick: () => void
  onSaveClick: () => void
  onCancelClick: () => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
}

export default function ProfileHeader({
  user,
  isEditing,
  previewImage,
  isLoading,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onImageUpload,
  onRemoveImage
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      {/* Gradient Header Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <span>My Profile</span>
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
                  <Camera className="h-16 w-16 text-white" />
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
                  onChange={onImageUpload}
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
              <Button 
                onClick={onEditClick} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  onClick={onSaveClick} 
                  disabled={isLoading} 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full shadow-lg flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button 
                  onClick={onCancelClick} 
                  variant="outline" 
                  className="rounded-full flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {previewImage && isEditing && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-900 dark:text-blue-100">Profile picture updated</span>
              </div>
              <Button 
                onClick={onRemoveImage} 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
