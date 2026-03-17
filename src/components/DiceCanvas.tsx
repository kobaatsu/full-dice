import { useDiceBox } from '@/hooks/useDiceBox'
import { forwardRef, useImperativeHandle } from 'react'

import type { DiceConfig, RollPhase, RollResult } from '@/lib/types/dice'

const DICE_CONTAINER_ID = 'dice-box-container'

export interface DiceCanvasHandle {
  rollDice: (config: DiceConfig) => void
  clearDice: () => void
  isReady: boolean
  phase: RollPhase
}

interface DiceCanvasProps {
  onRollComplete: (results: RollResult[]) => void
  onReady?: () => void
}

export const DiceCanvas = forwardRef<DiceCanvasHandle, DiceCanvasProps>(function DiceCanvas(
  { onRollComplete, onReady },
  ref,
) {
  const { isReady, phase, rollDice, clearDice } = useDiceBox({
    containerId: DICE_CONTAINER_ID,
    onRollComplete,
    onReady,
  })

  useImperativeHandle(ref, () => ({ rollDice, clearDice, isReady, phase }), [
    rollDice,
    clearDice,
    isReady,
    phase,
  ])

  return (
    <div
      id={DICE_CONTAINER_ID}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        width: '100vw',
        height: '100dvh',
      }}
    />
  )
})
