import type { RollResult, RollPhase, D100Result } from '@/lib/types/dice'

function calcD100(results: RollResult[]): D100Result {
  const tensRaw = results[0]?.value ?? 10
  const unitsRaw = results[1]?.value ?? 10
  const tensValue = tensRaw === 10 ? 0 : tensRaw
  const unitsValue = unitsRaw === 10 ? 0 : unitsRaw
  const total = tensValue * 10 + unitsValue
  return { tensValue, unitsValue, total: total === 0 ? 100 : total }
}

interface ResultDisplayProps {
  phase: RollPhase
  results: RollResult[]
  isD100: boolean
}

export function ResultDisplay({ phase, results, isD100 }: ResultDisplayProps) {
  if (phase === 'idle') return null

  if (phase === 'rolling') {
    return (
      <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-4 text-center shadow-lg">
        <p className="text-gray-500 text-sm animate-pulse">結果を計算中…</p>
      </div>
    )
  }

  if (results.length === 0) return null

  if (isD100) {
    const { tensValue, unitsValue, total } = calcD100(results)
    return (
      <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-5 shadow-lg">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
          d100 の結果
        </p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="flex flex-col items-center">
            <span className="text-xs text-blue-500 font-medium mb-1">10の位</span>
            <span className="text-4xl font-bold text-blue-600">{tensValue * 10}</span>
          </div>
          <span className="text-3xl font-bold text-gray-400 pb-1">+</span>
          <div className="flex flex-col items-center">
            <span className="text-xs text-red-500 font-medium mb-1">1の位</span>
            <span className="text-4xl font-bold text-red-600">{unitsValue}</span>
          </div>
          <span className="text-3xl font-bold text-gray-400 pb-1">=</span>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400 font-medium mb-1">合計</span>
            <span className="text-5xl font-bold text-gray-800">{total}</span>
          </div>
        </div>
      </div>
    )
  }

  const allRolls = results.flatMap((r) => r.rolls)
  const total = results.reduce((sum, r) => sum + r.value, 0)

  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-5 shadow-lg">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
        結果
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {allRolls.map((die, i) => (
          <span
            key={i}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-800 shadow-sm"
          >
            {die.value}
          </span>
        ))}
      </div>
      {allRolls.length > 1 && (
        <div className="text-center">
          <span className="text-sm text-gray-500">合計: </span>
          <span className="text-3xl font-bold text-gray-800">{total}</span>
        </div>
      )}
    </div>
  )
}
