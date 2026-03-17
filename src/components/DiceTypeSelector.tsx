import { cn } from '@/lib/utils'
import type { DiceSide } from '@/lib/types/dice'

const DICE_SIDES: DiceSide[] = [4, 6, 8, 10, 12, 20, 100]

interface DiceTypeSelectorProps {
  selected: DiceSide
  onChange: (side: DiceSide) => void
  disabled?: boolean
}

export function DiceTypeSelector({ selected, onChange, disabled }: DiceTypeSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {DICE_SIDES.map((side) => (
        <button
          key={side}
          onClick={() => onChange(side)}
          disabled={disabled}
          className={cn(
            'min-h-12 min-w-12 rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            selected === side
              ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg scale-105'
              : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          d{side}
        </button>
      ))}
    </div>
  )
}
