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

const calendarMonth = new Date(2026, 4, 1);

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
            ) : null}
          </SbContainer>
        </SbSection>

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
                      <SbButton asChild href="#calendar" variant="secondary" size="sm">
                        View date
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
              title="Event calendar"
              subtitle="Browse upcoming nights at Skoltz by date."
              action={
                <p className="text-sm font-semibold text-muted-foreground">
                  May 2026
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
