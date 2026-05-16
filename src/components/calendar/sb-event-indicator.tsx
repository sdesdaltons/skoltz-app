import { cn } from "@/lib/utils"

export type SbEventKind = "astros" | "rockets" | "texans" | "karaoke" | "pool"

const eventStyles: Partial<Record<SbEventKind, string>> = {
  astros: "bg-primary",
  rockets: "bg-destructive",
  texans: "bg-primary ring-1 ring-destructive/80",
  karaoke: "bg-warning",
}

const eventLabels: Partial<Record<SbEventKind, string>> = {
  astros: "Astros",
  rockets: "Rockets",
  texans: "Texans",
  karaoke: "Karaoke",
}

export function SbEventIndicator({
  kind,
  className,
}: {
  kind: SbEventKind
  className?: string
}) {
  return (
    <span
      aria-label={eventLabels[kind] ?? "Event"}
      className={cn(
        "block size-1.5 shrink-0 rounded-full",
        eventStyles[kind] ?? "bg-muted",
        className
      )}
      title={eventLabels[kind] ?? "Event"}
    />
  )
}
