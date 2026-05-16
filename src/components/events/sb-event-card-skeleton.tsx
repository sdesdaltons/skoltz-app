import { SbCard } from "@/components/ui"
import { cn } from "@/lib/utils"

export function SbEventCardSkeleton({ className }: { className?: string }) {
  return (
    <SbCard className={cn("space-y-4", className)} aria-hidden="true">
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-sm bg-surface-2" />
        <div className="h-6 w-20 rounded-sm bg-surface-2" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 rounded-sm bg-surface-2" />
        <div className="h-6 w-3/4 rounded-sm bg-surface-2" />
        <div className="h-4 w-full rounded-sm bg-surface-2" />
        <div className="h-4 w-5/6 rounded-sm bg-surface-2" />
      </div>
      <div className="h-8 w-20 rounded-md bg-surface-2" />
    </SbCard>
  )
}
