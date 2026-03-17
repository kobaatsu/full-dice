import { cn } from '@/lib/utils'

const MAX_COUNT = 20
const COUNTS = Array.from({ length: MAX_COUNT }, (_, i) => i + 1)

interface DiceCountSelectorProps {
  count: number
  onChange: (count: number) => void
  disabled?: boolean
}

export function DiceCountSelector({ count, onChange, disabled }: DiceCountSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {COUNTS.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          disabled={disabled}
          className={cn(
            'min-h-10 min-w-10 rounded-lg border-2 text-sm font-semibold transition-all',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            count === n
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
