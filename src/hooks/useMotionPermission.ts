import { useState, useCallback } from 'react'
import type { MotionPermission } from '@/lib/types/dice'

// iOS 13+ DeviceMotionEvent has requestPermission
interface DeviceMotionEventWithPermission extends EventTarget {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

function detectInitialPermission(): MotionPermission {
  if (typeof window === 'undefined') return 'unavailable'
  if (typeof DeviceMotionEvent === 'undefined') return 'unavailable'

  const dme = DeviceMotionEvent as unknown as DeviceMotionEventWithPermission
  if (typeof dme.requestPermission === 'function') {
    // iOS 13+ — needs explicit permission
    return 'unknown'
  }
  // Android / desktop — no permission needed
  return 'granted'
}

export function useMotionPermission() {
  // useState with initializer runs once on mount — avoids useEffect + setState cascade
  const [permission, setPermission] = useState<MotionPermission>(detectInitialPermission)
  const isIOS = permission === 'unknown' || permission === 'denied'

  const requestPermission = useCallback(async () => {
    const dme = DeviceMotionEvent as unknown as DeviceMotionEventWithPermission
    if (typeof dme.requestPermission !== 'function') return

    try {
      const result = await dme.requestPermission()
      setPermission(result === 'granted' ? 'granted' : 'denied')
    } catch {
      setPermission('denied')
    }
  }, [])

  return { permission, requestPermission, isIOS }
}
