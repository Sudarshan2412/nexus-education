'use client'

interface ProgressBarProps {
  progress: number
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ progress, showLabel = true, className = '' }: ProgressBarProps) {
  const percentage = Math.min(Math.max(progress, 0), 100)
  
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-primary-600">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
