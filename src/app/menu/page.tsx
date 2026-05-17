import { OfflineBanner } from "@/components/feedback"
import { SbContainer, SbSection, SbSectionHeader } from "@/components/layout"
import { SbBottomNav } from "@/components/navigation"
import { SbCard } from "@/components/ui"
import { FoodMenuGrid } from "@/features/menu"

export default function MenuPage() {
  return (
    <>
      <OfflineBanner />
      <main className="flex-1 pb-28">
        <SbSection className="py-5 sm:py-8">
          <SbContainer className="space-y-3">
            <SbSectionHeader
              title="Food Menu"
              subtitle="Breakfast, apps, burgers, pizza, wings, tacos, and nachos."
            />

            <FoodMenuGrid />

            <SbCard className="border-border/70 bg-surface-2 p-3">
              <p className="text-xs leading-5 text-muted-foreground">
                Kitchen items may contain major allergens including tree nuts,
                peanuts, soy, dairy, eggs, seafood, and shellfish. Ask staff
                before ordering if you have an allergy.
              </p>
            </SbCard>
          </SbContainer>
        </SbSection>
      </main>
      <SbBottomNav active="Menu" />
    </>
  )
}
