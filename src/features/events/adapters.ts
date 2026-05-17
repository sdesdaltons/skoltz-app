import {
  type EventCategory,
  type EventCategoryInfo,
  type RawEvent,
  type UIEvent,
} from "./types"

const categoryLabels: Record<EventCategory, string> = {
  astros: "Astros",
  rockets: "Rockets",
  texans: "Texans",
  mlb: "MLB Playoffs",
  nba: "NBA Playoffs",
  nfl: "NFL Playoffs",
  karaoke: "Karaoke",
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

function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function normalizeCategories(categories: EventCategory[]): EventCategoryInfo[] {
  return categories.map((category) => ({
    value: category,
    label: categoryLabels[category],
  }))
}

export function adaptRawEvent(rawEvent: RawEvent): UIEvent {
  const startTime = new Date(rawEvent.startTime)
  const endTime = new Date(rawEvent.endTime)
  const isAstros = rawEvent.categories.includes("astros")

  return {
    id: rawEvent.id,
    title: rawEvent.title,
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
    const key = dateKey(event.startTime)

    groupedEvents[key] = [...(groupedEvents[key] ?? []), event]

    return groupedEvents
  }, {})
}
