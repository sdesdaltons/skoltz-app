import { cn } from "@/lib/utils"

export type SbEventKind =
  | "astros"
  | "rockets"
  | "texans"
  | "mlb"
  | "nba"
  | "nfl"
  | "special"
  | "karaoke"
  | "pool"

const eventStyles: Partial<Record<SbEventKind, string>> = {
  astros: "bg-primary",
  rockets: "bg-destructive",
  texans: "bg-primary ring-1 ring-destructive/80",
  mlb: "bg-primary/80",
  nba: "bg-destructive/80",
  nfl: "bg-success",
  special: "bg-warning ring-1 ring-primary/60",
  karaoke: "bg-warning",
}

const eventLabels: Partial<Record<SbEventKind, string>> = {
  astros: "Astros",
  rockets: "Rockets",
  texans: "Texans",
  mlb: "MLB Playoffs",
  nba: "NBA Playoffs",
  nfl: "NFL Playoffs",
  special: "Special",
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
