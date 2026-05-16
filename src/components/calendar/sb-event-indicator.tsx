import { cn } from "@/lib/utils"

export type SbEventKind = "astros" | "rockets" | "texans" | "karaoke" | "pool"

const eventStyles: Record<SbEventKind, string> = {
  astros: "bg-primary",
  rockets: "bg-destructive",
  texans: "bg-primary ring-1 ring-destructive/80",
  karaoke: "bg-warning",
  pool: "bg-success",
}

const eventLabels: Record<SbEventKind, string> = {
  astros: "Astros",
  rockets: "Rockets",
  texans: "Texans",
  karaoke: "Karaoke",
  pool: "Pool",
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
      aria-label={eventLabels[kind]}
      className={cn(
        "block size-1.5 shrink-0 rounded-full",
        eventStyles[kind],
        className
      )}
      title={eventLabels[kind]}
    />
  )
}
