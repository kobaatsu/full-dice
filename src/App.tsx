import { DiceCanvas, type DiceCanvasHandle } from '@/components/DiceCanvas'
import { DiceCountSelector } from '@/components/DiceCountSelector'
import { DiceTypeSelector } from '@/components/DiceTypeSelector'
import { PermissionRequest } from '@/components/PermissionRequest'
import { ResultDisplay } from '@/components/ResultDisplay'
import { RollButton } from '@/components/RollButton'
import { useMotionPermission } from '@/hooks/useMotionPermission'
import { useShakeDetection } from '@/hooks/useShakeDetection'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { DiceConfig, DiceSide, RollPhase, RollResult } from '@/lib/types/dice'

const DEBUG = new URLSearchParams(window.location.search).has('debug')

interface AccDebug {
  x: number
  y: number
  z: number
  delta: number
  eventCount: number
}

export default function App() {
  const canvasRef = useRef<DiceCanvasHandle>(null)
  const [diceConfig, setDiceConfig] = useState<DiceConfig>({ side: 6, count: 2 })
  const [phase, setPhase] = useState<RollPhase>('idle')
  const [results, setResults] = useState<RollResult[]>([])
  const [isReady, setIsReady] = useState(false)
  const { permission, requestPermission, isIOS } = useMotionPermission()
  const [accDebug, setAccDebug] = useState<AccDebug | null>(null)
  const lastAccRef = useRef<{ x: number; y: number; z: number } | null>(null)
  const eventCountRef = useRef(0)

  // デバッグモード(?debug)のときだけdevicemotionを監視して加速度を表示
  useEffect(() => {
    if (!DEBUG) return
    if (typeof DeviceMotionEvent === 'undefined') return

    const lastSample = { t: 0 }

    const handler = (e: DeviceMotionEvent) => {
      const now = Date.now()
      const acc = e.accelerationIncludingGravity
      if (!acc) return
      const x = acc.x ?? 0
      const y = acc.y ?? 0
      const z = acc.z ?? 0
      eventCountRef.current += 1

      if (now - lastSample.t < 100) return
      lastSample.t = now

      let delta = 0
      if (lastAccRef.current) {
        const dx = x - lastAccRef.current.x
        const dy = y - lastAccRef.current.y
        const dz = z - lastAccRef.current.z
        delta = Math.sqrt(dx * dx + dy * dy + dz * dz)
      }
      lastAccRef.current = { x, y, z }

      setAccDebug({
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
        z: Math.round(z * 100) / 100,
        delta: Math.round(delta * 100) / 100,
        eventCount: eventCountRef.current,
      })
    }

    window.addEventListener('devicemotion', handler)
    return () => window.removeEventListener('devicemotion', handler)
  }, [])

  const handleRollComplete = useCallback((res: RollResult[]) => {
    setResults(res)
    setPhase('complete')
  }, [])

  const handleRoll = useCallback(() => {
    if (phase === 'rolling' || !isReady) return
    setPhase('rolling')
    setResults([])
    canvasRef.current?.rollDice(diceConfig)
  }, [phase, isReady, diceConfig])

  const handleSideChange = useCallback((side: DiceSide) => {
    setDiceConfig((prev) => ({
      side,
      count: side === 100 ? 1 : prev.count,
    }))
    canvasRef.current?.clearDice()
    setPhase('idle')
    setResults([])
  }, [])

  const handleCountChange = useCallback((count: number) => {
    setDiceConfig((prev) => ({ ...prev, count }))
  }, [])

  const handleReady = useCallback(() => {
    setIsReady(true)
  }, [])

  const handleDismiss = useCallback(() => {
    if (phase !== 'complete') return
    canvasRef.current?.clearDice()
    setPhase('idle')
    setResults([])
  }, [phase])

  useShakeDetection({
    onShake: handleRoll,
    threshold: 12,
    enabled: permission === 'granted' && phase === 'idle' && isReady,
  })

  const isD100 = diceConfig.side === 100
  const isRolling = phase === 'rolling'
  const isComplete = phase === 'complete'
  const showPanel = !isRolling && !isComplete

  return (
    <>
      <DiceCanvas ref={canvasRef} onRollComplete={handleRollComplete} onReady={handleReady} />

      {/* デバッグオーバーレイ（?debugクエリ時のみ表示） */}
      {DEBUG && (
        <div style={{ position: 'fixed', top: 48, left: 0, right: 0, zIndex: 50 }} className="px-4">
          <div className="rounded-xl bg-black/80 p-3 text-xs font-mono text-green-400 space-y-0.5">
            <p>permission: {permission}</p>
            <p>DeviceMotionEvent: {typeof DeviceMotionEvent !== 'undefined' ? 'あり' : 'なし'}</p>
            <p>イベント受信数: {accDebug?.eventCount ?? 0}</p>
            {accDebug ? (
              <>
                <p>
                  x={accDebug.x} y={accDebug.y} z={accDebug.z}
                </p>
                <p>Δ(差分)={accDebug.delta} 閾値=12</p>
              </>
            ) : (
              <p>イベント未受信</p>
            )}
            <p>shakeEnabled: {String(permission === 'granted' && phase === 'idle' && isReady)}</p>
          </div>
        </div>
      )}

      {(isRolling || isComplete) && (
        <div
          onClick={isComplete ? handleDismiss : undefined}
          style={{ position: 'fixed', inset: 0, zIndex: 10 }}
          className="flex flex-col items-center justify-end pb-12"
        >
          {isRolling && (
            <p className="text-white/80 text-lg font-semibold drop-shadow animate-pulse">
              ダイスを振っています…
            </p>
          )}
          {isComplete && (
            <div className="w-full px-4 space-y-3">
              <ResultDisplay phase={phase} results={results} isD100={isD100} />
              <p className="text-center text-sm text-white/60 drop-shadow">タップして戻る</p>
            </div>
          )}
        </div>
      )}

      {showPanel && (
        <div style={{ position: 'relative', zIndex: 10 }} className="flex min-h-dvh flex-col">
          <div className="flex-1" />

          <div className="px-4 pb-6 space-y-3">
            {isIOS && (permission === 'unknown' || permission === 'denied') && (
              <PermissionRequest permission={permission} onRequest={requestPermission} />
            )}

            {permission === 'granted' && isReady && (
              <p className="text-center text-sm text-white/70 drop-shadow">
                端末を振るとダイスが転がります 📳
              </p>
            )}

            <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-4 space-y-3 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 text-center">
                ダイスの種類
              </p>
              <DiceTypeSelector
                selected={diceConfig.side}
                onChange={handleSideChange}
                disabled={!isReady}
              />
            </div>

            {!isD100 && (
              <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-4 space-y-3 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 text-center">
                  個数
                </p>
                <DiceCountSelector
                  count={diceConfig.count}
                  onChange={handleCountChange}
                  disabled={!isReady}
                />
              </div>
            )}

            <RollButton phase={phase} isReady={isReady} onClick={handleRoll} />
          </div>
        </div>
      )}
    </>
  )
}
