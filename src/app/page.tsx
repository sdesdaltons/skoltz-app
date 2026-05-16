"use client"

import { useEffect, useState } from "react";

import { SbCalendarGrid, type SbCalendarEvent } from "@/components/calendar";
import { SbLogo } from "@/components/branding";
import {
  SbAstrosHighlightCard,
  SbEventCardSkeleton,
} from "@/components/events";
import {
  OfflineBanner,
  PwaInstallBanner,
  SbEmptyState,
} from "@/components/feedback";
import { SbContainer, SbSection, SbSectionHeader } from "@/components/layout";
import { SbBottomNav } from "@/components/navigation";
import { SbPromoCard } from "@/components/promos";
import { SbBadge, SbButton, SbCard } from "@/components/ui";
import {
  useCalendarEvents,
  useUpcomingEvents,
  type UIEvent,
} from "@/features/events";
import { useAuth } from "@/features/auth/hooks";
import { useRewards, type UIReward } from "@/features/rewards";
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

const startingSoonWindowMs = 2 * 60 * 60 * 1000;
const tonightWindowEndHour = 4;

function eventCategoryTone(
  category: UIEvent["primaryCategory"]
): "blue" | "red" | "success" | "warning" | "neutral" {
  if (category === "astros" || category === "texans") {
    return "blue";
  }

  if (category === "rockets") {
    return "red";
  }

  if (category === "karaoke") {
    return "warning";
  }

  return "neutral";
}

function categoryPriority(category: UIEvent["primaryCategory"]) {
  if (category === "karaoke") {
    return 0;
  }

  if (category === "rockets") {
    return 1;
  }

  if (category === "texans") {
    return 2;
  }

  if (category === "astros") {
    return 3;
  }

  return 4;
}

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

function isFriday(date: Date) {
  return date.getDay() === 5;
}

function isFridayNightWindow(date: Date) {
  return isFriday(date) || (date.getDay() === 6 && date.getHours() < 4);
}

function isKaraokeEvent(event: UIEvent) {
  return event.categories.includes("karaoke");
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

function isStartingSoonEvent(event: UIEvent, currentTime: Date) {
  const timeUntilStart = event.startTime.getTime() - currentTime.getTime();

  return timeUntilStart >= 0 && timeUntilStart <= startingSoonWindowMs;
}

function isFutureTonightEvent(event: UIEvent, currentTime: Date) {
  return (
    isFutureEvent(event, currentTime) &&
    eventOccursOnDate(event, dateKey(currentTime))
  );
}

function isCurrentOrFutureEvent(event: UIEvent, currentTime: Date) {
  return event.endTime.getTime() > currentTime.getTime();
}

function isSameNightEvent(event: UIEvent, currentTime: Date) {
  const currentDateKey = dateKey(currentTime);
  const tomorrow = new Date(currentTime);

  tomorrow.setDate(currentTime.getDate() + 1);

  const isLateNightCarryover =
    event.startTime.getHours() < tonightWindowEndHour &&
    dateKey(event.startTime) === dateKey(tomorrow);

  return eventOccursOnDate(event, currentDateKey) || isLateNightCarryover;
}

function selectFridayKaraokeEvent(events: UIEvent[], currentTime: Date) {
  if (!isFridayNightWindow(currentTime)) {
    return undefined;
  }

  return sortEventsByStartTime(
    events.filter(
      (event) =>
        isKaraokeEvent(event) &&
        isCurrentOrFutureEvent(event, currentTime) &&
        isSameNightEvent(event, currentTime)
    )
  )[0];
}

function sortEventsByStartTime(events: UIEvent[]) {
  return [...events].sort(
    (firstEvent, secondEvent) =>
      firstEvent.startTime.getTime() - secondEvent.startTime.getTime()
  );
}

function sortEventsByLifecyclePriority(events: UIEvent[]) {
  return [...events].sort(
    (firstEvent, secondEvent) =>
      categoryPriority(firstEvent.primaryCategory) -
        categoryPriority(secondEvent.primaryCategory) ||
      firstEvent.startTime.getTime() - secondEvent.startTime.getTime()
  );
}

function sortEventsByFuturePriority(events: UIEvent[]) {
  return [...events].sort(
    (firstEvent, secondEvent) =>
      firstEvent.startTime.getTime() - secondEvent.startTime.getTime() ||
      categoryPriority(firstEvent.primaryCategory) -
        categoryPriority(secondEvent.primaryCategory)
  );
}

function selectFocalEvent(events: UIEvent[], currentTime: Date) {
  const startingSoonEvents = sortEventsByLifecyclePriority(
    events.filter(
      (event) =>
        isStartingSoonEvent(event, currentTime) &&
        isSameNightEvent(event, currentTime)
    )
  );
  const ongoingEvents = sortEventsByLifecyclePriority(
    events.filter(
      (event) =>
        isOngoingEvent(event, currentTime) && isSameNightEvent(event, currentTime)
    )
  );
  const fridayKaraokeEvent = selectFridayKaraokeEvent(events, currentTime);
  const futureTonightEvents = sortEventsByLifecyclePriority(
    events.filter(
      (event) =>
        isFutureTonightEvent(event, currentTime) &&
        isSameNightEvent(event, currentTime)
    )
  );
  const futureEvents = sortEventsByFuturePriority(
    events.filter((event) => isFutureEvent(event, currentTime))
  );

  return (
    ongoingEvents[0] ??
    startingSoonEvents[0] ??
    fridayKaraokeEvent ??
    futureTonightEvents[0] ??
    futureEvents[0]
  );
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

function CompactEventCard({
  event,
  currentTime,
  showAstrosSpecials = false,
}: {
  event: UIEvent;
  currentTime: Date;
  showAstrosSpecials?: boolean;
}) {
  const statusLabel = getFocalStatusLabel(event, currentTime);
  const showStatus = statusLabel !== "Featured";
  const isFridayKaraoke =
    isFridayNightWindow(currentTime) &&
    isKaraokeEvent(event) &&
    isSameNightEvent(event, currentTime);

  return (
    <a
      href="#calendar"
      className="min-w-52 max-w-60 shrink-0 rounded-md border border-border/70 bg-card p-2.5 shadow-[var(--sb-shadow-sm)] transition hover:border-primary/30 hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-w-60"
    >
      <div className="space-y-1.5">
        <div className="flex flex-wrap gap-1.5">
          {event.categories.map((category) => (
            <SbBadge key={category} tone={eventCategoryTone(category)}>
              {category}
            </SbBadge>
          ))}
          {isFridayKaraoke ? (
            <SbBadge tone="warning">Friday feature</SbBadge>
          ) : null}
          {showStatus ? <SbBadge tone="blue">{statusLabel}</SbBadge> : null}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">
            {event.displayDate} - {event.displayTime}
          </p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
            {event.title}
          </h3>
          {showAstrosSpecials && event.isAstros ? (
            <p className="text-xs font-semibold text-muted-foreground">
              $2 Hot Dogs / $2 Ziegenbock Pints
            </p>
          ) : null}
        </div>

        <p className="text-xs font-semibold text-primary">View date</p>
      </div>
    </a>
  );
}

function RewardsHowItWorks() {
  const steps = [
    ["1", "Check in", "Open rewards when you arrive at Skoltz."],
    ["2", "Earn points", "Skoltz confirms eligible visits after check-in."],
    ["3", "Use rewards", "View available rewards from your account."],
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {steps.map(([step, title, description]) => (
        <div
          key={step}
          className="rounded-md border border-border/70 bg-surface-1 p-2.5"
        >
          <div className="flex items-start gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary/40 bg-primary/15 text-xs font-semibold text-primary">
              {step}
            </span>
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-xs leading-5 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RewardProgress({
  signedIn,
  nextReward,
}: {
  signedIn: boolean;
  nextReward?: UIReward;
}) {
  return (
    <div className="space-y-2 rounded-md border border-border/70 bg-surface-1 p-2.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          Reward progress
        </p>
        {nextReward ? (
          <span className="text-xs font-semibold text-primary">
            Next: {nextReward.pointsLabel}
          </span>
        ) : null}
      </div>
      <div className="h-2 overflow-hidden rounded-sm bg-surface-2">
        <div
          className="h-full rounded-sm bg-primary/70"
          style={{ width: "0%" }}
        />
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        {signedIn
          ? "Check in at Skoltz to start building toward available rewards."
          : "Sign in before you check in so rewards progress can be tracked."}
      </p>
    </div>
  );
}

function RewardExamples({ rewards }: { rewards: UIReward[] }) {
  if (rewards.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {rewards.slice(0, 3).map((reward) => (
        <div
          key={reward.id}
          className="min-w-48 rounded-md border border-border/70 bg-surface-1 p-2.5"
        >
          <SbBadge tone="success">{reward.pointsLabel}</SbBadge>
          <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">
            {reward.title}
          </h3>
        </div>
      ))}
    </div>
  );
}

function getFocalStatusLabel(event: UIEvent, currentTime: Date) {
  if (isOngoingEvent(event, currentTime)) {
    return "Happening now";
  }

  if (isStartingSoonEvent(event, currentTime)) {
    return "Starting soon";
  }

  return "Featured";
}

function FocalEventCard({
  event,
  currentTime,
}: {
  event: UIEvent;
  currentTime: Date;
}) {
  const isFridayKaraoke =
    isFridayNightWindow(currentTime) &&
    isKaraokeEvent(event) &&
    isSameNightEvent(event, currentTime);

  if (event.isAstros) {
    return (
      <SbAstrosHighlightCard
        title={event.title}
        description={event.description}
        dateTime={`${event.displayDate} - ${event.displayTime}`}
        cta={
          <SbButton asChild className="w-full sm:w-auto" href="#calendar">
            View on calendar
          </SbButton>
        }
      />
    );
  }

  return (
    <SbCard className="space-y-3 border-primary/30 bg-surface-2 p-4 shadow-[0_0_0_1px_rgb(30_77_255_/_0.14),0_0_20px_rgb(30_77_255_/_0.12)]">
      <div className="flex flex-wrap gap-1.5">
        {event.categories.map((category) => (
          <SbBadge key={category} tone={eventCategoryTone(category)}>
            {category}
          </SbBadge>
        ))}
        {isFridayKaraoke ? (
          <SbBadge tone="warning">Friday feature</SbBadge>
        ) : null}
        <SbBadge tone="blue">{getFocalStatusLabel(event, currentTime)}</SbBadge>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-muted-foreground">
          {event.displayDate} - {event.displayTime}
        </p>
        <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
          {event.title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {event.description}
        </p>
      </div>

      <SbButton asChild className="w-full sm:w-auto" href="#calendar">
        View on calendar
      </SbButton>
    </SbCard>
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

const eventStartTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function getHeroDescription({
  focalEvent,
  fridayKaraokeEvent,
  currentTime,
}: {
  focalEvent?: UIEvent;
  fridayKaraokeEvent?: UIEvent;
  currentTime: Date;
}) {
  if (fridayKaraokeEvent) {
    const karaokeStart = eventStartTimeFormatter.format(
      fridayKaraokeEvent.startTime
    );

    if (isOngoingEvent(fridayKaraokeEvent, currentTime)) {
      return "Friday Karaoke is happening now at Skoltz.";
    }

    if (isStartingSoonEvent(fridayKaraokeEvent, currentTime)) {
      return `Friday Karaoke starts at ${karaokeStart}. Drinks, songs, and specials are on tonight.`;
    }

    return `Friday Karaoke starts at ${karaokeStart}. Games and specials are still on around the bar.`;
  }

  if (focalEvent && isSameNightEvent(focalEvent, currentTime)) {
    if (focalEvent.isAstros) {
      if (isOngoingEvent(focalEvent, currentTime)) {
        return "The Astros game is on now with cold drinks and tonight's specials at Skoltz.";
      }

      return "Catch the Astros game, cold drinks, and tonight's specials at Skoltz.";
    }

    if (isOngoingEvent(focalEvent, currentTime)) {
      return `${focalEvent.title} is happening now at Skoltz.`;
    }

    if (isFutureEvent(focalEvent, currentTime)) {
      const eventStart = eventStartTimeFormatter.format(focalEvent.startTime);

      return `${focalEvent.title} starts at ${eventStart} tonight at Skoltz.`;
    }
  }

  return "Catch tonight's games, events, and specials before you get to the bar.";
}

export default function Home() {
  const { hydrated: authHydrated, loading: authLoading, session } = useAuth();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const today = currentDate ?? new Date();
  const calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const calendarMonthLabel = currentDate
    ? calendarMonthLabelFormatter.format(calendarMonth)
    : "Current month";
  const upcomingQuery = useUpcomingEvents();
  const calendarQuery = useCalendarEvents(calendarMonth);
  const rewardsQuery = useRewards();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCurrentDate(new Date());
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  const queryEvents = upcomingQuery.data ?? [];
  const events = queryEvents;
  const fridayKaraokeEvent = selectFridayKaraokeEvent(events, today);
  const focalEvent = selectFocalEvent(events, today);
  const ongoingEvents = sortEventsByStartTime(
    events.filter(
      (event) =>
        isOngoingEvent(event, today) && event.id !== focalEvent?.id
    )
  );
  const todayLabel = sameDayLabelFormatter.format(today);
  const companionEvents = focalEvent
    ? events
        .filter(
          (event) =>
            event.id !== focalEvent.id &&
            isFutureEvent(event, today) &&
            isSameNightEvent(event, today)
        )
        .sort(
          (firstEvent, secondEvent) =>
            categoryPriority(firstEvent.primaryCategory) -
              categoryPriority(secondEvent.primaryCategory) ||
            firstEvent.startTime.getTime() - secondEvent.startTime.getTime()
        )
    : [];
  const ongoingEventIds = new Set(ongoingEvents.map((event) => event.id));
  const companionEventIds = new Set(companionEvents.map((event) => event.id));
  const upcomingEvents = sortEventsByStartTime(
    events.filter(
      (event) =>
        isFutureEvent(event, today) &&
        event.id !== focalEvent?.id &&
        !companionEventIds.has(event.id) &&
        !ongoingEventIds.has(event.id)
    )
  );
  const calendarEvents = toCalendarEventsByDate(calendarQuery.data);
  const rewardExamples = rewardsQuery.data ?? [];
  const nextReward = rewardExamples[0];
  const isLoading = upcomingQuery.isLoading || calendarQuery.isLoading;
  const isError = upcomingQuery.isError || calendarQuery.isError;
  const isEmpty = !isLoading && !isError && events.length === 0;
  const isAuthReady = authHydrated && !authLoading;
  const isSignedIn = Boolean(session);
  const rewardsCtaTitle = !isAuthReady
    ? "Checking account status"
    : isSignedIn
      ? "You're signed in - rewards and check-ins are ready."
      : "Sign in to earn rewards & check in";
  const rewardsCtaDescription = !isAuthReady
    ? "Confirming your rewards and check-in access."
    : isSignedIn
      ? "Check in when you arrive and keep an eye on available rewards."
      : "Rewards and venue check-ins are available after login.";
  const heroDescription = getHeroDescription({
    focalEvent,
    fridayKaraokeEvent,
    currentTime: today,
  });

  function retryQueries() {
    void upcomingQuery.refetch();
    void calendarQuery.refetch();
  }

  return (
    <>
      <OfflineBanner />
      <main id="home" className="flex-1 pb-28">
        <SbSection className="py-5 sm:py-7">
          <SbContainer className="space-y-4">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-3 rounded-md border border-border/70 bg-surface-1 px-3 py-2">
                  <SbLogo className="h-8 w-auto sm:h-9" />
                  <SbBadge tone="blue">Tonight</SbBadge>
                </div>
                <h1 className="text-3xl font-semibold tracking-normal text-foreground sm:text-5xl">
                  Tonight at Skoltz
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  {heroDescription}
                </p>
              </div>
            </div>

            <SbCard className="space-y-3 border-border/80 bg-surface-2 p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold sm:text-base">
                      {rewardsCtaTitle}
                    </h2>
                    {isAuthReady && isSignedIn ? (
                      <SbBadge tone="success">Ready</SbBadge>
                    ) : null}
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                    {rewardsCtaDescription}
                  </p>
                </div>
                {isAuthReady ? (
                  <SbButton
                    asChild
                    href={isSignedIn ? "/rewards" : "/login"}
                    className="w-full sm:w-auto"
                    size="sm"
                  >
                    {isSignedIn ? "View rewards" : "Sign in"}
                  </SbButton>
                ) : null}
              </div>

              <RewardsHowItWorks />
              <RewardProgress signedIn={isSignedIn} nextReward={nextReward} />
              <RewardExamples rewards={rewardExamples} />
            </SbCard>

            <PwaInstallBanner />

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

            {!isLoading && !isError && focalEvent ? (
              <div className="space-y-3">
                <FocalEventCard event={focalEvent} currentTime={today} />

                {companionEvents.length > 0 ? (
                  <SbCard className="space-y-2.5 border-primary/20 bg-surface-2 p-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase text-primary">
                          Also tonight
                        </p>
                        <h2 className="text-xl font-semibold">
                          More happening tonight
                        </h2>
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {todayLabel}
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {companionEvents.map((event) => (
                        <a
                          key={event.id}
                          href="#calendar"
                          className="rounded-md border border-border/70 bg-surface-1 p-2.5 transition hover:border-primary/30 hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 space-y-1">
                              <SbBadge
                                tone={eventCategoryTone(event.primaryCategory)}
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
          <SbSection className="py-4">
            <SbContainer className="space-y-3">
              <SbSectionHeader
                title="Happening now"
                subtitle="Events already underway at Skoltz."
              />

              <div className="flex gap-3 overflow-x-auto pb-2">
                {ongoingEvents.map((event) => (
                  <CompactEventCard
                    key={event.id}
                    event={event}
                    currentTime={today}
                    showAstrosSpecials
                  />
                ))}
              </div>
            </SbContainer>
          </SbSection>
        ) : null}

        <SbSection className="py-5">
          <SbContainer className="space-y-3">
            <SbSectionHeader
              title="Upcoming events"
              subtitle="Plan your next visit around games, karaoke, and bar events."
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
                  <CompactEventCard
                    key={event.id}
                    event={event}
                    currentTime={today}
                  />
                ))}
              </div>
            ) : null}
          </SbContainer>
        </SbSection>

        <SbSection className="py-5">
          <SbContainer className="space-y-3">
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

        <SbSection id="calendar" className="bg-surface-1/40 py-5 sm:py-8">
          <SbContainer className="space-y-3">
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
