export interface RawReward {
  id: string
  title: string
  description: string
  pointsRequired: number
  isActive: boolean
}

export interface UIReward {
  id: string
  title: string
  description: string
  pointsRequired: number
  pointsLabel: string
  isActive: boolean
}
