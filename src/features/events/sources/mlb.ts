import { type LiveScore, type RawEvent } from "../types"

const astrosTeamId = 117
const estimatedGameDurationMs = 3.5 * 60 * 60 * 1000

type MlbScheduleResponse = {
  dates?: Array<{
    games?: MlbGame[]
  }>
}

type MlbGame = {
  gamePk: number
  gameType?: string
  gameDate: string
  description?: string
  seriesDescription?: string
  status?: {
    abstractGameState?: string
    detailedState?: string
  }
  teams: {
    away: {
      score?: number
      team: {
        id: number
        name: string
      }
    }
    home: {
      score?: number
      team: {
        id: number
        name: string
      }
    }
  }
  venue?: {
    name?: string
  }
}

function getMlbTeamLogoUrl(teamId: number) {
  return `https://www.mlbstatic.com/team-logos/${teamId}.svg`
}

function getMlbGameLogoUrls(game: MlbGame) {
  return [
    getMlbTeamLogoUrl(game.teams.away.team.id),
    getMlbTeamLogoUrl(game.teams.home.team.id),
  ]
}

function getMlbGamedayUrl(game: MlbGame) {
  return `https://www.mlb.com/gameday/${game.gamePk}`
}

function getMlbLiveScore(game: MlbGame): LiveScore {
  const status = game.status?.detailedState ?? "Game status"

  return {
    provider: "MLB",
    status,
    isLive: game.status?.abstractGameState === "Live",
    teams: [
      {
        name: game.teams.away.team.name,
        abbreviation: game.teams.away.team.name,
        score: String(game.teams.away.score ?? 0),
        logoUrl: getMlbTeamLogoUrl(game.teams.away.team.id),
        homeAway: "away",
      },
      {
        name: game.teams.home.team.name,
        abbreviation: game.teams.home.team.name,
        score: String(game.teams.home.score ?? 0),
        logoUrl: getMlbTeamLogoUrl(game.teams.home.team.id),
        homeAway: "home",
      },
    ],
  }
}

function formatSourceDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function buildAstrosTitle(game: MlbGame) {
  const awayTeam = game.teams.away.team.name
  const homeTeam = game.teams.home.team.name
  const opponent = homeTeam === "Houston Astros" ? awayTeam : homeTeam
  const prefix = homeTeam === "Houston Astros" ? "Astros vs" : "Astros at"

  return `${prefix} ${opponent.replace("Houston ", "")}`
}

function mapMlbGameToRawEvent(game: MlbGame): RawEvent {
  const startTime = new Date(game.gameDate)
  const endTime = new Date(startTime.getTime() + estimatedGameDurationMs)

  return {
    id: `mlb-astros-${game.gamePk}`,
    title: buildAstrosTitle(game),
    description: "Astros game from the official MLB schedule.",
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    categories: ["astros"],
    location: game.venue?.name ?? "Astros game",
    logoUrls: getMlbGameLogoUrls(game),
    sourceUrl: getMlbGamedayUrl(game),
    liveScore: getMlbLiveScore(game),
  }
}

function buildMlbPostseasonTitle(game: MlbGame) {
  const awayTeam = game.teams.away.team.name
  const homeTeam = game.teams.home.team.name

  return `MLB Playoffs: ${awayTeam} at ${homeTeam}`
}

function mapMlbPostseasonGameToRawEvent(game: MlbGame): RawEvent {
  const startTime = new Date(game.gameDate)
  const endTime = new Date(startTime.getTime() + estimatedGameDurationMs)
  const seriesDescription = game.seriesDescription ?? game.description

  return {
    id: `mlb-postseason-${game.gamePk}`,
    title: buildMlbPostseasonTitle(game),
    description: seriesDescription
      ? `${seriesDescription} from the official MLB schedule.`
      : "MLB postseason game from the official MLB schedule.",
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    categories: ["mlb"],
    location: game.venue?.name ?? "MLB postseason game",
    logoUrls: getMlbGameLogoUrls(game),
    sourceUrl: getMlbGamedayUrl(game),
    liveScore: getMlbLiveScore(game),
  }
}

export async function readMlbAstrosEvents(
  startDate: Date,
  endDate: Date
): Promise<RawEvent[]> {
  const params = new URLSearchParams({
    sportId: "1",
    teamId: String(astrosTeamId),
    startDate: formatSourceDate(startDate),
    endDate: formatSourceDate(endDate),
  })
  const response = await fetch(
    `https://statsapi.mlb.com/api/v1/schedule?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error("MLB schedule request failed.")
  }

  const data = (await response.json()) as MlbScheduleResponse

  return (data.dates ?? [])
    .flatMap((date) => date.games ?? [])
    .filter((game) => game.gameType === "R")
    .map(mapMlbGameToRawEvent)
}

export async function readMlbPostseasonEvents(
  startDate: Date,
  endDate: Date
): Promise<RawEvent[]> {
  const params = new URLSearchParams({
    sportId: "1",
    startDate: formatSourceDate(startDate),
    endDate: formatSourceDate(endDate),
    gameTypes: "F,D,L,W",
  })
  const response = await fetch(
    `https://statsapi.mlb.com/api/v1/schedule?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error("MLB postseason schedule request failed.")
  }

  const data = (await response.json()) as MlbScheduleResponse

  return (data.dates ?? [])
    .flatMap((date) => date.games ?? [])
    .map(mapMlbPostseasonGameToRawEvent)
}
