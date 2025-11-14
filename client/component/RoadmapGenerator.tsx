'use client'

import { useState } from 'react'
import { Button } from '@/component/ui/button'
import { Input } from '@/component/ui/input'
import { Label } from '@/component/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/component/ui/dialog'
import { roadmapAPI } from '@/lib/api'
import { Loader2, MapIcon, Sparkles } from 'lucide-react'

interface RoadmapGeneratorProps {
  onRoadmapGenerated?: () => void
  trigger?: React.ReactNode
}

export default function RoadmapGenerator({ onRoadmapGenerated, trigger }: RoadmapGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    targetRole: '',
    timeframe: '',
    learningTime: '',
    currentSkills: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const skillsArray = formData.currentSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      const response = await roadmapAPI.generateRoadmap({
        targetRole: formData.targetRole,
        timeframe: formData.timeframe,
        learningTime: formData.learningTime,
        currentSkills: skillsArray.length > 0 ? skillsArray : undefined,
      })

      if (response.success) {
        setOpen(false)
        setFormData({
          targetRole: '',
          timeframe: '',
          learningTime: '',
          currentSkills: '',
        })
        if (onRoadmapGenerated) {
          onRoadmapGenerated()
        }
      } else {
        setError(response.message || 'Failed to generate roadmap')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the roadmap')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Career Roadmap
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapIcon className="w-5 h-5 text-blue-600" />
            Generate Your Career Roadmap
          </DialogTitle>
          <DialogDescription>
            Create a personalized, AI-powered step-by-step plan to achieve your career goals.
            Fill in the details below and we'll generate a comprehensive roadmap tailored to you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="targetRole" className="font-medium">
                Target Role/Position <span className="text-red-500">*</span>
              </Label>
              <Input
                id="targetRole"
                name="targetRole"
                placeholder="e.g., Full Stack Developer, Data Analyst, UX Designer"
                value={formData.targetRole}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                What job role are you aiming for?
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="timeframe" className="font-medium">
                Timeframe <span className="text-red-500">*</span>
              </Label>
              <Input
                id="timeframe"
                name="timeframe"
                placeholder="e.g., 6 months, 1 year, 2 years"
                value={formData.timeframe}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                How long do you have to reach this goal?
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="learningTime" className="font-medium">
                Daily Learning Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="learningTime"
                name="learningTime"
                placeholder="e.g., 2 hours/day, 10 hours/week"
                value={formData.learningTime}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                How much time can you dedicate to learning?
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currentSkills" className="font-medium">
                Current Skills (Optional)
              </Label>
              <Input
                id="currentSkills"
                name="currentSkills"
                placeholder="e.g., HTML, CSS, JavaScript, Python"
                value={formData.currentSkills}
                onChange={handleChange}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of skills you already have
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Roadmap
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
