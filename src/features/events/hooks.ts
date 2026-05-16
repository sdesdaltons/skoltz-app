"use client"

import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/queryKeys"
import {
  createSupabaseBrowserClient,
  hasSupabaseConfig,
} from "@/lib/supabase/client"

import { adaptRawEvents, groupUIEventsByDate } from "./adapters"
import { rawMockEvents } from "./mock/events"
import { readEspnPostseasonEvents } from "./sources/espn"
import { readMlbAstrosEvents, readMlbPostseasonEvents } from "./sources/mlb"
import { type EventCategory, type RawEvent, type UIEvent } from "./types"

const eventStaleTime = 5 * 60 * 1000
const upcomingSportsWindowDays = 45
const venueTimeZone = "America/Chicago"
const venueWeekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: venueTimeZone,
  weekday: "short",
})

type EventRow = {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  categories: EventCategory[]
  location: string | null
}

function waitForMockLatency() {
  const latency = 500 + Math.floor(Math.random() * 501)

  return new Promise((resolve) => setTimeout(resolve, latency))
}

async function readMockEvents(): Promise<RawEvent[]> {
  await waitForMockLatency()

  if (Math.random() < 0.1) {
    throw new Error("Mock event request failed")
  }

  return rawMockEvents
}

function mapEventRowToRawEvent(row: EventRow): RawEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    startTime: row.start_time,
    endTime: row.end_time,
    categories: row.categories,
    location: row.location ?? "",
  }
}

async function readSupabaseEvents(): Promise<RawEvent[]> {
  const supabase = createSupabaseBrowserClient()

  if (!supabase) {
    return readMockEvents()
  }

  const { data, error } = await supabase
    .from("events")
    .select("id,title,description,start_time,end_time,categories,location")
    .order("start_time", { ascending: true })
    .returns<EventRow[]>()

  if (error) {
    throw error
  }

  return (data ?? []).map(mapEventRowToRawEvent)
}

async function readVenueEvents(): Promise<RawEvent[]> {
  return hasSupabaseConfig() ? readSupabaseEvents() : readMockEvents()
}

async function readSourceBackedSportsEvents(
  startDate: Date,
  endDate: Date
): Promise<RawEvent[]> {
  const results = await Promise.allSettled([
    readMlbAstrosEvents(startDate, endDate),
    readMlbPostseasonEvents(startDate, endDate),
    readEspnPostseasonEvents(startDate, endDate),
  ])

  return results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  )
}

async function readEvents(startDate: Date, endDate: Date): Promise<RawEvent[]> {
  const [venueEvents, sportsEvents] = await Promise.all([
    readVenueEvents(),
    readSourceBackedSportsEvents(startDate, endDate),
  ])

  return [...venueEvents, ...sportsEvents]
}

function isPublicEvent(rawEvent: RawEvent) {
  const isKaraoke = rawEvent.categories.includes("karaoke")
  const isSourceBackedSportsEvent =
    rawEvent.id.startsWith("mlb-astros-") ||
    rawEvent.id.startsWith("mlb-postseason-") ||
    rawEvent.id.startsWith("espn-nba-postseason-") ||
    rawEvent.id.startsWith("espn-nfl-postseason-")
  const isSportsEvent = rawEvent.categories.some((category) =>
    ["astros", "rockets", "texans", "mlb", "nba", "nfl"].includes(category)
  )

  if (isKaraoke && venueWeekdayFormatter.format(new Date(rawEvent.startTime)) !== "Fri") {
    return false
  }

  return (
    !rawEvent.categories.includes("pool") &&
    !rawEvent.categories.includes("rockets") &&
    !rawEvent.categories.includes("texans") &&
    (!isSportsEvent || isSourceBackedSportsEvent)
  )
}

function monthKey(month: Date) {
  const year = month.getFullYear()
  const monthValue = String(month.getMonth() + 1).padStart(2, "0")

  return `${year}-${monthValue}`
}

function isInMonth(event: UIEvent, month: Date) {
  return (
    event.startTime.getFullYear() === month.getFullYear() &&
    event.startTime.getMonth() === month.getMonth()
  )
}

function startOfToday() {
  const today = new Date()

  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date)

  nextDate.setDate(date.getDate() + days)

  return nextDate
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: queryKeys.events.upcoming,
    queryFn: async () => {
      const startDate = startOfToday()
      const endDate = addDays(startDate, upcomingSportsWindowDays)
      const rawEvents = await readEvents(startDate, endDate)
      const events = adaptRawEvents(rawEvents.filter(isPublicEvent)).filter(
        (event) => event.endTime.getTime() >= startDate.getTime()
      )

      return events.sort(
        (firstEvent, secondEvent) =>
          firstEvent.startTime.getTime() - secondEvent.startTime.getTime()
      )
    },
    staleTime: eventStaleTime,
    refetchInterval: false,
  })
}

export function useCalendarEvents(month: Date) {
  return useQuery({
    queryKey: queryKeys.events.calendar(monthKey(month)),
    queryFn: async () => {
      const rawEvents = await readEvents(startOfMonth(month), endOfMonth(month))
      const events = adaptRawEvents(rawEvents.filter(isPublicEvent)).filter((event) =>
        isInMonth(event, month)
      )

      return groupUIEventsByDate(events)
    },
    staleTime: eventStaleTime,
    refetchInterval: false,
  })
}
