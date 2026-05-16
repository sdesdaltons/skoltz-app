"use client"

import { SbEmptyState } from "@/components/feedback"
import { SbContainer, SbSection, SbSectionHeader } from "@/components/layout"
import { SbBottomNav } from "@/components/navigation"
import { SbBadge, SbButton, SbCard } from "@/components/ui"
import { CheckInButton } from "@/features/checkins"
import { useRewards } from "@/features/rewards"

export default function RewardsPage() {
  const rewardsQuery = useRewards()

  return (
    <>
      <main className="flex-1 pb-24 md:pb-0">
        <SbSection className="py-8 sm:py-12">
          <SbContainer className="space-y-6">
            <SbSectionHeader
              title="Rewards"
              subtitle="Protected read-only rewards catalogue. Check-ins never award points client-side."
            />

            <SbCard className="space-y-4 bg-surface-2">
              <div className="space-y-2">
                <SbBadge tone="blue">Check-in</SbBadge>
                <h2 className="text-2xl font-semibold">Visit Skoltz</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Check-ins are location-gated and saved to Supabase. Reward
                  points remain server-authoritative.
                </p>
              </div>
              <CheckInButton />
            </SbCard>

            {rewardsQuery.isLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <SbCard key={index} className="space-y-3 bg-surface-2">
                    <div className="h-6 w-20 rounded-sm bg-surface-1" />
                    <div className="h-6 w-3/4 rounded-sm bg-surface-1" />
                    <div className="h-4 w-full rounded-sm bg-surface-1" />
                    <div className="h-4 w-5/6 rounded-sm bg-surface-1" />
                  </SbCard>
                ))}
              </div>
            ) : null}

            {rewardsQuery.isError ? (
              <SbCard className="space-y-4 border-destructive/50 bg-surface-2">
                <div className="space-y-2">
                  <SbBadge tone="red">Error</SbBadge>
                  <h2 className="text-2xl font-semibold">
                    Rewards did not load
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Retry the read-only rewards request.
                  </p>
                </div>
                <SbButton
                  type="button"
                  variant="secondary"
                  onClick={() => void rewardsQuery.refetch()}
                >
                  Retry
                </SbButton>
              </SbCard>
            ) : null}

            {!rewardsQuery.isLoading &&
            !rewardsQuery.isError &&
            rewardsQuery.data?.length === 0 ? (
              <SbEmptyState
                title="No rewards available"
                description="The read-only rewards catalogue is empty."
              />
            ) : null}

            {!rewardsQuery.isLoading &&
            !rewardsQuery.isError &&
            rewardsQuery.data &&
            rewardsQuery.data.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {rewardsQuery.data.map((reward) => (
                  <SbCard key={reward.id} className="space-y-3 bg-surface-2">
                    <SbBadge tone="success">{reward.pointsLabel}</SbBadge>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">{reward.title}</h2>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {reward.description}
                      </p>
                    </div>
                  </SbCard>
                ))}
              </div>
            ) : null}
          </SbContainer>
        </SbSection>
      </main>
      <SbBottomNav active="Rewards" />
    </>
  )
}
