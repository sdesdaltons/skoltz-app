import { OfflineBanner } from "@/components/feedback"
import { SbContainer, SbSection, SbSectionHeader } from "@/components/layout"
import { SbBottomNav } from "@/components/navigation"
import { SbBadge, SbCard } from "@/components/ui"

export default function PoolPage() {
  return (
    <>
      <OfflineBanner />
      <main className="flex-1 pb-28">
        <SbSection className="py-5 sm:py-8">
          <SbContainer className="space-y-3">
            <SbSectionHeader
              title="Pool"
              subtitle="Table info is on the way."
            />

            <SbCard className="relative overflow-hidden border-border/70 bg-surface-2 p-5">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_85%_0%,rgb(46_204_113_/_0.12),transparent_55%)]"
              />
              <div className="relative space-y-4">
                <svg
                  aria-hidden
                  viewBox="0 0 96 56"
                  className="h-14 w-24"
                  fill="none"
                >
                  <circle cx="48" cy="12" r="9" className="fill-surface-1 stroke-warning/70" strokeWidth="2" />
                  <circle cx="36" cy="32" r="9" className="fill-surface-1 stroke-primary/70" strokeWidth="2" />
                  <circle cx="60" cy="32" r="9" className="fill-surface-1 stroke-accent/70" strokeWidth="2" />
                  <circle cx="48" cy="12" r="3" className="fill-warning/70" />
                  <circle cx="36" cy="32" r="3" className="fill-primary/70" />
                  <circle cx="60" cy="32" r="3" className="fill-accent/70" />
                </svg>
                <div className="space-y-2">
                  <SbBadge tone="success">Coming soon</SbBadge>
                  <h1 className="text-2xl font-semibold tracking-normal text-foreground">
                    Pool info coming soon
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    Details about pool table availability, leagues, and
                    tournaments will be added here soon. Check back, or ask the
                    bartender next time you&apos;re in.
                  </p>
                </div>
              </div>
            </SbCard>
          </SbContainer>
        </SbSection>
      </main>
      <SbBottomNav active="Pool" />
    </>
  )
}
