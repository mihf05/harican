'use client'

import { useState } from 'react'
import { Button } from '@/component/ui/button'
import { FileText, Download, Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { aiAPI } from '@/lib/api'

interface CVData {
  personalInfo: {
    name: string
    email: string
    phone: string
    bio: string
    profileImage?: string
  }
  education: {
    level?: string
    department?: string
  }
  experience: {
    level?: string
    cvText: string
  }
  skills: Array<{ name: string; level?: string }>
  careerGoals: {
    preferredTrack?: string
  }
  professionalSummary: string
}

interface CVSuggestions {
  professionalSummary: string
  strongBulletPoints: string[]
  skillsToHighlight: string[]
  missingKeywords: string[]
  formatSuggestions: string[]
  linkedinTips: string[]
  portfolioSuggestions: string[]
  overallScore: number
  strengths: string[]
  areasForImprovement: string[]
}

export default function CVGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [suggestions, setSuggestions] = useState<CVSuggestions | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'suggestions'>('preview')
  const [error, setError] = useState<string>('')

  const handleGenerateCV = async () => {
    setIsGenerating(true)
    setError('')
    try {
      const response = await aiAPI.generateCV('professional')
      if (response.success && response.data) {
        setCvData(response.data.cvData)
        setActiveTab('preview')
      } else {
        setError(response.message || 'Failed to generate CV')
      }
    } catch (err: any) {
      console.error('Error generating CV:', err)
      setError(err.message || 'An error occurred while generating your CV')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGetSuggestions = async () => {
    setIsLoadingSuggestions(true)
    setError('')
    try {
      const response = await aiAPI.generateCVSuggestions()
      if (response.success && response.data) {
        setSuggestions(response.data)
        setActiveTab('suggestions')
      } else {
        setError(response.message || 'Failed to get suggestions')
      }
    } catch (err: any) {
      console.error('Error getting suggestions:', err)
      setError(err.message || 'An error occurred while getting suggestions')
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const handlePrint = () => {
    // Hide non-CV elements and print only the CV
    const style = document.createElement('style')
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        #cv-preview-content, #cv-preview-content * {
          visibility: visible;
        }
        #cv-preview-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `
    document.head.appendChild(style)
    window.print()
    document.head.removeChild(style)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap gap-3 no-print">
        <Button
          onClick={handleGenerateCV}
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generate CV
            </>
          )}
        </Button>

        <Button
          onClick={handleGetSuggestions}
          disabled={isLoadingSuggestions}
          variant="outline"
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          {isLoadingSuggestions ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Get AI Suggestions
            </>
          )}
        </Button>

        {cvData && (
          <Button
            onClick={handlePrint}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Print / Save as PDF
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 no-print">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Tabs */}
      {(cvData || suggestions) && (
        <div className="flex gap-2 border-b border-gray-200 no-print">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'preview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            CV Preview
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'suggestions'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            AI Suggestions
          </button>
        </div>
      )}

      {/* CV Preview - Professional Resume Style */}
      {activeTab === 'preview' && cvData && (
        <div id="cv-preview-content" className="bg-white shadow-lg max-w-[800px] mx-auto" style={{ minHeight: '1056px', padding: '40px' }}>
          {/* Header Section */}
          <div className="mb-6 pb-4 border-b-2 border-gray-800">
            <h1 className="text-3xl font-bold text-gray-900 mb-1" style={{ letterSpacing: '0.5px' }}>
              {cvData.personalInfo.name}
            </h1>
            <p className="text-sm text-gray-700 mb-2">
              {cvData.careerGoals.preferredTrack || 'Professional'}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
              {cvData.personalInfo.email && (
                <span className="flex items-center gap-1">
                  <span>📧</span> {cvData.personalInfo.email}
                </span>
              )}
              {cvData.personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <span>📱</span> {cvData.personalInfo.phone}
                </span>
              )}
            </div>
          </div>

          {/* About/Summary Section */}
          {cvData.professionalSummary && (
            <div className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide">About</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {cvData.professionalSummary}
              </p>
            </div>
          )}

          {/* Work Experience Section */}
          {cvData.experience.cvText && (
            <div className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide">Work Experience</h2>
              <div className="space-y-3">
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {cvData.experience.cvText.split('\n').slice(0, 10).map((line, idx) => (
                    <p key={idx} className="mb-1">{line}</p>
                  ))}
                </div>
                {cvData.experience.level && (
                  <p className="text-xs text-gray-600 italic">Experience Level: {cvData.experience.level}</p>
                )}
              </div>
            </div>
          )}

          {/* Education Section */}
          {(cvData.education.level || cvData.education.department) && (
            <div className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide">Education</h2>
              <div className="text-sm text-gray-700">
                {cvData.education.level && (
                  <p className="font-semibold">{cvData.education.level}</p>
                )}
                {cvData.education.department && (
                  <p className="text-gray-600">{cvData.education.department}</p>
                )}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {cvData.skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide">Skills</h2>
              <div className="space-y-2">
                {/* Group skills by category if possible */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Technical Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.filter(s => !['Communication', 'Leadership', 'Teamwork'].includes(s.name)).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded border border-gray-300"
                      >
                        {skill.name}
                        {skill.level && <span className="ml-1 text-gray-500">• {skill.level}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Accomplishments/Projects (if any in CV text) */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide">Accomplishments</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Committed to building reliable, future-ready systems</p>
              <p>• Proven ability to optimize system performance and lead agile teams</p>
              {cvData.careerGoals.preferredTrack && (
                <p>• Focused on {cvData.careerGoals.preferredTrack} development</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {activeTab === 'suggestions' && suggestions && (
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Overall CV Score
                </h3>
                <p className="text-sm text-gray-600">
                  AI-powered analysis of your resume
                </p>
              </div>
              <div className={`text-5xl font-bold ${getScoreColor(suggestions.overallScore)}`}>
                {suggestions.overallScore.toFixed(1)}/10
              </div>
            </div>
          </div>

          {/* Strengths */}
          {suggestions.strengths.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {suggestions.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {suggestions.areasForImprovement.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <AlertCircle className="w-6 h-6 text-yellow-600 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {suggestions.areasForImprovement.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">⚠</span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Professional Summary */}
          {suggestions.professionalSummary && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Suggested Professional Summary
              </h3>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p className="text-gray-700 italic">{suggestions.professionalSummary}</p>
              </div>
            </div>
          )}

          {/* Strong Bullet Points */}
          {suggestions.strongBulletPoints.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Strong Bullet Point Examples
              </h3>
              <ul className="space-y-2">
                {suggestions.strongBulletPoints.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills to Highlight */}
          {suggestions.skillsToHighlight.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Skills to Highlight
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.skillsToHighlight.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Format Suggestions */}
          {suggestions.formatSuggestions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Formatting Tips
              </h3>
              <ul className="space-y-2">
                {suggestions.formatSuggestions.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* LinkedIn Tips */}
          {suggestions.linkedinTips.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                LinkedIn Profile Tips
              </h3>
              <ul className="space-y-2">
                {suggestions.linkedinTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">💼</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Portfolio Suggestions */}
          {suggestions.portfolioSuggestions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Portfolio & Online Presence
              </h3>
              <ul className="space-y-2">
                {suggestions.portfolioSuggestions.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">🌐</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> These are AI-generated suggestions based on best practices. 
              Please adapt them to your specific situation and verify all information before use.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!cvData && !suggestions && !isGenerating && !isLoadingSuggestions && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-12 text-center">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Generate Your Professional CV
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create a clean, professional CV using your profile information, or get AI-powered 
            suggestions to improve your existing resume.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              onClick={handleGenerateCV}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate CV
            </Button>
            <Button
              onClick={handleGetSuggestions}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get AI Suggestions
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
