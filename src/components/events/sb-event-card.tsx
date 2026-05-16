import { type ReactNode } from "react"

import { SbBadge, SbCard } from "@/components/ui"
import { cn } from "@/lib/utils"

import { type SbEventKind } from "@/components/calendar"

const categoryTone: Record<SbEventKind, "blue" | "red" | "success" | "warning"> =
  {
    astros: "blue",
    rockets: "red",
    texans: "blue",
    karaoke: "warning",
    pool: "success",
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
        "space-y-4",
        isAstros && "border-primary/50 bg-primary/10 shadow-[var(--sb-glow-blue)]",
        className
      )}
    >
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <SbBadge key={category} tone={categoryTone[category]}>
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
