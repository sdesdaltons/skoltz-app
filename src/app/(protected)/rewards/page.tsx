"use client"

import { SbEmptyState } from "@/components/feedback"
import { SbContainer, SbSection, SbSectionHeader } from "@/components/layout"
import { SbBottomNav } from "@/components/navigation"
import { SbBadge, SbButton, SbCard } from "@/components/ui"
import { CheckInButton } from "@/features/checkins"
import { type UIReward, useRewards } from "@/features/rewards"

function RewardsHowItWorks() {
  const steps = [
    ["1", "Check in", "Use this page when you arrive at Skoltz."],
    ["2", "Earn points", "Skoltz confirms eligible visits after check-in."],
    ["3", "Use rewards", "Available rewards stay visible in this catalogue."],
  ]

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {steps.map(([step, title, description]) => (
        <SbCard key={step} className="bg-surface-2 p-3">
          <div className="flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-primary/40 bg-primary/15 text-sm font-semibold text-primary">
              {step}
            </span>
            <div className="space-y-1">
              <h2 className="text-base font-semibold">{title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </SbCard>
      ))}
    </div>
  )
}

function RewardProgressCard({ nextReward }: { nextReward?: UIReward }) {
  return (
    <SbCard className="space-y-3 bg-surface-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <SbBadge tone="blue">Progress</SbBadge>
          <h2 className="text-xl font-semibold">Next reward target</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Check in at Skoltz to start building progress. Point balances are
            confirmed by Skoltz.
          </p>
        </div>
        {nextReward ? (
          <SbBadge tone="success">{nextReward.pointsLabel}</SbBadge>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="h-2 overflow-hidden rounded-sm bg-surface-1">
          <div className="h-full w-0 rounded-sm bg-primary/70" />
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          {nextReward
            ? `${nextReward.title} is the nearest visible reward target.`
            : "Reward targets will appear when the catalogue loads."}
        </p>
      </div>
    </SbCard>
  )
}

export default function RewardsPage() {
  const rewardsQuery = useRewards()

  return (
    <>
      <main className="flex-1 pb-24 md:pb-0">
        <SbSection className="py-8 sm:py-12">
          <SbContainer className="space-y-6">
            <SbSectionHeader
              title="Rewards"
              subtitle="Check in at Skoltz, earn server-tracked points, and view available rewards."
            />

            <RewardsHowItWorks />

            <SbCard className="space-y-4 bg-surface-2">
              <div className="space-y-2">
                <SbBadge tone="blue">Check-in</SbBadge>
                <h2 className="text-2xl font-semibold">Visit Skoltz</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Check-ins are location-gated and saved securely. Rewards are
                  never awarded by the browser.
                </p>
              </div>
              <CheckInButton />
            </SbCard>

            <RewardProgressCard nextReward={rewardsQuery.data?.[0]} />

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
                    <div className="flex items-start justify-between gap-3">
                      <SbBadge tone="success">{reward.pointsLabel}</SbBadge>
                      <SbBadge tone="neutral">Available</SbBadge>
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-lg font-semibold">{reward.title}</h2>
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
