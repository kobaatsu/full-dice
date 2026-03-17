import { Smartphone, Settings } from 'lucide-react'
import type { MotionPermission } from '@/lib/types/dice'

interface PermissionRequestProps {
  permission: MotionPermission
  onRequest: () => Promise<void>
}

export function PermissionRequest({ permission, onRequest }: PermissionRequestProps) {
  const isDenied = permission === 'denied'

  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-5 shadow-lg text-center">
      {isDenied ? (
        <Settings className="mx-auto mb-3 h-8 w-8 text-red-500" />
      ) : (
        <Smartphone className="mx-auto mb-3 h-8 w-8 text-indigo-500" />
      )}

      <p className="mb-1 font-semibold text-gray-800">
        {isDenied ? 'モーションのアクセスが拒否されています' : '端末を振ってダイスを転がす'}
      </p>
      <p className="mb-4 text-sm text-gray-500">
        {isDenied ? (
          <>
            一度拒否するとSafariにキャッシュされます。
            <br />
            <strong>設定 → Safari → 「履歴とWebサイトデータを消去」</strong>
            してから再度アクセスしてください
          </>
        ) : (
          'モーションセンサーへのアクセスを許可すると、端末を振ってダイスを転がせます'
        )}
      </p>

      <button
        onClick={onRequest}
        className={[
          'w-full rounded-xl px-6 py-3 font-bold text-white shadow active:scale-95 transition-all min-h-12',
          isDenied
            ? 'bg-orange-500 hover:bg-orange-600'
            : 'bg-indigo-600 hover:bg-indigo-700',
        ].join(' ')}
      >
        {isDenied ? 'もう一度許可を試みる' : '許可する'}
      </button>
    </div>
  )
}
