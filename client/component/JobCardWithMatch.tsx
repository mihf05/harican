'use client'

import { ExternalLink, TrendingUp, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Button } from './ui/button'

interface JobMatch {
  matchPercentage: number
  matchQuality: string
  matchedSkills: string[]
  missingSkills: string[]
  matchReasons: string[]
  recommendations: string[]
  breakdown: {
    skillsMatch: number
    experienceMatch: number
    careerTrackMatch: number
    bonusPoints: number
  }
  externalPlatforms: {
    linkedin: string
    bdjobs: string
    glassdoor: string
    indeed: string
    bayt: string
    github: string | null
    angellist: string
    remoteok: string | null
  }
}

interface Job {
  id: string
  title: string
  company: string
  location: string
  jobType: string
  experienceLevel: string
  salary?: string
  skills: string[]
  isRemote: boolean
  matchPercentage?: number
  matchQuality?: string
  matchedSkills?: string[]
  missingSkills?: string[]
  matchReasons?: string[]
  recommendations?: string[]
  externalPlatforms?: JobMatch['externalPlatforms']
}

interface JobCardWithMatchProps {
  job: Job
}

export default function JobCardWithMatch({ job }: JobCardWithMatchProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 65) return 'bg-blue-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getMatchBadgeColor = (quality: string) => {
    if (quality === 'Excellent') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (quality === 'Good') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (quality === 'Fair') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Match Percentage Header */}
      {job.matchPercentage !== undefined && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - job.matchPercentage / 100)}`}
                    className={getMatchColor(job.matchPercentage)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{job.matchPercentage}%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Match Score
                  </span>
                </div>
                {job.matchQuality && (
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getMatchBadgeColor(job.matchQuality)}`}>
                    {job.matchQuality} Match
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Details */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {job.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
            {job.jobType}
          </span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
            {job.experienceLevel}
          </span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm">
            {job.location}
          </span>
          {job.isRemote && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
              Remote
            </span>
          )}
        </div>

        {job.salary && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            💰 {job.salary}
          </p>
        )}

        {/* Match Details */}
        {job.matchedSkills && job.matchedSkills.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Matched Skills ({job.matchedSkills.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.matchedSkills.slice(0, 5).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded text-xs border border-green-200 dark:border-green-800"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.missingSkills && job.missingSkills.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Skills to Learn ({job.missingSkills.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.missingSkills.slice(0, 5).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 rounded text-xs border border-orange-200 dark:border-orange-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Match Reasons */}
        {job.matchReasons && job.matchReasons.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Why this matches you
              </span>
            </div>
            <ul className="space-y-1">
              {job.matchReasons.slice(0, 3).map((reason, idx) => (
                <li key={idx} className="text-xs text-blue-800 dark:text-blue-200">
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {job.recommendations && job.recommendations.length > 0 && (
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <ul className="space-y-1">
              {job.recommendations.map((rec, idx) => (
                <li key={idx} className="text-xs text-purple-800 dark:text-purple-200">
                  💡 {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* External Platforms */}
        {job.externalPlatforms && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
              Search on other platforms:
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(job.externalPlatforms).map(([platform, url]) => {
                if (!url) return null
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs transition-colors"
                  >
                    {platform === 'linkedin' && 'LinkedIn'}
                    {platform === 'bdjobs' && 'BDJobs'}
                    {platform === 'glassdoor' && 'Glassdoor'}
                    {platform === 'indeed' && 'Indeed'}
                    {platform === 'bayt' && 'Bayt'}
                    {platform === 'github' && 'GitHub'}
                    {platform === 'angellist' && 'AngelList'}
                    {platform === 'remoteok' && 'RemoteOK'}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            View Details & Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
