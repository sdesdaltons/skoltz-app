import {
  type EventCategory,
  type EventCategoryInfo,
  type RawEvent,
  type UIEvent,
} from "./types"
import { businessDateKey } from "@/lib/business-date"

const categoryLabels: Record<EventCategory, string> = {
  astros: "Astros",
  rockets: "Rockets",
  texans: "Texans",
  mlb: "MLB Playoffs",
  nba: "NBA Playoffs",
  nfl: "NFL Playoffs",
  karaoke: "Karaoke with Tha Best Sound In Town",
  pool: "Event",
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
})

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
})

function normalizeCategories(categories: EventCategory[]): EventCategoryInfo[] {
  return categories.map((category) => ({
    value: category,
    label: categoryLabels[category],
  }))
}

function normalizeEventTitle(rawEvent: RawEvent) {
  if (rawEvent.categories.includes("karaoke")) {
    return rawEvent.title.replace(/\bNext\s+Friday\s+Karaoke\b/gi, "Friday Karaoke")
  }

  return rawEvent.title
}

export function adaptRawEvent(rawEvent: RawEvent): UIEvent {
  const startTime = new Date(rawEvent.startTime)
  const endTime = new Date(rawEvent.endTime)
  const isAstros = rawEvent.categories.includes("astros")

  return {
    id: rawEvent.id,
    title: normalizeEventTitle(rawEvent),
    description: rawEvent.description,
    startTime,
    endTime,
    displayDate: dateFormatter.format(startTime),
    displayTime: `${timeFormatter.format(startTime)} - ${timeFormatter.format(
      endTime
    )}`,
    categories: rawEvent.categories,
    categoryInfo: normalizeCategories(rawEvent.categories),
    primaryCategory: rawEvent.categories[0],
    location: rawEvent.location,
    logoUrls: rawEvent.logoUrls ?? [],
    sourceUrl: rawEvent.sourceUrl,
    liveScore: rawEvent.liveScore,
    isAstros,
    isHighlighted: isAstros,
  }
}

export function adaptRawEvents(rawEvents: RawEvent[]): UIEvent[] {
  return rawEvents.map(adaptRawEvent)
}

export function groupUIEventsByDate(
  events: UIEvent[]
): Record<string, UIEvent[]> {
  return events.reduce<Record<string, UIEvent[]>>((groupedEvents, event) => {
    const key = businessDateKey(event.startTime)

    groupedEvents[key] = [...(groupedEvents[key] ?? []), event]

    return groupedEvents
  }, {})
}
