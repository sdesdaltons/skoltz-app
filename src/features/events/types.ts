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
  logoUrls?: string[]
  sourceUrl?: string
  liveScore?: LiveScore
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
  logoUrls: string[]
  sourceUrl?: string
  liveScore?: LiveScore
  isAstros: boolean
  isHighlighted: boolean
}

export type LiveScoreTeam = {
  name: string
  abbreviation: string
  score: string
  logoUrl?: string
  homeAway: "home" | "away"
}

export type LiveScore = {
  provider: "ESPN" | "MLB"
  status: string
  isLive: boolean
  teams: [LiveScoreTeam, LiveScoreTeam]
}
