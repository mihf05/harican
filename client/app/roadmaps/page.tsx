'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/component/ui/button'
import { roadmapAPI } from '@/lib/api'
import RoadmapGenerator from '@/component/RoadmapGenerator'
import {
  MapIcon,
  Loader2,
  Calendar,
  Clock,
  Target,
  Trash2,
  Download,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  FileText,
  FileDown,
} from 'lucide-react'
import { ProtectedRoute } from '@/component/protected-route'

interface Roadmap {
  id: string
  targetRole: string
  timeframe: string
  learningTime: string
  currentSkills: string[]
  roadmapData: {
    phases: Array<{
      phase?: string
      title?: string
      duration?: string
      focus?: string
      description?: string
      milestones?: string[]
      skills_to_learn?: string[]
      resources?: string[]
      projects?: (string | { name?: string; [key: string]: any })[]
    }>
    career_advice?: string[]
    application_timeline?: string
  }
  status: string
  createdAt: string
  updatedAt: string
}

function RoadmapsContent() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedRoadmap, setExpandedRoadmap] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchRoadmaps = async () => {
    try {
      setIsLoading(true)
      const response = await roadmapAPI.getRoadmaps()
      if (response.success && response.data) {
        setRoadmaps(response.data)
      }
    } catch (error) {
      console.error('Error fetching roadmaps:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this roadmap?')) return

    try {
      setDeletingId(id)
      const response = await roadmapAPI.deleteRoadmap(id)
      if (response.success) {
        setRoadmaps(roadmaps.filter(r => r.id !== id))
      }
    } catch (error) {
      console.error('Error deleting roadmap:', error)
      alert('Failed to delete roadmap')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = (roadmap: Roadmap, format: 'txt' | 'pdf' = 'txt') => {
    if (format === 'txt') {
      const content = generateRoadmapText(roadmap)
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${roadmap.targetRole.replace(/\s+/g, '_')}_roadmap.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      // PDF export using HTML to canvas and jsPDF
      generatePDF(roadmap)
    }
  }

  const generatePDF = (roadmap: Roadmap) => {
    // Create a styled HTML content for PDF
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to download PDF')
      return
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${roadmap.targetRole} - Career Roadmap</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
            line-height: 1.6;
          }
          h1 {
            color: #2563eb;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 10px;
          }
          h2 {
            color: #7c3aed;
            margin-top: 30px;
          }
          h3 {
            color: #059669;
          }
          .header-info {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .phase {
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            page-break-inside: avoid;
          }
          .phase-header {
            background: #2563eb;
            color: white;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
          }
          .skill-tag {
            display: inline-block;
            background: #ddd6fe;
            color: #5b21b6;
            padding: 5px 10px;
            border-radius: 15px;
            margin: 5px;
            font-size: 0.9em;
          }
          ul {
            margin: 10px 0;
          }
          li {
            margin: 5px 0;
          }
          .advice-box {
            background: #dbeafe;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
          }
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <h1>🚀 Career Roadmap: ${roadmap.targetRole}</h1>
        
        <div class="header-info">
          <p><strong>Timeframe:</strong> ${roadmap.timeframe}</p>
          <p><strong>Learning Time:</strong> ${roadmap.learningTime}</p>
          <p><strong>Current Skills:</strong> ${roadmap.currentSkills.join(', ')}</p>
          <p><strong>Generated:</strong> ${new Date(roadmap.createdAt).toLocaleDateString()}</p>
        </div>

        <h2>📋 Learning Phases</h2>
        ${roadmap.roadmapData.phases.map((phase, idx) => `
          <div class="phase">
            <div class="phase-header">
              <h3 style="margin: 0; color: white;">Phase ${idx + 1}: ${phase?.phase || phase?.title || 'Phase'}</h3>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">${phase?.duration || 'TBD'}</p>
            </div>
            <p><strong>Focus:</strong> ${phase?.focus || phase?.description || 'N/A'}</p>
            
            ${phase?.milestones && phase.milestones.length > 0 ? `
              <h4>🎯 Milestones</h4>
              <ul>
                ${phase.milestones.map(m => `<li>${m}</li>`).join('')}
              </ul>
            ` : ''}
            
            ${phase?.skills_to_learn && phase.skills_to_learn.length > 0 ? `
              <h4>🛠️ Skills to Learn</h4>
              <div>
                ${phase.skills_to_learn.map(s => `<span class="skill-tag">${s}</span>`).join('')}
              </div>
            ` : ''}
            
            ${phase?.projects && phase.projects.length > 0 ? `
              <h4>💡 Projects</h4>
              <ul>
                ${phase.projects.map(p => `<li>${typeof p === 'string' ? p : p?.name || 'Project'}</li>`).join('')}
              </ul>
            ` : ''}
            
            ${phase?.resources && phase.resources.length > 0 ? `
              <h4>📚 Resources</h4>
              <ul>
                ${phase.resources.map(r => `<li>${r}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}

        ${roadmap.roadmapData.career_advice && roadmap.roadmapData.career_advice.length > 0 ? `
          <div class="advice-box">
            <h2>💡 Career Advice</h2>
            <ul>
              ${roadmap.roadmapData.career_advice.map(advice => `<li>${advice}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${roadmap.roadmapData.application_timeline ? `
          <div class="advice-box" style="background: #d1fae5; border-color: #059669;">
            <h2>📅 Application Timeline</h2>
            <p>${roadmap.roadmapData.application_timeline}</p>
          </div>
        ` : ''}
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Wait for content to load, then trigger print dialog
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  const generateRoadmapText = (roadmap: Roadmap): string => {
    let text = `CAREER ROADMAP: ${roadmap.targetRole.toUpperCase()}\n`
    text += `=${'='.repeat(50)}\n\n`
    text += `Timeframe: ${roadmap.timeframe}\n`
    text += `Learning Time: ${roadmap.learningTime}\n`
    text += `Current Skills: ${roadmap.currentSkills.join(', ')}\n`
    text += `Generated: ${new Date(roadmap.createdAt).toLocaleDateString()}\n\n`

    roadmap.roadmapData.phases.forEach((phase, idx) => {
      text += `\n${idx + 1}. ${phase?.phase?.toUpperCase() || phase?.title?.toUpperCase() || 'PHASE'} (${phase?.duration || 'TBD'})\n`
      text += `${'-'.repeat(50)}\n`
      text += `Focus: ${phase?.focus || phase?.description || 'N/A'}\n\n`

      if (phase?.milestones && phase.milestones.length > 0) {
        text += `Milestones:\n`
        phase.milestones.forEach(m => text += `  • ${m}\n`)
        text += `\n`
      }

      if (phase?.skills_to_learn && phase.skills_to_learn.length > 0) {
        text += `Skills to Learn:\n`
        phase.skills_to_learn.forEach(s => text += `  • ${s}\n`)
        text += `\n`
      }

      if (phase?.projects && phase.projects.length > 0) {
        text += `Projects:\n`
        phase.projects.forEach(p => text += `  • ${typeof p === 'string' ? p : p?.name || 'Project'}\n`)
        text += `\n`
      }

      if (phase?.resources && phase.resources.length > 0) {
        text += `Resources:\n`
        phase.resources.forEach(r => text += `  • ${r}\n`)
        text += `\n`
      }
    })

    if (roadmap.roadmapData.career_advice && roadmap.roadmapData.career_advice.length > 0) {
      text += `\nCAREER ADVICE\n`
      text += `${'-'.repeat(50)}\n`
      roadmap.roadmapData.career_advice.forEach(advice => text += `• ${advice}\n`)
    }

    if (roadmap.roadmapData.application_timeline) {
      text += `\nAPPLICATION TIMELINE\n`
      text += `${'-'.repeat(50)}\n`
      text += roadmap.roadmapData.application_timeline
    }

    return text
  }

  const toggleExpand = (id: string) => {
    setExpandedRoadmap(expandedRoadmap === id ? null : id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <MapIcon className="w-8 h-8 text-blue-600" />
              Career Roadmaps
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your personalized learning paths to achieve your career goals
            </p>
          </div>
          <RoadmapGenerator onRoadmapGenerated={fetchRoadmaps} />
        </div>

        {/* Roadmaps List */}
        {roadmaps.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <MapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Roadmaps Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Generate your first AI-powered career roadmap to get started on your learning journey!
            </p>
            <RoadmapGenerator onRoadmapGenerated={fetchRoadmaps} />
          </div>
        ) : (
          <div className="space-y-6">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {/* Roadmap Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Target className="w-6 h-6 text-blue-600" />
                        {roadmap.targetRole}
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {roadmap.timeframe}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {roadmap.learningTime}
                        </div>
                        <div className="text-gray-500">
                          Created: {new Date(roadmap.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {roadmap.currentSkills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {roadmap.currentSkills.slice(0, 5).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {roadmap.currentSkills.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{roadmap.currentSkills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(roadmap, 'txt')}
                          className="gap-1"
                          title="Download as Text"
                        >
                          <FileText className="w-4 h-4" />
                          TXT
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(roadmap, 'pdf')}
                          className="gap-1"
                          title="Download as PDF (Print to save)"
                        >
                          <FileDown className="w-4 h-4" />
                          PDF
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(roadmap.id)}
                        disabled={deletingId === roadmap.id}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        {deletingId === roadmap.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => toggleExpand(roadmap.id)}
                  className="w-full px-6 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {expandedRoadmap === roadmap.id ? 'Hide' : 'View'} Roadmap Details
                  </span>
                  {expandedRoadmap === roadmap.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {/* Roadmap Content */}
                {expandedRoadmap === roadmap.id && (
                  <div className="p-6 space-y-6">
                    {/* Phases */}
                    <div className="space-y-4">
                      {roadmap.roadmapData.phases.map((phase, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {phase?.phase || phase?.title || 'Phase'}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {phase?.duration || 'TBD'}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-4 ml-11">
                            {phase?.focus || phase?.description || 'N/A'}
                          </p>

                          <div className="ml-11 space-y-3">
                            {phase?.milestones && phase.milestones.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                                  Milestones
                                </h4>
                                <ul className="space-y-1">
                                  {phase.milestones.map((milestone, mIdx) => (
                                    <li key={mIdx} className="flex items-start gap-2 text-sm">
                                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-gray-700 dark:text-gray-300">{milestone}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {phase?.skills_to_learn && phase.skills_to_learn.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                                  Skills to Learn
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {phase.skills_to_learn.map((skill, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 rounded text-xs"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {phase?.projects && phase.projects.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                                  Projects
                                </h4>
                                <ul className="space-y-1">
                                  {phase.projects.map((project, pIdx) => (
                                    <li key={pIdx} className="flex items-start gap-2 text-sm">
                                      <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-gray-700 dark:text-gray-300">{typeof project === 'string' ? project : project?.name || 'Project'}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {phase?.resources && phase.resources.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                                  Resources
                                </h4>
                                <ul className="space-y-1">
                                  {phase.resources.map((resource, rIdx) => (
                                    <li key={rIdx} className="text-sm text-gray-700 dark:text-gray-300">
                                      • {resource}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Career Advice */}
                    {roadmap.roadmapData.career_advice && roadmap.roadmapData.career_advice.length > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                          💡 Career Advice
                        </h3>
                        <ul className="space-y-2">
                          {roadmap.roadmapData.career_advice.map((advice, idx) => (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                              • {advice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Application Timeline */}
                    {roadmap.roadmapData.application_timeline && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                          📅 Application Timeline
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {roadmap.roadmapData.application_timeline}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function RoadmapsPage() {
  return (
    <ProtectedRoute>
      <RoadmapsContent />
    </ProtectedRoute>
  )
}
