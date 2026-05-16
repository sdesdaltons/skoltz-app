import { type ReactNode } from "react"

import { SbBadge, SbButton, SbCard } from "@/components/ui"
import { cn } from "@/lib/utils"

const defaultSpecials = ["$2 Hot Dogs", "$2 Ziegenbock Pints"]

export function SbAstrosHighlightCard({
  title,
  description,
  dateTime,
  specials = defaultSpecials,
  cta,
  className,
}: {
  title: string
  description: string
  dateTime: string
  specials?: string[]
  cta?: ReactNode
  className?: string
}) {
  return (
    <SbCard
      className={cn(
        "space-y-5 border-primary/60 bg-primary/10 p-5 shadow-[var(--sb-glow-blue)] sm:p-6",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <SbBadge tone="blue">Astros</SbBadge>
        <SbBadge tone="neutral">Featured</SbBadge>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">{dateTime}</p>
        <h2 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {specials.map((special) => (
          <div
            key={special}
            className="rounded-md border border-primary/35 bg-surface-1 px-3 py-3 text-sm font-semibold text-foreground"
          >
            {special}
          </div>
        ))}
      </div>

      {cta ?? (
        <SbButton type="button" className="w-full sm:w-auto">
          View calendar
        </SbButton>
      )}
    </SbCard>
  )
}
