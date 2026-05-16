import { type RawReward } from "../types"

export const rawMockRewards: RawReward[] = [
  {
    id: "reward-free-appetizer",
    title: "Free appetizer",
    description: "Read-only sample reward for the protected catalogue.",
    pointsRequired: 100,
    isActive: true,
  },
  {
    id: "reward-game-day-special",
    title: "Game day special",
    description: "Placeholder reward surfaced without redemption logic.",
    pointsRequired: 200,
    isActive: true,
  },
]
