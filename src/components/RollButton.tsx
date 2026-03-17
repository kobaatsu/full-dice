import { cn } from '@/lib/utils'
import { Dices } from 'lucide-react'

import type { RollPhase } from '@/lib/types/dice'

interface RollButtonProps {
  phase: RollPhase
  isReady: boolean
  onClick: () => void
}

export function RollButton({ phase, isReady, onClick }: RollButtonProps) {
  const isDisabled = phase === 'rolling' || !isReady

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'md:flex hidden min-h-16 w-full items-center justify-center gap-3 rounded-2xl px-8 py-4',
        'text-lg font-bold text-white transition-all',
        'focus:outline-none focus:ring-4 focus:ring-offset-2',
        isDisabled
          ? 'cursor-not-allowed bg-gray-400 opacity-70'
          : 'bg-green-600 shadow-lg hover:bg-green-700 active:scale-95 focus:ring-green-500',
      )}
    >
      <Dices className={cn('h-7 w-7', phase === 'rolling' && 'animate-spin')} strokeWidth={2} />
      {phase === 'rolling' ? 'ダイスを振っています…' : 'ダイスを振る'}
    </button>
  )
}
