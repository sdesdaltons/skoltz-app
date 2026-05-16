import { type ReactNode } from "react"

import { SbBadge, SbCard } from "@/components/ui"
import { cn } from "@/lib/utils"

import { type SbEventKind } from "@/components/calendar"

const categoryTone: Partial<
  Record<SbEventKind, "blue" | "red" | "success" | "warning" | "neutral">
> = {
  astros: "blue",
  rockets: "red",
  texans: "blue",
  karaoke: "warning",
}

export function SbEventCard({
  title,
  description,
  dateTime,
  categories,
  cta,
  className,
}: {
  title: string
  description: string
  dateTime: string
  categories: SbEventKind[]
  cta?: ReactNode
  className?: string
}) {
  const isAstros = categories.includes("astros")

  return (
    <SbCard
      className={cn(
        "space-y-4 transition-colors hover:border-primary/50 hover:bg-surface-2",
        isAstros && "border-primary/50 bg-primary/10 shadow-[var(--sb-glow-blue)]",
        className
      )}
    >
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <SbBadge key={category} tone={categoryTone[category] ?? "neutral"}>
            {category}
          </SbBadge>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-muted-foreground">{dateTime}</p>
        <h3 className="text-xl font-semibold tracking-normal text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      {cta ? <div className="pt-1">{cta}</div> : null}
    </SbCard>
  )
}
