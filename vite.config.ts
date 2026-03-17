import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

const isGhPages = process.env.GITHUB_ACTIONS === 'true'

// https://vite.dev/config/
export default defineConfig({
  base: isGhPages ? '/full-dice/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    // ローカル開発時のみ自己署名証明書（DeviceMotionEventにHTTPS必須）
    ...(!isGhPages ? [basicSsl()] : []),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  optimizeDeps: {
    exclude: ['@3d-dice/dice-box'],
  },
  worker: {
    format: 'es',
  },
})
