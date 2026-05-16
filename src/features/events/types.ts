export type EventCategory =
  | "astros"
  | "rockets"
  | "texans"
  | "mlb"
  | "nba"
  | "nfl"
  | "karaoke"
  | "pool"

export type EventCategoryInfo = {
  value: EventCategory
  label: string
}

export interface RawEvent {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  categories: EventCategory[]
  location: string
}

export interface UIEvent {
  id: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  displayDate: string
  displayTime: string
  categories: EventCategory[]
  categoryInfo: EventCategoryInfo[]
  primaryCategory: EventCategory
  location: string
  isAstros: boolean
  isHighlighted: boolean
}
