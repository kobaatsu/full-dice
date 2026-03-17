# Full Dice 🎲

モバイルデバイスに特化した3Dダイスロールアプリ。端末を振るだけでダイスが転がります。

**→ [デモを試す](https://kobaatsu.github.io/full-dice/)**

## 機能

- **ダイスの種類**: d4 / d6 / d8 / d10 / d12 / d20 / d100
- **個数**: 1〜20個
- **3Dアニメーション**: [@3d-dice/dice-box](https://github.com/3d-dice/dice-box) による物理演算付き3Dレンダリング
- **シェイク操作**: 端末を振るとダイスが転がる（DeviceMotionEvent）
- **d100**: 10の位（青）と1の位（赤）を2つのd10で表現

## 動作環境

- iOS Safari 13以上（HTTPS必須・モーション許可が必要）
- Android Chrome
- デスクトップブラウザ（ボタン操作のみ）

## 開発

```bash
pnpm install
pnpm dev        # https://localhost:5173 で起動（自己署名証明書）
pnpm build      # プロダクションビルド
pnpm lint
pnpm format
```

### デバッグモード

URLに `?debug` を付けると加速度センサーの値をオーバーレイ表示します。

```
https://localhost:5173/?debug
```

## 技術スタック

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [@3d-dice/dice-box](https://github.com/3d-dice/dice-box)
