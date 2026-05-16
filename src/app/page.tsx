"use client"

import { SbCalendarGrid, type SbCalendarEvent } from "@/components/calendar";
import {
  SbAstrosHighlightCard,
  SbEventCard,
  SbEventCardSkeleton,
} from "@/components/events";
import { OfflineBanner, SbEmptyState } from "@/components/feedback";
import { SbContainer, SbSection, SbSectionHeader } from "@/components/layout";
import { SbBottomNav } from "@/components/navigation";
import { SbBadge, SbButton, SbCard } from "@/components/ui";
import {
  useCalendarEvents,
  useUpcomingEvents,
  type UIEvent,
} from "@/features/events";

const calendarMonth = new Date(2026, 4, 1);

function toCalendarEvent(event: UIEvent): SbCalendarEvent {
  return {
    id: event.id,
    title: event.title,
    kind: event.primaryCategory,
    time: event.displayTime,
  };
}

function toCalendarEventsByDate(
  eventsByDate: Record<string, UIEvent[]> | undefined
): Record<string, SbCalendarEvent[]> {
  return Object.fromEntries(
    Object.entries(eventsByDate ?? {}).map(([date, events]) => [
      date,
      events.map(toCalendarEvent),
    ])
  ) as Record<string, SbCalendarEvent[]>;
}

export default function Home() {
  const upcomingQuery = useUpcomingEvents();
  const calendarQuery = useCalendarEvents(calendarMonth);

  const queryEvents = upcomingQuery.data ?? [];
  const events = queryEvents;
  const featuredAstrosEvent = events.find((event) => event.isAstros);
  const upcomingEvents = featuredAstrosEvent
    ? events.filter((event) => event.id !== featuredAstrosEvent.id)
    : events;
  const calendarEvents = toCalendarEventsByDate(calendarQuery.data);
  const isLoading = upcomingQuery.isLoading || calendarQuery.isLoading;
  const isError = upcomingQuery.isError || calendarQuery.isError;
  const isEmpty = !isLoading && !isError && events.length === 0;

  function retryQueries() {
    void upcomingQuery.refetch();
    void calendarQuery.refetch();
  }

  return (
    <>
      <OfflineBanner />
      <main id="home" className="flex-1 pb-24 md:pb-0">
        <SbSection className="py-8 sm:py-12">
          <SbContainer className="space-y-6">
            <div className="space-y-3">
              <SbBadge tone="blue">Skoltz</SbBadge>
              <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
                Tonight at Skoltz
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                Static event composition preview for the calendar, venue
                programming, and mobile navigation layer.
              </p>
            </div>

            {isLoading ? (
              <SbEventCardSkeleton className="min-h-72 border-primary/40 bg-primary/10 shadow-[var(--sb-glow-blue)]" />
            ) : null}

            {isError ? (
              <SbCard className="space-y-4 border-destructive/50 bg-surface-2">
                <div className="space-y-2">
                  <SbBadge tone="red">Error</SbBadge>
                  <h2 className="text-2xl font-semibold">
                    Events did not load
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    The mock query failed. Retry to request the local mock data
                    again.
                  </p>
                </div>
                <SbButton type="button" variant="secondary" onClick={retryQueries}>
                  Retry
                </SbButton>
              </SbCard>
            ) : null}

            {isEmpty ? (
              <SbEmptyState
                title="No events yet"
                description="The mock query returned no adapted events for this preview."
              />
            ) : null}

            {!isLoading && !isError && featuredAstrosEvent ? (
              <SbAstrosHighlightCard
                title={featuredAstrosEvent.title}
                description={featuredAstrosEvent.description}
                dateTime={`${featuredAstrosEvent.displayDate} - ${featuredAstrosEvent.displayTime}`}
                cta={
                  <SbButton type="button" className="w-full sm:w-auto">
                    Add to plan
                  </SbButton>
                }
              />
            ) : null}
          </SbContainer>
        </SbSection>

        <SbSection className="py-8">
          <SbContainer className="space-y-5">
            <SbSectionHeader
              title="Upcoming events"
              subtitle="Reusable cards composed from adapted mock query data."
              action={
                <SbButton type="button" variant="ghost" size="sm">
                  View all
                </SbButton>
              }
            />

            {isLoading ? (
              <div className="grid gap-4 lg:grid-cols-3">
                <SbEventCardSkeleton />
                <SbEventCardSkeleton />
                <SbEventCardSkeleton />
              </div>
            ) : null}

            {!isLoading && !isError && upcomingEvents.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <SbEventCard
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    dateTime={`${event.displayDate} - ${event.displayTime}`}
                    categories={event.categories}
                    cta={
                      <SbButton type="button" variant="secondary" size="sm">
                        Details
                      </SbButton>
                    }
                  />
                ))}
              </div>
            ) : null}
          </SbContainer>
        </SbSection>

        <SbSection id="calendar" className="bg-surface-1/40 py-8 sm:py-12">
          <SbContainer className="space-y-5">
            <SbSectionHeader
              title="Calendar preview"
              subtitle="Mock month grid from adapted calendar query data."
              action={
                <p className="text-sm font-semibold text-muted-foreground">
                  May 2026
                </p>
              }
            />

            <SbCard className="p-2 sm:p-4">
              {calendarQuery.isLoading ? (
                <div className="grid grid-cols-7 grid-rows-6 gap-1">
                  {Array.from({ length: 42 }, (_, index) => (
                    <div
                      key={index}
                      className="aspect-square min-h-12 rounded-md bg-surface-2"
                    />
                  ))}
                </div>
              ) : (
                <SbCalendarGrid
                  month={calendarMonth}
                  today={new Date(2026, 4, 15)}
                  eventsByDate={calendarEvents}
                />
              )}
            </SbCard>
          </SbContainer>
        </SbSection>
      </main>

      <SbBottomNav active="Home" />
    </>
  );
}
