"use client"

import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/queryKeys"
import {
  createSupabaseBrowserClient,
  hasSupabaseConfig,
} from "@/lib/supabase/client"

import { adaptRawEvents, groupUIEventsByDate } from "./adapters"
import { rawMockEvents } from "./mock/events"
import { type EventCategory, type RawEvent, type UIEvent } from "./types"

const eventStaleTime = 5 * 60 * 1000

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

function readEvents(): Promise<RawEvent[]> {
  return hasSupabaseConfig() ? readSupabaseEvents() : readMockEvents()
}

function isPublicEvent(rawEvent: RawEvent) {
  return !rawEvent.categories.includes("pool")
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

export function useUpcomingEvents() {
  return useQuery({
    queryKey: queryKeys.events.upcoming,
    queryFn: async () => {
      const rawEvents = await readEvents()
      const events = adaptRawEvents(rawEvents.filter(isPublicEvent))

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
      const rawEvents = await readEvents()
      const events = adaptRawEvents(rawEvents.filter(isPublicEvent)).filter((event) =>
        isInMonth(event, month)
      )

      return groupUIEventsByDate(events)
    },
    staleTime: eventStaleTime,
    refetchInterval: false,
  })
}
