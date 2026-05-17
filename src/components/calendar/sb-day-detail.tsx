import Image from "next/image"

import { SbBadge, SbButton, SbCard } from "@/components/ui"
import { cn } from "@/lib/utils"

import { SbEventIndicator } from "./sb-event-indicator"
import { type SbCalendarEvent } from "./sb-calendar-day"

export function SbDayDetail({
  id,
  date,
  events,
  className,
}: {
  id: string
  date: Date
  events: SbCalendarEvent[]
  className?: string
}) {
  return (
    <div
      id={id}
      popover="auto"
      className={cn(
        "m-auto w-[min(calc(100vw-2rem),28rem)] border-0 bg-transparent p-0 text-foreground backdrop:bg-background/70",
        className
      )}
    >
      <SbCard className="space-y-4 bg-surface-2 p-5 shadow-[var(--sb-shadow-lg)]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <SbBadge tone={events.length ? "blue" : "neutral"}>
              {events.length ? `${events.length} events` : "No events"}
            </SbBadge>
            <div>
              <h3 className="text-xl font-semibold">
                {date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <p className="text-sm text-muted-foreground">
                Calendar details
              </p>
            </div>
          </div>
          <SbButton type="button" variant="ghost" size="sm" popoverTarget={id}>
            Close
          </SbButton>
        </div>

        <div className="space-y-2">
          {events.length ? (
            events.map((event) => {
              const content = (
                <>
                  <SbEventIndicator kind={event.kind} />
                  {event.logoUrls?.length ? (
                    <div className="flex shrink-0 items-center -space-x-1">
                      {event.logoUrls.slice(0, 2).map((logoUrl) => (
                        <span
                          key={logoUrl}
                          className="relative size-7 overflow-hidden rounded-full border border-border bg-surface-2"
                        >
                          <Image
                            src={logoUrl}
                            alt=""
                            fill
                            sizes="28px"
                            className="object-contain p-1"
                          />
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.liveScore?.isLive
                        ? event.liveScore.status
                        : event.time ?? "Time TBD"}
                    </p>
                    {event.liveScore?.isLive ? (
                      <div className="mt-2 grid gap-1">
                        {event.liveScore.teams.map((team) => (
                          <div
                            key={`${event.id}-${team.homeAway}`}
                            className="flex items-center justify-between gap-3 rounded-sm bg-background/70 px-2 py-1 text-xs font-semibold"
                          >
                            <span className="truncate">{team.name}</span>
                            <span>{team.score}</span>
                          </div>
                        ))}
                      </div>
                    ) : event.description ? (
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {event.description}
                      </p>
                    ) : null}
                  </div>
                </>
              )

              return event.sourceUrl ? (
                <a
                  key={event.id}
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 items-center gap-3 rounded-md border border-primary/30 bg-surface-1 px-3 py-2 transition hover:border-primary/50 hover:bg-background"
                >
                  {content}
                </a>
              ) : (
                <div
                key={event.id}
                className="flex min-h-12 items-center gap-3 rounded-md border border-border bg-surface-1 px-3 py-2"
              >
                  {content}
              </div>
              )
            })
          ) : (
            <p className="rounded-md border border-border bg-surface-1 px-3 py-4 text-sm text-muted-foreground">
              Nothing scheduled for this day.
            </p>
          )}
        </div>
      </SbCard>
    </div>
  )
}
