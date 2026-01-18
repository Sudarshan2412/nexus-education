'use client'

import { useState } from 'react'
import axios from 'axios'

interface SkillsManagerProps {
  initialSkills: string[]
  userId: string
}

export function SkillsManager({ initialSkills, userId }: SkillsManagerProps) {
  const [skills, setSkills] = useState<string[]>(initialSkills)
  const [isAdding, setIsAdding] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return

    setLoading(true)
    try {
      const updatedSkills = [...skills, newSkill.trim()]
      await axios.patch('/api/user/skills', { skills: updatedSkills })
      setSkills(updatedSkills)
      setNewSkill('')
      setIsAdding(false)
    } catch (error) {
      alert('Failed to add skill')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSkill = async (skillToRemove: string) => {
    setLoading(true)
    try {
      const updatedSkills = skills.filter(s => s !== skillToRemove)
      await axios.patch('/api/user/skills', { skills: updatedSkills })
      setSkills(updatedSkills)
    } catch (error) {
      alert('Failed to remove skill')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setNewSkill('')
    setIsAdding(false)
  }

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {skills.map((skill) => (
        <div
          key={skill}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2 group"
        >
          <span>{skill}</span>
          <button
            onClick={() => handleRemoveSkill(skill)}
            disabled={loading}
            className="text-blue-500 hover:text-red-600 transition opacity-0 group-hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            placeholder="e.g., Web Developer"
            className="px-3 py-1 border border-primary-400 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            autoFocus
            disabled={loading}
          />
          <button
            onClick={handleAddSkill}
            disabled={loading || !newSkill.trim()}
            className="px-3 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition disabled:opacity-50"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-400 transition"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-1 border-2 border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-primary-400 hover:text-primary-600 transition"
        >
          + Add Skill
        </button>
      )}
    </div>
  )
}
