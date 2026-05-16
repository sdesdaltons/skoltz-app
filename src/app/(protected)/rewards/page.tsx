"use client"

import { SbEmptyState } from "@/components/feedback"
import { SbContainer, SbSection, SbSectionHeader } from "@/components/layout"
import { SbBottomNav } from "@/components/navigation"
import { SbBadge, SbButton, SbCard } from "@/components/ui"
import { CheckInButton } from "@/features/checkins"
import { type UIReward, useRewards } from "@/features/rewards"

const pointsPerEligibleCheckIn = 10

function RewardsHowItWorks() {
  const steps = [
    ["1", "Check in", "Use this page when you arrive at Skoltz."],
    ["2", "Server verifies", "Location and cooldown rules decide whether the visit is eligible."],
    ["3", "Track rewards", "Reward cards show the point targets Skoltz makes available."],
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

function PointsExplanationCard() {
  return (
    <SbCard className="space-y-3 bg-surface-2">
      <div className="space-y-2">
        <SbBadge tone="blue">Points</SbBadge>
        <h2 className="text-xl font-semibold">How points are calculated</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Each eligible, server-verified check-in earns{" "}
          {pointsPerEligibleCheckIn} points. The app sends a location-gated
          check-in request, then Skoltz verifies it on the server. Only one
          check-in can count within a 12-hour window.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-surface-1 p-3">
          <p className="text-sm font-semibold text-foreground">
            1 eligible check-in
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            Worth {pointsPerEligibleCheckIn} points after verification.
          </p>
        </div>
        <div className="rounded-md border border-border bg-surface-1 p-3">
          <p className="text-sm font-semibold text-foreground">
            12-hour cooldown
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            Repeat taps do not create extra eligible visits.
          </p>
        </div>
        <div className="rounded-md border border-border bg-surface-1 p-3">
          <p className="text-sm font-semibold text-foreground">
            Server controlled
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            The browser never awards or edits points.
          </p>
        </div>
      </div>
    </SbCard>
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
            ? `${nextReward.title} is the nearest visible reward target at about ${Math.ceil(
                nextReward.pointsRequired / pointsPerEligibleCheckIn
              )} eligible check-ins.`
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
            <PointsExplanationCard />

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
