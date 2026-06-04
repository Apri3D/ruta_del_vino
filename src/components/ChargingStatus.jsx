import { useEffect, useState } from 'react'

export default function ChargingStatus() {
  const [progress, setProgress] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 1, 100))
      setSeconds(s => s + 1)
    }, 300)
    return () => clearInterval(interval)
  }, [])

  const radius = 64
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference
  const remaining = Math.max(0, Math.ceil((100 - progress) * 0.3))

  const minutes = Math.floor(remaining / 60)
  const secs = remaining % 60

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="160" height="160" className="transform -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#1a3a1a" strokeWidth="10" />
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#22c55e" strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-300 ease-linear" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{progress}%</span>
        <span className="text-xs text-gray-400">{minutes}m {secs}s restante{minutes !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
