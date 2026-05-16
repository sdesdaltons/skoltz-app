import { SbEventIndicator, type SbEventKind } from "./sb-event-indicator"
import { cn } from "@/lib/utils"

export type SbCalendarEvent = {
  id: string
  title: string
  kind: SbEventKind
  time?: string
  logoUrls?: string[]
}

export function SbCalendarDay({
  date,
  events = [],
  isCurrentMonth,
  isToday,
  hasAstrosHighlight,
  popoverTarget,
}: {
  date: Date
  events?: SbCalendarEvent[]
  isCurrentMonth: boolean
  isToday?: boolean
  hasAstrosHighlight?: boolean
  popoverTarget?: string
}) {
  const visibleEvents = events.slice(0, 2)
  const overflowCount = Math.max(events.length - visibleEvents.length, 0)

  return (
    <button
      type="button"
      popoverTarget={popoverTarget}
      className={cn(
        "relative flex aspect-square min-h-12 w-full flex-col justify-between rounded-md border bg-surface-1 p-1.5 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "cursor-pointer hover:border-primary/40 hover:bg-surface-2",
        isCurrentMonth
          ? "border-border text-foreground"
          : "border-border/60 text-muted-foreground opacity-55",
        isToday && "border-primary shadow-[var(--sb-glow-blue)]",
        hasAstrosHighlight && "bg-primary/10"
      )}
      aria-label={`${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}${events.length ? `, ${events.length} events` : ""}`}
    >
      <span className="flex h-5 items-center">
        <span
          className={cn(
            "inline-flex size-5 items-center justify-center rounded-sm text-xs font-semibold",
            isToday && "bg-primary text-primary-foreground"
          )}
        >
          {date.getDate()}
        </span>
      </span>
      <span className="flex h-4 items-center gap-1 overflow-hidden">
        {visibleEvents.map((event) => (
          <SbEventIndicator key={event.id} kind={event.kind} />
        ))}
        {overflowCount > 0 ? (
          <span className="text-[0.625rem] font-semibold leading-none text-muted-foreground">
            +{overflowCount}
          </span>
        ) : null}
      </span>
    </button>
  )
}
