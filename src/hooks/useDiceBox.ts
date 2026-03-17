import { useEffect, useRef, useCallback, useState } from 'react'
import type { DiceConfig, RollResult, RollPhase } from '@/lib/types/dice'

// @3d-dice/dice-box has no official TypeScript types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DiceBoxInstance = any

interface UseDiceBoxOptions {
  containerId: string
  onRollComplete: (results: RollResult[]) => void
  onReady?: () => void
}

interface RollObject {
  qty: number
  sides: number
  themeColor?: string
}

function buildRollObjects(config: DiceConfig): RollObject[] {
  if (config.side === 100) {
    return [
      { qty: 1, sides: 10, themeColor: '#1e40af' },
      { qty: 1, sides: 10, themeColor: '#dc2626' },
    ]
  }
  return [{ qty: config.count, sides: config.side }]
}

export function useDiceBox({ containerId, onRollComplete, onReady }: UseDiceBoxOptions) {
  const diceBoxRef = useRef<DiceBoxInstance>(null)
  const [isReady, setIsReady] = useState(false)
  const [phase, setPhase] = useState<RollPhase>('idle')
  const onRollCompleteRef = useRef(onRollComplete)
  onRollCompleteRef.current = onRollComplete
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    let cancelled = false
    let instance: DiceBoxInstance = null

    const init = async () => {
      try {
        const { default: DiceBox } = await import('@3d-dice/dice-box')
        if (cancelled) return

        instance = new DiceBox(`#${containerId}`, {
          assetPath: '/assets/dice-box/',
          gravity: 1,
          mass: 1,
          friction: 0.8,
          restitution: 0,
          angularDamping: 0.4,
          linearDamping: 0.4,
          spinForce: 6,
          throwForce: 3.5,
          startingHeight: 8,
          settleTimeout: 5000,
          offscreen: true,
          delay: 10,
          enableShadows: true,
          theme: 'default',
        })

        instance.onRollComplete = (results: RollResult[]) => {
          if (!cancelled) {
            setPhase('complete')
            onRollCompleteRef.current(results)
          }
        }

        await instance.init()
        if (!cancelled) {
          diceBoxRef.current = instance
          setIsReady(true)
          onReadyRef.current?.()
        }
      } catch (err) {
        console.error('[useDiceBox] Failed to initialize DiceBox:', err)
      }
    }

    void init()

    return () => {
      cancelled = true
      if (instance) {
        try {
          instance.clear()
        } catch {
          // ignore cleanup errors
        }
      }
      diceBoxRef.current = null
      setIsReady(false)
    }
  }, [containerId])

  const rollDice = useCallback((config: DiceConfig) => {
    if (!diceBoxRef.current) return
    setPhase('rolling')
    const rolls = buildRollObjects(config)
    void diceBoxRef.current.roll(rolls)
  }, [])

  const clearDice = useCallback(() => {
    if (!diceBoxRef.current) return
    diceBoxRef.current.clear()
    setPhase('idle')
  }, [])

  return { isReady, phase, rollDice, clearDice }
}
