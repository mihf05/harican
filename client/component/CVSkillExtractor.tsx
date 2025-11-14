'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Loader2, Sparkles, Upload, X, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

interface ExtractedSkill {
  name: string
  category?: string
  proficiency?: string
  type?: string
}

interface ExtractedRole {
  title: string
  relevance?: string
}

interface ExtractionResult {
  skills: ExtractedSkill[]
  technologies: ExtractedSkill[]
  roles: ExtractedRole[]
  experience_level?: string
  domains?: string[]
  summary?: string
  totalSkillsFound: number
  extraction_method: string
  transparent_process: string
}

interface CVSkillExtractorProps {
  onSkillsExtracted: (skills: string[]) => void
  currentCVText?: string
}

export default function CVSkillExtractor({ onSkillsExtracted, currentCVText }: CVSkillExtractorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [cvText, setCvText] = useState(currentCVText || '')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set())

  const handleExtract = async () => {
    if (!cvText.trim() || cvText.trim().length < 50) {
      alert('Please provide at least 50 characters of CV text')
      return
    }

    setIsExtracting(true)
    setExtractionResult(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/ai/extract-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ cvText })
      })

      const data = await response.json()

      if (data.success) {
        setExtractionResult(data.data)
        // Auto-select all skills initially
        const allSkills = [
          ...data.data.skills.map((s: ExtractedSkill) => s.name),
          ...data.data.technologies.map((t: ExtractedSkill) => t.name)
        ]
        setSelectedSkills(new Set(allSkills))
      } else {
        alert(data.message || 'Failed to extract skills')
      }
    } catch (error) {
      console.error('Extraction error:', error)
      alert('Failed to extract skills. Please try again.')
    } finally {
      setIsExtracting(false)
    }
  }

  const toggleSkillSelection = (skillName: string) => {
    const newSelected = new Set(selectedSkills)
    if (newSelected.has(skillName)) {
      newSelected.delete(skillName)
    } else {
      newSelected.add(skillName)
    }
    setSelectedSkills(newSelected)
  }

  const handleApplySkills = () => {
    onSkillsExtracted(Array.from(selectedSkills))
    setIsOpen(false)
    setExtractionResult(null)
    setSelectedSkills(new Set())
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setCvText(text)
      }
      reader.readAsText(file)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Extract Skills from CV (AI)
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI-Powered Skill Extraction
            </DialogTitle>
            <DialogDescription>
              Upload your CV or paste the content to automatically extract skills, technologies, and relevant roles.
            </DialogDescription>
          </DialogHeader>

          {!extractionResult ? (
            <div className="space-y-4">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Upload a text-based CV file (.txt)
                </p>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">OR</span>
                </div>
              </div>

              {/* Text Area */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Paste Your CV Content
                </label>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste your CV or resume text here... (minimum 50 characters)"
                  className="w-full h-64 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {cvText.length} characters
                </p>
              </div>

              <Button
                onClick={handleExtract}
                disabled={isExtracting || cvText.trim().length < 50}
                className="w-full gap-2"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing CV with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Extract Skills & Roles
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Extraction Info */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  ✨ Extraction Complete
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  Found {extractionResult.totalSkillsFound} skills and technologies
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Method: {extractionResult.extraction_method}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {extractionResult.transparent_process}
                </p>
              </div>

              {/* Summary */}
              {extractionResult.summary && (
                <div>
                  <h4 className="font-semibold mb-2">Professional Summary</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    {extractionResult.summary}
                  </p>
                </div>
              )}

              {/* Experience Level & Domains */}
              <div className="grid grid-cols-2 gap-4">
                {extractionResult.experience_level && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Experience Level</h4>
                    <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                      {extractionResult.experience_level}
                    </span>
                  </div>
                )}
                {extractionResult.domains && extractionResult.domains.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Domains</h4>
                    <div className="flex flex-wrap gap-2">
                      {extractionResult.domains.map((domain, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Relevant Roles */}
              {extractionResult.roles.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Relevant Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {extractionResult.roles.map((role, idx) => (
                      <span
                        key={idx}
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          role.relevance === 'high'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : role.relevance === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {role.title}
                        {role.relevance && (
                          <span className="ml-1 text-xs opacity-75">
                            ({role.relevance})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills & Technologies */}
              <div>
                <h4 className="font-semibold mb-3">
                  Extracted Skills & Technologies
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Click to select/deselect)
                  </span>
                </h4>

                {/* Technical Skills */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills ({extractionResult.skills.length})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {extractionResult.skills.map((skill, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleSkillSelection(skill.name)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                          selectedSkills.has(skill.name)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {selectedSkills.has(skill.name) && (
                          <Check className="w-3 h-3 inline mr-1" />
                        )}
                        {skill.name}
                        {skill.proficiency && (
                          <span className="ml-1 text-xs opacity-75">
                            ({skill.proficiency})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies & Tools ({extractionResult.technologies.length})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {extractionResult.technologies.map((tech, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleSkillSelection(tech.name)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                          selectedSkills.has(tech.name)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {selectedSkills.has(tech.name) && (
                          <Check className="w-3 h-3 inline mr-1" />
                        )}
                        {tech.name}
                        {tech.type && (
                          <span className="ml-1 text-xs opacity-75">
                            ({tech.type})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleApplySkills}
                  disabled={selectedSkills.size === 0}
                  className="flex-1"
                >
                  Add {selectedSkills.size} Selected Skill{selectedSkills.size !== 1 ? 's' : ''} to Profile
                </Button>
                <Button
                  onClick={() => {
                    setExtractionResult(null)
                    setSelectedSkills(new Set())
                  }}
                  variant="outline"
                >
                  Extract Again
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
