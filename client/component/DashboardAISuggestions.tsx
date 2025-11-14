'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, TrendingUp, BookOpen, Target, Lightbulb, ExternalLink, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from './ui/button'

interface SkillGap {
  skillName: string
  frequency: number
  jobTitles: string[]
  learningResources: LearningResource[]
  potentialJobs: PotentialJob[]
}

interface LearningResource {
  id: string
  title: string
  platform: string
  url: string
  costType: string
  duration?: string
  level?: string
}

interface PotentialJob {
  title: string
  company: string
  currentMatch: number
}

interface QuickWin {
  job: {
    id: string
    title: string
    company: string
    location: string
    jobType: string
  }
  matchPercentage: number
  missingSkills: string[]
  matchedSkills: string[]
}

interface CareerSuggestion {
  type: string
  title: string
  description: string
  priority: string
}

interface DashboardSuggestionsData {
  skillGapAnalysis: {
    totalGaps: number
    prioritizedSkills: SkillGap[]
    summary: string
  }
  quickWins: {
    jobs: QuickWin[]
    summary: string
  }
  careerSuggestions: CareerSuggestion[]
  learningResourcesCount: number
}

export default function DashboardAISuggestions() {
  const [suggestions, setSuggestions] = useState<DashboardSuggestionsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/suggestions/dashboard`, {
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        setSuggestions(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      console.error('Failed to fetch suggestions:', err)
      setError('Failed to load suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">Analyzing your profile and generating personalized suggestions...</span>
        </div>
      </div>
    )
  }

  if (error || !suggestions) {
    return (
      <div className="bg-red-50 dark:bg-red-950 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <p className="text-red-800 dark:text-red-200">{error || 'Failed to load suggestions'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-8 h-8" />
          <h2 className="text-2xl font-bold">AI-Powered Career Insights</h2>
        </div>
        <p className="text-blue-100">
          Personalized recommendations based on job market analysis and your profile
        </p>
      </div>

      {/* Career Suggestions */}
      {suggestions.careerSuggestions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Action Items
          </h3>
          <div className="space-y-3">
            {suggestions.careerSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  suggestion.priority === 'high'
                    ? 'bg-red-50 dark:bg-red-950/30 border-red-500'
                    : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-500'
                }`}
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {suggestion.title}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {suggestion.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Gap Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Skill Gap Analysis
          </h3>
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
            {suggestions.skillGapAnalysis.totalGaps} Skills
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {suggestions.skillGapAnalysis.summary}
        </p>

        <div className="space-y-6">
          {suggestions.skillGapAnalysis.prioritizedSkills.slice(0, 5).map((skill, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {skill.skillName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Required by {skill.frequency} job{skill.frequency > 1 ? 's' : ''} including:{' '}
                    {skill.jobTitles.slice(0, 2).join(', ')}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                  High Priority
                </span>
              </div>

              {/* Learning Resources */}
              {skill.learningResources.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-900 dark:text-green-100 text-sm">
                      Recommended Learning Resources
                    </span>
                  </div>
                  <div className="space-y-2">
                    {skill.learningResources.map((resource, rIdx) => (
                      <a
                        key={rIdx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {resource.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {resource.platform}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              resource.costType === 'Free'
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            }`}>
                              {resource.costType}
                            </span>
                            {resource.level && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                • {resource.level}
                              </span>
                            )}
                            {resource.duration && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                • {resource.duration}
                              </span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Potential Jobs */}
              {skill.potentialJobs.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    💼 Learning this skill could improve your match for:
                  </p>
                  <ul className="space-y-1">
                    {skill.potentialJobs.map((job, jIdx) => (
                      <li key={jIdx} className="text-xs text-blue-800 dark:text-blue-200">
                        • {job.title} at {job.company} (Current match: {job.currentMatch}%)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Wins */}
      {suggestions.quickWins.jobs.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Quick Wins
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {suggestions.quickWins.summary}
          </p>

          <div className="space-y-4">
            {suggestions.quickWins.jobs.map((quickWin, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {quickWin.job.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quickWin.job.company} • {quickWin.job.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {quickWin.matchPercentage}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">match</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">
                      ✓ You have: {quickWin.matchedSkills.slice(0, 3).join(', ')}
                    </p>
                    <p className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                      Learn: {quickWin.missingSkills.slice(0, 2).join(', ')}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    View Job <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
