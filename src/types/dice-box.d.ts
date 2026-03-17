declare module '@3d-dice/dice-box' {
  interface DiceBoxConfig {
    assetPath: string
    gravity?: number
    mass?: number
    friction?: number
    restitution?: number
    angularDamping?: number
    linearDamping?: number
    spinForce?: number
    throwForce?: number
    startingHeight?: number
    settleTimeout?: number
    offscreen?: boolean
    delay?: number
    enableShadows?: boolean
    theme?: string
    themeColor?: string
  }

  interface RollObject {
    qty: number
    sides: number
    themeColor?: string
    theme?: string
    modifier?: number
  }

  interface DieResult {
    sides: number
    groupId: number
    rollId: number
    value: number
    theme?: string
    themeColor?: string
  }

  interface RollGroupResult {
    groupId: number
    qty: number
    sides: number
    value: number
    modifier?: number
    rolls: DieResult[]
  }

  type RollInput = string | RollObject | Array<string | RollObject>

  class DiceBox {
    constructor(container: string | HTMLElement | null, config: DiceBoxConfig)
    onRollComplete: (results: RollGroupResult[]) => void
    onDieComplete?: (result: DieResult) => void
    onBeforeRoll?: (notation: unknown) => void
    init(): Promise<void>
    roll(notation: RollInput): Promise<RollGroupResult[]>
    add(notation: RollInput): Promise<RollGroupResult[]>
    reroll(dice: unknown): Promise<RollGroupResult[]>
    remove(notation: unknown): Promise<RollGroupResult[]>
    clear(): void
    hide(): void
    show(): void
    getRollResults(): RollGroupResult[]
    updateConfig(config: Partial<DiceBoxConfig>): void
  }

  export default DiceBox
}
