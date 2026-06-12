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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/visuals/pool-table.svg"
                  alt="Illustration of a pool table with racked balls and a cue"
                  width={640}
                  height={360}
                  className="w-full max-w-md rounded-lg"
                />
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
