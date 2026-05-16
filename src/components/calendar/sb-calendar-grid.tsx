import { SbCalendarDay, type SbCalendarEvent } from "./sb-calendar-day"
import { SbDayDetail } from "./sb-day-detail"

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function buildMonthDays(month: Date) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1)
  const gridStart = new Date(year, monthIndex, 1 - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)

    return date
  })
}

export function SbCalendarGrid({
  month,
  eventsByDate,
  today,
}: {
  month: Date
  eventsByDate: Record<string, SbCalendarEvent[]>
  today?: Date
}) {
  const days = buildMonthDays(month)
  const todayKey = today ? dateKey(today) : undefined

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((weekday) => (
          <div
            key={weekday}
            className="flex h-8 items-center justify-center text-[0.6875rem] font-semibold uppercase tracking-normal text-muted-foreground"
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6 gap-1">
        {days.map((day) => {
          const key = dateKey(day)
          const events = eventsByDate[key] ?? []
          const popoverId = `day-detail-${key}`

          return (
            <div key={key} className="min-w-0">
              <SbCalendarDay
                date={day}
                events={events}
                isCurrentMonth={day.getMonth() === month.getMonth()}
                isToday={key === todayKey}
                hasAstrosHighlight={events.some(
                  (event) => event.kind === "astros"
                )}
                popoverTarget={popoverId}
              />
              <SbDayDetail id={popoverId} date={day} events={events} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
