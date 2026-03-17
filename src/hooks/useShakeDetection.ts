import { useEffect, useRef } from 'react'

interface UseShakeDetectionOptions {
  onShake: () => void
  threshold?: number
  cooldown?: number
  sampleInterval?: number
  enabled?: boolean
}

export function useShakeDetection({
  onShake,
  threshold = 12,
  cooldown = 800,
  sampleInterval = 100, // ms: 10fps相当でサンプリング
  enabled = true,
}: UseShakeDetectionOptions) {
  const lastShakeRef = useRef(0)
  const lastSampleRef = useRef(0)
  const lastAccRef = useRef<{ x: number; y: number; z: number } | null>(null)

  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return
    if (typeof DeviceMotionEvent === 'undefined') return

    const handleMotion = (event: DeviceMotionEvent) => {
      const now = Date.now()

      // sampleInterval毎に1回だけ処理する（throttle）
      if (now - lastSampleRef.current < sampleInterval) return
      lastSampleRef.current = now

      const acc = event.accelerationIncludingGravity
      if (!acc) return

      const x = acc.x ?? 0
      const y = acc.y ?? 0
      const z = acc.z ?? 0

      if (lastAccRef.current !== null) {
        const dx = x - lastAccRef.current.x
        const dy = y - lastAccRef.current.y
        const dz = z - lastAccRef.current.z
        const delta = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (delta > threshold && now - lastShakeRef.current > cooldown) {
          lastShakeRef.current = now
          onShake()
        }
      }

      lastAccRef.current = { x, y, z }
    }

    window.addEventListener('devicemotion', handleMotion)
    return () => {
      window.removeEventListener('devicemotion', handleMotion)
      lastAccRef.current = null
    }
  }, [enabled, threshold, cooldown, sampleInterval, onShake])
}
