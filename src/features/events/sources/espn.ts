import { type EventCategory, type RawEvent } from "../types"

const postseasonType = 3
const basketballDurationMs = 2.5 * 60 * 60 * 1000
const footballDurationMs = 3.5 * 60 * 60 * 1000

type EspnLeagueConfig = {
  sport: "basketball" | "football"
  league: "nba" | "nfl"
  category: Extract<EventCategory, "nba" | "nfl" | "texans">
  label: string
  durationMs: number
  playoffMonths: number[]
}

type EspnScoreboardResponse = {
  events?: EspnEvent[]
}

type EspnEvent = {
  id: string
  date: string
  name?: string
  shortName?: string
  season?: {
    type?: number
    slug?: string
  }
  competitions?: Array<{
    venue?: {
      fullName?: string
    }
    competitors?: Array<{
      team?: {
        logo?: string
      }
    }>
    notes?: Array<{
      headline?: string
    }>
  }>
}

function getEspnLogoUrls(event: EspnEvent) {
  return (
    event.competitions?.[0]?.competitors
      ?.map((competitor) => competitor.team?.logo)
      .filter((logo): logo is string => Boolean(logo)) ?? []
  )
}

const leagueConfigs: EspnLeagueConfig[] = [
  {
    sport: "basketball",
    league: "nba",
    category: "nba",
    label: "NBA Playoffs",
    durationMs: basketballDurationMs,
    playoffMonths: [3, 4, 5],
  },
  {
    sport: "football",
    league: "nfl",
    category: "nfl",
    label: "NFL Playoffs",
    durationMs: footballDurationMs,
    playoffMonths: [0, 1],
  },
]

function formatEspnDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}${month}${day}`
}

function overlapsPlayoffWindow(
  startDate: Date,
  endDate: Date,
  playoffMonths: number[]
) {
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1)

  while (cursor <= endMonth) {
    if (playoffMonths.includes(cursor.getMonth())) {
      return true
    }

    cursor.setMonth(cursor.getMonth() + 1)
  }

  return false
}

function mapEspnEventToRawEvent(
  event: EspnEvent,
  config: Pick<EspnLeagueConfig, "category" | "label" | "durationMs">
): RawEvent {
  const startTime = new Date(event.date)
  const endTime = new Date(startTime.getTime() + config.durationMs)
  const competition = event.competitions?.[0]
  const note = competition?.notes?.find((item) => item.headline)?.headline

  return {
    id: `espn-${config.category}-postseason-${event.id}`,
    title: `${config.label}: ${event.name ?? event.shortName ?? "Playoff game"}`,
    description: note ?? `${config.label} game from ESPN's scoreboard feed.`,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    categories: [config.category],
    location: competition?.venue?.fullName ?? `${config.label} game`,
    logoUrls: getEspnLogoUrls(event),
  }
}

function buildTexansTitle(event: EspnEvent) {
  const name = event.name ?? event.shortName ?? "Houston Texans game"

  if (!name.includes("Houston Texans")) {
    return name
  }

  return name.startsWith("Houston Texans")
    ? name.replace("Houston Texans", "Texans")
    : name.replace("Houston Texans", "Texans")
}

async function readEspnPostseasonLeagueEvents(
  config: EspnLeagueConfig,
  startDate: Date,
  endDate: Date
) {
  if (!overlapsPlayoffWindow(startDate, endDate, config.playoffMonths)) {
    return []
  }

  const params = new URLSearchParams({
    dates: `${formatEspnDate(startDate)}-${formatEspnDate(endDate)}`,
    seasontype: String(postseasonType),
  })
  const response = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/${config.sport}/${config.league}/scoreboard?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(`${config.label} schedule request failed.`)
  }

  const data = (await response.json()) as EspnScoreboardResponse

  return (data.events ?? [])
    .filter((event) => event.season?.type === postseasonType)
    .filter(
      (event) =>
        config.category !== "nfl" || !event.name?.includes("Houston Texans")
    )
    .map((event) => mapEspnEventToRawEvent(event, config))
}

export async function readEspnPostseasonEvents(
  startDate: Date,
  endDate: Date
): Promise<RawEvent[]> {
  const results = await Promise.allSettled(
    leagueConfigs.map((config) =>
      readEspnPostseasonLeagueEvents(config, startDate, endDate)
    )
  )

  return results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  )
}

export async function readEspnTexansEvents(
  startDate: Date,
  endDate: Date
): Promise<RawEvent[]> {
  const params = new URLSearchParams({
    dates: `${formatEspnDate(startDate)}-${formatEspnDate(endDate)}`,
  })
  const response = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error("Texans schedule request failed.")
  }

  const data = (await response.json()) as EspnScoreboardResponse

  return (data.events ?? [])
    .filter((event) => event.name?.includes("Houston Texans"))
    .map((event) => ({
      ...mapEspnEventToRawEvent(event, {
        category: "texans",
        label: "Texans",
        durationMs: footballDurationMs,
      }),
      id: `espn-texans-${event.id}`,
      title: buildTexansTitle(event),
      description: "Texans game from ESPN's scoreboard feed.",
    }))
}
