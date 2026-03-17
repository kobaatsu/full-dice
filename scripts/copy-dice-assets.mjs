import { cpSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const src = resolve(root, 'node_modules/@3d-dice/dice-box/dist/assets')
const dest = resolve(root, 'public/assets/dice-box')

if (!existsSync(src)) {
  console.warn('[copy-dice-assets] Source not found:', src)
  process.exit(0)
}

mkdirSync(dest, { recursive: true })
cpSync(src, dest, { recursive: true })
console.log('[copy-dice-assets] Copied assets to', dest)
