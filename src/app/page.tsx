"use client"

import { SbCalendarGrid, type SbCalendarEvent } from "@/components/calendar";
import {
  SbAstrosHighlightCard,
  SbEventCardSkeleton,
} from "@/components/events";
import { OfflineBanner, SbEmptyState } from "@/components/feedback";
import { SbContainer, SbSection, SbSectionHeader } from "@/components/layout";
import { SbBottomNav } from "@/components/navigation";
import { SbPromoCard } from "@/components/promos";
import { SbBadge, SbButton, SbCard } from "@/components/ui";
import {
  useCalendarEvents,
  useUpcomingEvents,
  type UIEvent,
} from "@/features/events";
import tuesdaySpecialPromo from "../../Ads/AISelect_20260515_201550_Facebook.jpg";
import crawfishPromo from "../../Ads/facebook_1778893673441_7461220850091226236.jpg";
import dartTournamentPromo from "../../Ads/image000000.jpg";

const promoCards = [
  {
    image: tuesdaySpecialPromo,
    alt: "Skoltz Tuesday specials graphic",
    title: "Tuesday specials",
    subtitle: "Tacos, Ziegenbock pints, wells, and featured shots.",
    ctaText: "Ask at the bar",
  },
  {
    image: crawfishPromo,
    alt: "Skoltz crawfish special graphic",
    title: "Crawfish night",
    subtitle: "Seasonal food special with cold drinks and loud vibes.",
    ctaText: "Limited run",
  },
  {
    image: dartTournamentPromo,
    alt: "Skoltz dart tournament graphic",
    title: "Dart tournament",
    subtitle: "Blind draw partners, added prize money, and signups on site.",
    ctaText: "Join in",
  },
];

const companionCategoryTone: Record<
  UIEvent["primaryCategory"],
  "blue" | "red" | "success" | "warning"
> = {
  astros: "blue",
  rockets: "red",
  texans: "blue",
  karaoke: "warning",
  pool: "success",
};

const companionPriority: Record<UIEvent["primaryCategory"], number> = {
  karaoke: 0,
  pool: 1,
  astros: 2,
  rockets: 3,
  texans: 4,
};

const eventCategoryTone = companionCategoryTone;

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function eventOccursOnDate(event: UIEvent, targetDateKey: string) {
  return (
    dateKey(event.startTime) === targetDateKey ||
    dateKey(event.endTime) === targetDateKey
  );
}

function isOngoingEvent(event: UIEvent, currentTime: Date) {
  const currentTimeValue = currentTime.getTime();

  return (
    currentTimeValue >= event.startTime.getTime() &&
    currentTimeValue < event.endTime.getTime()
  );
}

function isFutureEvent(event: UIEvent, currentTime: Date) {
  return event.startTime.getTime() >= currentTime.getTime();
}

function sortEventsByStartTime(events: UIEvent[]) {
  return [...events].sort(
    (firstEvent, secondEvent) =>
      firstEvent.startTime.getTime() - secondEvent.startTime.getTime()
  );
}

function selectFeaturedAstrosEvent(events: UIEvent[], currentTime: Date) {
  const todayKey = dateKey(currentTime);
  const sortedAstrosEvents = sortEventsByStartTime(
    events.filter(
      (event) => event.isAstros && isFutureEvent(event, currentTime)
    )
  );
  const todayAstrosEvent = sortedAstrosEvents.find((event) =>
    eventOccursOnDate(event, todayKey)
  );

  return todayAstrosEvent ?? sortedAstrosEvents[0];
}

const sameDayLabelFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const calendarMonthLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

function CompactEventCard({ event }: { event: UIEvent }) {
  return (
    <a
      href="#calendar"
      className="min-w-64 max-w-72 shrink-0 rounded-lg border border-border bg-card p-3 shadow-[var(--sb-shadow-sm)] transition hover:border-primary/50 hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-w-72"
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {event.categories.map((category) => (
            <SbBadge key={category} tone={eventCategoryTone[category]}>
              {category}
            </SbBadge>
          ))}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">
            {event.displayDate} - {event.displayTime}
          </p>
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-foreground">
            {event.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
            {event.description}
          </p>
        </div>

        <p className="text-sm font-semibold text-primary">View date</p>
      </div>
    </a>
  );
}

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
  const today = new Date();
  const calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const calendarMonthLabel = calendarMonthLabelFormatter.format(calendarMonth);
  const upcomingQuery = useUpcomingEvents();
  const calendarQuery = useCalendarEvents(calendarMonth);

  const queryEvents = upcomingQuery.data ?? [];
  const events = queryEvents;
  const ongoingEvents = sortEventsByStartTime(
    events.filter((event) => isOngoingEvent(event, today))
  );
  const featuredAstrosEvent = selectFeaturedAstrosEvent(events, today);
  const todayKey = dateKey(today);
  const todayLabel = sameDayLabelFormatter.format(today);
  const companionEvents = featuredAstrosEvent
    ? events
        .filter(
          (event) =>
            event.id !== featuredAstrosEvent.id &&
            isFutureEvent(event, today) &&
            eventOccursOnDate(event, todayKey)
        )
        .sort(
          (firstEvent, secondEvent) =>
            companionPriority[firstEvent.primaryCategory] -
              companionPriority[secondEvent.primaryCategory] ||
            firstEvent.startTime.getTime() - secondEvent.startTime.getTime()
        )
    : [];
  const ongoingEventIds = new Set(ongoingEvents.map((event) => event.id));
  const companionEventIds = new Set(companionEvents.map((event) => event.id));
  const upcomingEvents = sortEventsByStartTime(
    events.filter(
      (event) =>
        isFutureEvent(event, today) &&
        event.id !== featuredAstrosEvent?.id &&
        !companionEventIds.has(event.id) &&
        !ongoingEventIds.has(event.id)
    )
  );
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
      <main id="home" className="flex-1 pb-28">
        <SbSection className="py-8 sm:py-12">
          <SbContainer className="space-y-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <SbBadge tone="blue">Skoltz</SbBadge>
                <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
                  Tonight at Skoltz
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  Catch tonight&apos;s games, events, and specials before you get
                  to the bar.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <SbButton asChild href="/login">
                  Sign In
                </SbButton>
                <SbButton asChild href="/rewards" variant="secondary">
                  Rewards
                </SbButton>
              </div>
            </div>

            <SbCard className="flex flex-col gap-3 bg-surface-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Rewards and check-ins</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Sign in to view rewards and check in when you are at Skoltz.
                </p>
              </div>
              <SbButton asChild href="/login" variant="ghost">
                Account Login
              </SbButton>
            </SbCard>

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
                    We could not load the latest Skoltz events. Try again in a
                    moment.
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
                description="There are no scheduled events on the calendar right now."
              />
            ) : null}

            {!isLoading && !isError && featuredAstrosEvent ? (
              <div className="space-y-4">
                <SbAstrosHighlightCard
                  title={featuredAstrosEvent.title}
                  description={featuredAstrosEvent.description}
                  dateTime={`${featuredAstrosEvent.displayDate} - ${featuredAstrosEvent.displayTime}`}
                  cta={
                    <SbButton asChild className="w-full sm:w-auto" href="#calendar">
                      View on calendar
                    </SbButton>
                  }
                />

                {companionEvents.length > 0 ? (
                  <SbCard className="space-y-3 border-primary/30 bg-surface-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase text-primary">
                          Also tonight
                        </p>
                        <h2 className="text-xl font-semibold">
                          More happening with the game
                        </h2>
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {todayLabel}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {companionEvents.map((event) => (
                        <a
                          key={event.id}
                          href="#calendar"
                          className="rounded-md border border-border bg-surface-1 p-3 transition hover:border-primary/50 hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 space-y-1">
                              <SbBadge
                                tone={companionCategoryTone[event.primaryCategory]}
                              >
                                {event.primaryCategory}
                              </SbBadge>
                              <h3 className="truncate text-base font-semibold text-foreground">
                                {event.title}
                              </h3>
                              <p className="text-sm font-semibold text-muted-foreground">
                                {event.displayTime}
                              </p>
                            </div>
                            <span className="shrink-0 text-sm font-semibold text-primary">
                              View
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </SbCard>
                ) : null}
              </div>
            ) : null}
          </SbContainer>
        </SbSection>

        {!isLoading && !isError && ongoingEvents.length > 0 ? (
          <SbSection className="py-6">
            <SbContainer className="space-y-5">
              <SbSectionHeader
                title="Happening now"
                subtitle="Events already underway at Skoltz."
              />

              <div className="flex gap-3 overflow-x-auto pb-2">
                {ongoingEvents.map((event) => (
                  <CompactEventCard key={event.id} event={event} />
                ))}
              </div>
            </SbContainer>
          </SbSection>
        ) : null}

        <SbSection className="py-8">
          <SbContainer className="space-y-5">
            <SbSectionHeader
              title="Featured specials"
              subtitle="Food, drinks, and venue promos happening around the bar."
            />

            <div className="flex gap-4 overflow-x-auto pb-2">
              {promoCards.map((promo) => (
                <SbPromoCard
                  key={promo.title}
                  image={promo.image}
                  alt={promo.alt}
                  title={promo.title}
                  subtitle={promo.subtitle}
                  ctaText={promo.ctaText}
                  className="min-w-72 max-w-80 shrink-0 sm:min-w-80 lg:min-w-0 lg:flex-1"
                />
              ))}
            </div>
          </SbContainer>
        </SbSection>

        <SbSection className="py-8">
          <SbContainer className="space-y-5">
            <SbSectionHeader
              title="Upcoming events"
              subtitle="Plan your next visit around games, karaoke, pool, and bar events."
              action={
                <SbButton asChild href="#calendar" variant="ghost" size="sm">
                  Open calendar
                </SbButton>
              }
            />

            {isLoading ? (
              <div className="flex gap-3 overflow-hidden">
                <SbEventCardSkeleton />
                <SbEventCardSkeleton />
                <SbEventCardSkeleton />
              </div>
            ) : null}

            {!isLoading && !isError && upcomingEvents.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {upcomingEvents.map((event) => (
                  <CompactEventCard key={event.id} event={event} />
                ))}
              </div>
            ) : null}
          </SbContainer>
        </SbSection>

        <SbSection id="calendar" className="bg-surface-1/40 py-8 sm:py-12">
          <SbContainer className="space-y-5">
            <SbSectionHeader
              title="Event calendar"
              subtitle="Browse upcoming nights at Skoltz by date."
              action={
                <p className="text-sm font-semibold text-muted-foreground">
                  {calendarMonthLabel}
                </p>
              }
            />

            <SbCard className="p-2 sm:p-4">
              <p className="px-2 pb-3 text-sm font-semibold text-muted-foreground sm:px-0">
                Tap any day to see what&apos;s happening.
              </p>
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
                  today={today}
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
