"use client"

import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/queryKeys"
import {
  createSupabaseBrowserClient,
  hasSupabaseConfig,
} from "@/lib/supabase/client"

import { adaptRawRewards } from "./adapters"
import { rawMockRewards } from "./mock/rewards"
import { type RawReward } from "./types"

type RewardRow = {
  id: string
  title: string
  description: string | null
  points_required?: number | null
  pointsRequired?: number | null
  points?: number | null
  is_active?: boolean | null
}

const rewardStaleTime = 5 * 60 * 1000

function mapRewardRowToRawReward(row: RewardRow): RawReward {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    pointsRequired: row.points_required ?? row.pointsRequired ?? row.points ?? 0,
    isActive: row.is_active ?? true,
  }
}

async function readMockRewards(): Promise<RawReward[]> {
  return rawMockRewards
}

async function readSupabaseRewards(): Promise<RawReward[]> {
  const supabase = createSupabaseBrowserClient()

  if (!supabase) {
    return readMockRewards()
  }

  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .order("points_required", { ascending: true })
    .returns<RewardRow[]>()

  if (error) {
    throw error
  }

  return (data ?? []).map(mapRewardRowToRawReward)
}

function readRewards(): Promise<RawReward[]> {
  return hasSupabaseConfig() ? readSupabaseRewards() : readMockRewards()
}

function isPublicReward(rawReward: RawReward) {
  const rewardTitle = rawReward.title.toLowerCase()

  return (
    !rewardTitle.includes("pool") &&
    !rewardTitle.includes("game day special") &&
    !rewardTitle.includes("gameday special")
  )
}

export function useRewards() {
  return useQuery({
    queryKey: queryKeys.rewards.all,
    queryFn: async () => {
      const rawRewards = await readRewards()

      return adaptRawRewards(rawRewards.filter(isPublicReward)).filter(
        (reward) => reward.isActive
      )
    },
    staleTime: rewardStaleTime,
    refetchInterval: false,
  })
}
