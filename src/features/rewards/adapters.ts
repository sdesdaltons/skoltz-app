import { type RawReward, type UIReward } from "./types"

export function adaptRawReward(rawReward: RawReward): UIReward {
  return {
    id: rawReward.id,
    title: rawReward.title,
    description: rawReward.description,
    pointsRequired: rawReward.pointsRequired,
    pointsLabel: `${rawReward.pointsRequired} pts`,
    isActive: rawReward.isActive,
  }
}

export function adaptRawRewards(rawRewards: RawReward[]): UIReward[] {
  return rawRewards.map(adaptRawReward)
}
