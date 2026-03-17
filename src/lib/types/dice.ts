export type DiceSide = 4 | 6 | 8 | 10 | 12 | 20 | 100

export interface DiceConfig {
  side: DiceSide
  count: number
}

export type RollPhase = 'idle' | 'rolling' | 'complete'

export type MotionPermission = 'unknown' | 'granted' | 'denied' | 'unavailable'

export interface DieRoll {
  sides: number
  value: number
  themeColor?: string
  groupId?: number
  rollId?: number
}

export interface RollResult {
  groupId: number
  rolls: DieRoll[]
  value: number
  qty: number
  sides: number
  modifier?: number
}

export interface D100Result {
  tensValue: number
  unitsValue: number
  total: number
}
