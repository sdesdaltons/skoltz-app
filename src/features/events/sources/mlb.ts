import { type RawEvent } from "../types"

const astrosTeamId = 117
const estimatedGameDurationMs = 3.5 * 60 * 60 * 1000

type MlbScheduleResponse = {
  dates?: Array<{
    games?: MlbGame[]
  }>
}

type MlbGame = {
  gamePk: number
  gameDate: string
  status?: {
    detailedState?: string
  }
  teams: {
    away: {
      team: {
        name: string
      }
    }
    home: {
      team: {
        name: string
      }
    }
  }
  venue?: {
    name?: string
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
    .map(mapMlbGameToRawEvent)
}
