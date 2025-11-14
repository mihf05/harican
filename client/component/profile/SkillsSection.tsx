'use client'

import { useState } from 'react'
import { Button } from '@/component/ui/button'
import { Input } from '@/component/ui/input'
import { Award, Plus, Trash2 } from 'lucide-react'
import { Skill } from '@/lib/api'
import { cn } from '@/lib/utils'
import CVSkillExtractor from '@/component/CVSkillExtractor'

interface SkillsSectionProps {
  skills: Skill[]
  isLoading: boolean
  onAddSkill: (skill: { skillName: string; level: 'Beginner' | 'Intermediate' | 'Advanced' }) => void
  onRemoveSkill: (skillId: string) => void
  onExtractedSkills: (skills: string[]) => void
  cvText: string
}

export default function SkillsSection({
  skills,
  isLoading,
  onAddSkill,
  onRemoveSkill,
  onExtractedSkills,
  cvText
}: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState({ skillName: '', level: 'Beginner' as const })

  const handleAddSkill = () => {
    if (!newSkill.skillName) return
    onAddSkill(newSkill)
    setNewSkill({ skillName: '', level: 'Beginner' })
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
          <Award className="h-6 w-6 text-white" />
        </div>
        Skills
      </h2>

      {/* Add Skill */}
      <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Skills
          </h3>
          <CVSkillExtractor onSkillsExtracted={onExtractedSkills} />
        </div>
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
          <Button 
            onClick={handleAddSkill} 
            disabled={!newSkill.skillName || isLoading} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Manually
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
                onClick={() => onRemoveSkill(skill.id)}
                className="opacity-0 group-hover:opacity-100 transition text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
