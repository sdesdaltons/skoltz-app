"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

import { SbAlertList, type SbInAppAlert } from "@/components/alerts";
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
import { cn } from "@/lib/utils";
import crawfishPromo from "../../Ads/facebook_1778893673441_7461220850091226236.jpg";
import dartTournamentPromo from "../../Ads/image000000.jpg";

type CalendarFilter = "sports" | "specials" | "featured";

type PromoCard = {
  image: typeof crawfishPromo;
  alt: string;
  title: string;
  subtitle: string;
  details: string;
  ctaText: string;
  schedule:
    | {
        type: "weekly";
        day: number;
      }
    | {
        type: "date";
        month: number;
        day: number;
      };
};

type DailySpecial = {
  day: number;
  dayName: string;
  items: string[];
};

const promoCards = [
  {
    image: crawfishPromo,
    alt: "Skoltz crawfish special graphic",
    title: "Crawfish night",
    subtitle: "3 lbs crawfish for $20 with drink specials.",
    details:
      "3 lbs crawfish for $20. Drink specials: $2.75 aluminum bottles, $1 off seltzers, and $5 tea shots.",
    ctaText: "Sat May 16",
    schedule: { type: "date", month: 4, day: 16 },
  },
  {
    image: dartTournamentPromo,
    alt: "Skoltz dart tournament graphic",
    title: "Dart tournament",
    subtitle: "$1000 added with $15 entry and blind draw partners.",
    details:
      "$1000 added. $15 entry. 3:30 PM sign up, 4 PM darts fly. Blind draw partners, OIMO / Cricket / 701 TB.",
    ctaText: "Mon May 25",
    schedule: { type: "date", month: 4, day: 25 },
  },
] satisfies PromoCard[];

const dailySpecials = [
  {
    day: 1,
    dayName: "Monday",
    items: [
      "$4 Starfucker",
      "$4 Pinnacle Whipped",
      "$3.50 Big Ass Beers",
      "$6 Burger and Fries",
    ],
  },
  {
    day: 2,
    dayName: "Tuesday",
    items: [
      "$3.50 Pink Starburst",
      "$2.30 Well Drinks",
      "$2.25 Ziegen Pints",
      "$2 Tacos",
    ],
  },
  {
    day: 3,
    dayName: "Wednesday",
    items: [
      "$3.50 Jolly Rancher",
      "$4 Jack Daniels",
      "$2.75 Aluminum Bottles",
      "$8 Philly",
    ],
  },
  {
    day: 4,
    dayName: "Thursday",
    items: [
      "$4 Grape Gatorade",
      "$4 Titos",
      "$15 Domestic Buckets",
      "$1 Off Any Pizza",
    ],
  },
  {
    day: 5,
    dayName: "Friday",
    items: [
      "$4 Mexican Candy",
      "$4.50 Margaritas",
      "$18 Import Buckets",
      "$1 Wings",
    ],
  },
  {
    day: 6,
    dayName: "Saturday",
    items: [
      "$5 Any Tea Shot",
      "$1 Off Seltzers",
      "$2.75 Aluminum Bottles",
      "$5 Pulled Pork",
    ],
  },
  {
    day: 0,
    dayName: "Sunday",
    items: [
      "$4 Skittles",
      "$4 Fireball",
      "$15 Domestic Buckets",
      "$9 Wedge Salad",
    ],
  },
] satisfies DailySpecial[];

function formatDailySpecialDetails(special: DailySpecial) {
  return special.items.join(" / ");
}

const startingSoonWindowMs = 2 * 60 * 60 * 1000;
const tonightWindowEndHour = 4;
const karaokeStartHour = 21;
const karaokeStartMinute = 30;
const karaokeEndHour = 1;
const karaokeEndMinute = 30;
const homepageUpcomingLimit = 10;

const calendarFilters: Array<{ value: CalendarFilter; label: string }> = [
  { value: "sports", label: "Sports" },
  { value: "specials", label: "Specials" },
  { value: "featured", label: "Featured Events" },
];

const sportsCalendarKinds = new Set<SbCalendarEvent["kind"]>([
  "astros",
  "rockets",
  "texans",
  "mlb",
  "nba",
  "nfl",
]);

const featuredCalendarKinds = new Set<SbCalendarEvent["kind"]>([
  "karaoke",
]);

const astrosGametimeSpecials = [
  "$2 Hot Dogs",
  "$2 Ziegenbock Pints",
].join(" and ") + " during Astros games only";

function eventCategoryTone(
  category: UIEvent["primaryCategory"]
): "blue" | "red" | "success" | "warning" | "neutral" {
  if (category === "astros" || category === "texans" || category === "mlb") {
    return "blue";
  }

  if (category === "rockets" || category === "nba") {
    return "red";
  }

  if (category === "nfl") {
    return "success";
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

  if (category === "mlb" || category === "nba" || category === "nfl") {
    return 4;
  }

  return 5;
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getPromoSortDate(promo: PromoCard, currentDate: Date) {
  const todayStart = startOfDay(currentDate);

  if (promo.schedule.type === "weekly") {
    const nextDate = startOfDay(currentDate);
    const daysUntilPromo =
      (promo.schedule.day - currentDate.getDay() + 7) % 7;

    nextDate.setDate(currentDate.getDate() + daysUntilPromo);

    return nextDate;
  }

  const scheduledDate = new Date(
    currentDate.getFullYear(),
    promo.schedule.month,
    promo.schedule.day
  );

  if (scheduledDate < todayStart) {
    scheduledDate.setFullYear(currentDate.getFullYear() + 1);
  }

  return scheduledDate;
}

function getPromoCalendarDate(promo: PromoCard, currentDate: Date) {
  return getPromoSortDate(promo, currentDate);
}

function sortPromoCardsByDate(promos: PromoCard[], currentDate: Date) {
  return promos.filter((promo) => isPromoActive(promo, currentDate)).sort(
    (firstPromo, secondPromo) =>
      getPromoSortDate(firstPromo, currentDate).getTime() -
      getPromoSortDate(secondPromo, currentDate).getTime()
  );
}

function sortDailySpecialsForWeek(
  specials: DailySpecial[],
  currentDate: Date
) {
  return [...specials].sort(
    (firstSpecial, secondSpecial) =>
      (firstSpecial.day - currentDate.getDay() + 7) % 7 -
      ((secondSpecial.day - currentDate.getDay() + 7) % 7)
  );
}

function isPromoActive(promo: PromoCard, currentDate: Date) {
  if (promo.schedule.type === "weekly") {
    return true;
  }

  const todayStart = startOfDay(currentDate);
  const promoDate = new Date(
    currentDate.getFullYear(),
    promo.schedule.month,
    promo.schedule.day
  );
  const promoEnd = new Date(promoDate);

  promoEnd.setDate(promoDate.getDate() + 1);

  return promoEnd > todayStart;
}

function isOneTimePromoVisibleOnCalendar(
  promo: PromoCard,
  month: Date,
  currentDate: Date
) {
  if (promo.schedule.type === "weekly") {
    return false;
  }

  const promoDate = new Date(
    currentDate.getFullYear(),
    promo.schedule.month,
    promo.schedule.day
  );

  return promoDate.getMonth() === month.getMonth() && isPromoActive(promo, currentDate);
}

function getPromoCalendarEventsForMonth(
  promos: PromoCard[],
  month: Date,
  currentDate: Date
): Record<string, SbCalendarEvent[]> {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const promoEvents: Array<{ date: Date; event: SbCalendarEvent }> = [];

  promos.forEach((promo) => {
    if (promo.schedule.type === "weekly") {
      const firstPromoDate = new Date(monthStart);
      const daysUntilPromo =
        (promo.schedule.day - firstPromoDate.getDay() + 7) % 7;

      firstPromoDate.setDate(firstPromoDate.getDate() + daysUntilPromo);

      for (
        const promoDate = new Date(firstPromoDate);
        promoDate <= monthEnd;
        promoDate.setDate(promoDate.getDate() + 7)
      ) {
        promoEvents.push({
          date: new Date(promoDate),
          event: {
            id: `promo-${promo.title}-${dateKey(promoDate)}`,
            title: promo.title,
            kind: "special",
            time: promo.ctaText,
            description: promo.details,
          },
        });
      }

      return;
    }

    const promoDate = new Date(
      currentDate.getFullYear(),
      promo.schedule.month,
      promo.schedule.day
    );

    if (isOneTimePromoVisibleOnCalendar(promo, month, currentDate)) {
      promoEvents.push({
        date: promoDate,
        event: {
          id: `promo-${promo.title}-${dateKey(promoDate)}`,
          title: promo.title,
          kind: "special",
          time: promo.ctaText,
          description: promo.details,
        },
      });
    }
  });

  return promoEvents.reduce<Record<string, SbCalendarEvent[]>>(
    (groupedPromos, promo) => {
      const key = dateKey(promo.date);

      groupedPromos[key] = [...(groupedPromos[key] ?? []), promo.event];

      return groupedPromos;
    },
    {}
  );
}

function getDailySpecialCalendarEventsForMonth(
  specials: DailySpecial[],
  month: Date
): Record<string, SbCalendarEvent[]> {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const specialEvents: Array<{ date: Date; event: SbCalendarEvent }> = [];

  specials.forEach((special) => {
    const firstSpecialDate = new Date(monthStart);
    const daysUntilSpecial =
      (special.day - firstSpecialDate.getDay() + 7) % 7;

    firstSpecialDate.setDate(firstSpecialDate.getDate() + daysUntilSpecial);

    for (
      const specialDate = new Date(firstSpecialDate);
      specialDate <= monthEnd;
      specialDate.setDate(specialDate.getDate() + 7)
    ) {
      specialEvents.push({
        date: new Date(specialDate),
        event: {
          id: `daily-special-${special.dayName}-${dateKey(specialDate)}`,
          title: `${special.dayName} specials`,
          kind: "special",
          time: "All day",
          description: formatDailySpecialDetails(special),
        },
      });
    }
  });

  return specialEvents.reduce<Record<string, SbCalendarEvent[]>>(
    (groupedSpecials, special) => {
      const key = dateKey(special.date);

      groupedSpecials[key] = [...(groupedSpecials[key] ?? []), special.event];

      return groupedSpecials;
    },
    {}
  );
}

function mergeCalendarEvents(
  eventCalendarItems: Record<string, SbCalendarEvent[]>,
  promoCalendarItems: Record<string, SbCalendarEvent[]>
) {
  const dates = new Set([
    ...Object.keys(eventCalendarItems),
    ...Object.keys(promoCalendarItems),
  ]);

  return Object.fromEntries(
    [...dates].map((date) => [
      date,
      [
        ...(eventCalendarItems[date] ?? []),
        ...(promoCalendarItems[date] ?? []),
      ],
    ])
  ) as Record<string, SbCalendarEvent[]>;
}

function calendarEventMatchesFilter(
  event: SbCalendarEvent,
  activeFilters: CalendarFilter[]
) {
  if (!activeFilters.length) {
    return true;
  }

  return activeFilters.some((filter) => {
    if (filter === "sports") {
      return sportsCalendarKinds.has(event.kind);
    }

    if (filter === "specials") {
      return event.kind === "special";
    }

    return featuredCalendarKinds.has(event.kind);
  });
}

function filterCalendarEvents(
  eventsByDate: Record<string, SbCalendarEvent[]>,
  activeFilters: CalendarFilter[]
) {
  if (!activeFilters.length) {
    return eventsByDate;
  }

  return Object.fromEntries(
    Object.entries(eventsByDate)
      .map(([date, events]) => [
        date,
        events.filter((event) =>
          calendarEventMatchesFilter(event, activeFilters)
        ),
      ])
      .filter(([, events]) => events.length > 0)
  ) as Record<string, SbCalendarEvent[]>;
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

function isScheduledKaraokeActive(date: Date) {
  const day = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const minutesAfterMidnight = hours * 60 + minutes;
  const karaokeStartMinutes = karaokeStartHour * 60 + karaokeStartMinute;
  const karaokeEndMinutes = karaokeEndHour * 60 + karaokeEndMinute;

  return (
    (day === 5 && minutesAfterMidnight >= karaokeStartMinutes) ||
    (day === 6 && minutesAfterMidnight < karaokeEndMinutes)
  );
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
  const fridayKaraokeEvent = selectFridayKaraokeEvent(events, currentTime);
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
    startingSoonEvents[0] ??
    fridayKaraokeEvent ??
    ongoingEvents[0] ??
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

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function compareMonth(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() * 12 +
    firstDate.getMonth() -
    (secondDate.getFullYear() * 12 + secondDate.getMonth())
  );
}

function getSuperBowlCoverageMonth(currentDate: Date) {
  const coverageYear =
    currentDate.getMonth() <= 1
      ? currentDate.getFullYear()
      : currentDate.getFullYear() + 1;

  return new Date(coverageYear, 1, 1);
}

function EventLogoStrip({
  logoUrls,
  size = "sm",
}: {
  logoUrls: string[];
  size?: "sm" | "md";
}) {
  const visibleLogos = logoUrls.slice(0, 2);

  if (!visibleLogos.length) {
    return null;
  }

  const sizeClass = size === "md" ? "size-10" : "size-7";
  const imageSize = size === "md" ? "40px" : "28px";

  return (
    <div className="flex items-center -space-x-1">
      {visibleLogos.map((logoUrl) => (
        <span
          key={logoUrl}
          className={`${sizeClass} relative overflow-hidden rounded-full border border-border bg-surface-1`}
        >
          <Image
            src={logoUrl}
            alt=""
            fill
            sizes={imageSize}
            className="object-contain p-1"
          />
        </span>
      ))}
    </div>
  );
}

function isLiveScoreEvent(event: UIEvent) {
  return Boolean(event.liveScore?.isLive && event.sourceUrl);
}

function isSourceLinkedSportsEvent(event: UIEvent) {
  return Boolean(
    event.sourceUrl &&
      event.categories.some((category) =>
        ["astros", "rockets", "texans", "mlb", "nba", "nfl"].includes(category)
      )
  );
}

function LiveScoreTeams({ event }: { event: UIEvent }) {
  if (!event.liveScore) {
    return null;
  }

  return (
    <div className="grid gap-1.5">
      {event.liveScore.teams.map((team) => (
        <div
          key={`${event.id}-${team.homeAway}`}
          className="flex min-h-9 items-center justify-between gap-3 rounded-md bg-background/80 px-2.5 py-1.5"
        >
          <div className="flex min-w-0 items-center gap-2">
            {team.logoUrl ? (
              <span className="relative size-6 shrink-0 overflow-hidden rounded-full border border-border bg-surface-1">
                <Image
                  src={team.logoUrl}
                  alt=""
                  fill
                  sizes="24px"
                  className="object-contain p-0.5"
                />
              </span>
            ) : null}
            <span className="truncate text-sm font-semibold text-foreground">
              {team.name}
            </span>
          </div>
          <span className="text-xl font-semibold tabular-nums text-foreground">
            {team.score}
          </span>
        </div>
      ))}
    </div>
  );
}

function LiveScoreCard({
  event,
  compact = false,
}: {
  event: UIEvent;
  compact?: boolean;
}) {
  if (!event.liveScore || !event.sourceUrl) {
    return null;
  }

  return (
    <a
      href={event.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "block rounded-md border border-primary/40 bg-card shadow-[var(--sb-shadow-sm)] transition hover:border-primary/60 hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        compact
          ? "min-w-56 max-w-64 shrink-0 p-2.5 sm:min-w-64"
          : "p-3.5 shadow-[var(--sb-glow-blue)] sm:p-4"
      )}
      aria-label={`Open ${event.title} live score on ${event.liveScore.provider}`}
    >
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <SbBadge tone="blue">Live</SbBadge>
          <SbBadge tone={eventCategoryTone(event.primaryCategory)}>
            {event.categoryInfo[0]?.label ?? "Sports"}
          </SbBadge>
          <SbBadge tone="neutral">{event.liveScore.provider}</SbBadge>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase text-primary">
            {event.liveScore.status}
          </p>
          <h2
            className={cn(
              "line-clamp-2 font-semibold tracking-normal text-foreground",
              compact ? "text-sm leading-5" : "text-2xl sm:text-3xl"
            )}
          >
            {event.title}
          </h2>
        </div>

        <LiveScoreTeams event={event} />

        <p className="text-xs font-semibold text-primary">
          Open {event.liveScore.provider} scorecard
        </p>
      </div>
    </a>
  );
}

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
  const sourceUrl = isSourceLinkedSportsEvent(event) ? event.sourceUrl : undefined;

  if (isLiveScoreEvent(event)) {
    return <LiveScoreCard event={event} compact />;
  }

  return (
    <a
      href={sourceUrl ?? "#calendar"}
      target={sourceUrl ? "_blank" : undefined}
      rel={sourceUrl ? "noreferrer" : undefined}
      className="min-w-52 max-w-60 shrink-0 rounded-md border border-border/70 bg-card p-2.5 shadow-[var(--sb-shadow-sm)] transition hover:border-primary/30 hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-w-60"
    >
      <div className="space-y-1.5">
        <div className="flex flex-wrap gap-1.5">
          <EventLogoStrip logoUrls={event.logoUrls} />
          {event.categoryInfo.map((category) => (
            <SbBadge key={category.value} tone={eventCategoryTone(category.value)}>
              {category.label}
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
              $2 Hot Dogs / $2 Ziegenbock Pints during Astros games only
            </p>
          ) : null}
        </div>

        <p className="text-xs font-semibold text-primary">
          {sourceUrl ? "View game" : "View date"}
        </p>
      </div>
    </a>
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
  const sourceUrl = isSourceLinkedSportsEvent(event) ? event.sourceUrl : undefined;

  if (event.isAstros) {
    if (isLiveScoreEvent(event)) {
      return <LiveScoreCard event={event} />;
    }

    return (
      <SbAstrosHighlightCard
        title={event.title}
        description={event.description}
        dateTime={`${event.displayDate} - ${event.displayTime}`}
        logoUrls={event.logoUrls}
        cta={
          <SbButton
            asChild
            className="w-full sm:w-auto"
            href={sourceUrl ?? "#calendar"}
            target={sourceUrl ? "_blank" : undefined}
            rel={sourceUrl ? "noreferrer" : undefined}
          >
            {sourceUrl ? "View game" : "View on calendar"}
          </SbButton>
        }
      />
    );
  }

  if (isLiveScoreEvent(event)) {
    return <LiveScoreCard event={event} />;
  }

  return (
    <SbCard
      className={
        isFridayKaraoke
          ? "space-y-3 border-warning/45 bg-warning/10 p-4 shadow-[0_0_0_1px_rgb(249_168_37_/_0.14),0_0_18px_rgb(249_168_37_/_0.12)]"
          : "space-y-3 border-primary/30 bg-surface-2 p-4 shadow-[0_0_0_1px_rgb(30_77_255_/_0.12),0_0_16px_rgb(30_77_255_/_0.1)]"
      }
    >
      <div className="flex flex-wrap gap-1.5">
        <EventLogoStrip logoUrls={event.logoUrls} size="md" />
        {event.categoryInfo.map((category) => (
          <SbBadge key={category.value} tone={eventCategoryTone(category.value)}>
            {category.label}
          </SbBadge>
        ))}
        {isFridayKaraoke ? (
          <>
            <SbBadge tone="warning">Friday feature</SbBadge>
            <SbBadge tone="warning">Live karaoke</SbBadge>
          </>
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

      <SbButton
        asChild
        className="w-full sm:w-auto"
        href={sourceUrl ?? "#calendar"}
        target={sourceUrl ? "_blank" : undefined}
        rel={sourceUrl ? "noreferrer" : undefined}
      >
        {sourceUrl ? "View game" : "View on calendar"}
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
    logoUrls: event.logoUrls,
    description: event.description,
    sourceUrl: event.sourceUrl,
    liveScore: event.liveScore,
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

function getAstrosSpecialCalendarEvents(
  eventsByDate: Record<string, UIEvent[]> | undefined
): Record<string, SbCalendarEvent[]> {
  return Object.fromEntries(
    Object.entries(eventsByDate ?? {})
      .filter(([, events]) => events.some((event) => event.isAstros))
      .map(([date]) => [
        date,
        [
          {
            id: `astros-special-${date}`,
            title: "Astros gametime specials",
            kind: "special" as const,
            time: "Astros game",
            description: astrosGametimeSpecials,
          },
        ],
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
  if (
    isScheduledKaraokeActive(currentTime) &&
    (!fridayKaraokeEvent || isOngoingEvent(fridayKaraokeEvent, currentTime))
  ) {
    return "Friday Karaoke is happening now at Skoltz until 1:30 AM.";
  }

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

  if (isFridayNightWindow(currentTime)) {
    return "Friday Karaoke takes over tonight at Skoltz. Cold drinks, songs, and specials are waiting.";
  }

  return "Catch tonight's games, events, and specials before you get to the bar.";
}

function buildInAppAlerts({
  focalEvent,
  fridayKaraokeEvent,
  currentTime,
}: {
  focalEvent?: UIEvent;
  fridayKaraokeEvent?: UIEvent;
  currentTime: Date;
}) {
  const alerts: SbInAppAlert[] = [];

  if (isScheduledKaraokeActive(currentTime)) {
    alerts.push({
      id: "karaoke-live",
      title: "Karaoke is live now",
      description: "Friday Karaoke is happening at Skoltz until 1:30 AM.",
      tone: "warning",
      actionHref: "#calendar",
      actionLabel: "View tonight",
    });
  } else if (
    fridayKaraokeEvent &&
    isStartingSoonEvent(fridayKaraokeEvent, currentTime)
  ) {
    alerts.push({
      id: "karaoke-starting-soon",
      title: "Karaoke starts soon",
      description: `Friday Karaoke starts at ${eventStartTimeFormatter.format(
        fridayKaraokeEvent.startTime
      )}.`,
      tone: "warning",
      actionHref: "#calendar",
      actionLabel: "View tonight",
    });
  }

  if (
    focalEvent &&
    !isKaraokeEvent(focalEvent) &&
    isSameNightEvent(focalEvent, currentTime)
  ) {
    if (isOngoingEvent(focalEvent, currentTime)) {
      alerts.push({
        id: `event-live-${focalEvent.id}`,
        title: `${focalEvent.title} is happening now`,
        description: "Tap through to see the event on tonight's calendar.",
        tone: focalEvent.isAstros ? "blue" : "neutral",
        actionHref: "#calendar",
        actionLabel: "Open calendar",
      });
    } else if (isStartingSoonEvent(focalEvent, currentTime)) {
      alerts.push({
        id: `event-starting-${focalEvent.id}`,
        title: `${focalEvent.title} starts soon`,
        description: `Starts at ${eventStartTimeFormatter.format(
          focalEvent.startTime
        )} tonight.`,
        tone: focalEvent.isAstros ? "blue" : "neutral",
        actionHref: "#calendar",
        actionLabel: "Open calendar",
      });
    }
  }

  return alerts.slice(0, 3);
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedCalendarMonth, setSelectedCalendarMonth] =
    useState<Date | null>(null);
  const [pendingCalendarDetailKey, setPendingCalendarDetailKey] =
    useState<string | null>(null);
  const [activeCalendarFilters, setActiveCalendarFilters] = useState<
    CalendarFilter[]
  >([]);
  const today = currentDate ?? new Date();
  const currentCalendarMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  const calendarMonth = selectedCalendarMonth ?? currentCalendarMonth;
  const maxCalendarMonth = getSuperBowlCoverageMonth(today);
  const canShowPreviousMonth =
    compareMonth(calendarMonth, currentCalendarMonth) > 0;
  const canShowNextMonth = compareMonth(calendarMonth, maxCalendarMonth) < 0;
  const calendarMonthLabel = calendarMonthLabelFormatter.format(calendarMonth);
  const upcomingQuery = useUpcomingEvents();
  const calendarQuery = useCalendarEvents(calendarMonth);

  useEffect(() => {
    const syncCurrentDate = () => {
      setCurrentDate(new Date());
    };
    const timeout = window.setTimeout(syncCurrentDate, 0);
    const interval = window.setInterval(syncCurrentDate, 60 * 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!pendingCalendarDetailKey || calendarQuery.isLoading) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      const detailElement = document.getElementById(
        `day-detail-${pendingCalendarDetailKey}`
      ) as HTMLElement | null;

      document.getElementById("calendar")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (detailElement && "showPopover" in detailElement) {
        detailElement.showPopover();
      }

      setPendingCalendarDetailKey(null);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [calendarQuery.isLoading, pendingCalendarDetailKey]);

  function showPreviousCalendarMonth() {
    setSelectedCalendarMonth((currentMonth) => {
      const nextMonth = addMonths(currentMonth ?? currentCalendarMonth, -1);

      return compareMonth(nextMonth, currentCalendarMonth) < 0
        ? currentCalendarMonth
        : nextMonth;
    });
  }

  function showNextCalendarMonth() {
    setSelectedCalendarMonth((currentMonth) => {
      const nextMonth = addMonths(currentMonth ?? currentCalendarMonth, 1);

      return compareMonth(nextMonth, maxCalendarMonth) > 0
        ? maxCalendarMonth
        : nextMonth;
    });
  }

  function openPromoOnCalendar(promo: PromoCard) {
    const promoDate = getPromoCalendarDate(promo, today);
    const promoDateKey = dateKey(promoDate);

    setSelectedCalendarMonth(
      new Date(promoDate.getFullYear(), promoDate.getMonth(), 1)
    );
    setPendingCalendarDetailKey(promoDateKey);
  }

  function openDailySpecialOnCalendar(special: DailySpecial) {
    const specialDate = startOfDay(today);
    const daysUntilSpecial = (special.day - today.getDay() + 7) % 7;

    specialDate.setDate(today.getDate() + daysUntilSpecial);
    setSelectedCalendarMonth(
      new Date(specialDate.getFullYear(), specialDate.getMonth(), 1)
    );
    setPendingCalendarDetailKey(dateKey(specialDate));
  }

  function toggleCalendarFilter(filter: CalendarFilter) {
    setActiveCalendarFilters((currentFilters) =>
      currentFilters.includes(filter)
        ? currentFilters.filter((currentFilter) => currentFilter !== filter)
        : [...currentFilters, filter]
    );
  }

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
  const visibleUpcomingEvents = upcomingEvents.slice(0, homepageUpcomingLimit);
  const sortedPromoCards = sortPromoCardsByDate(promoCards, today);
  const sortedDailySpecials = sortDailySpecialsForWeek(dailySpecials, today);
  const calendarEvents = mergeCalendarEvents(
    mergeCalendarEvents(
      mergeCalendarEvents(
        toCalendarEventsByDate(calendarQuery.data),
        getAstrosSpecialCalendarEvents(calendarQuery.data)
      ),
      getDailySpecialCalendarEventsForMonth(dailySpecials, calendarMonth)
    ),
    getPromoCalendarEventsForMonth(promoCards, calendarMonth, today)
  );
  const filteredCalendarEvents = filterCalendarEvents(
    calendarEvents,
    activeCalendarFilters
  );
  const isLoading = upcomingQuery.isLoading || calendarQuery.isLoading;
  const isError = upcomingQuery.isError || calendarQuery.isError;
  const isEmpty = !isLoading && !isError && events.length === 0;
  const heroDescription = getHeroDescription({
    focalEvent,
    fridayKaraokeEvent,
    currentTime: today,
  });
  const inAppAlerts =
    !isLoading && !isError
      ? buildInAppAlerts({
          focalEvent,
          fridayKaraokeEvent,
          currentTime: today,
        })
      : [];

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

            <PwaInstallBanner />
            <SbAlertList alerts={inAppAlerts} />

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
                      {companionEvents.map((event) => {
                        const sourceUrl = isSourceLinkedSportsEvent(event)
                          ? event.sourceUrl
                          : undefined;

                        return (
                          <a
                            key={event.id}
                            href={sourceUrl ?? "#calendar"}
                            target={sourceUrl ? "_blank" : undefined}
                            rel={sourceUrl ? "noreferrer" : undefined}
                            className="rounded-md border border-border/70 bg-surface-1 p-2.5 transition hover:border-primary/30 hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 space-y-1">
                                <EventLogoStrip logoUrls={event.logoUrls} />
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
                                {sourceUrl ? "Game" : "View"}
                              </span>
                            </div>
                          </a>
                        );
                      })}
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

        <SbSection id="this-week" className="py-5">
          <SbContainer className="space-y-3">
            <SbSectionHeader
              title="This Week At Skoltz"
              subtitle="The next few games, specials, and venue events."
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

            {!isLoading && !isError && visibleUpcomingEvents.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {visibleUpcomingEvents.map((event) => (
                  <CompactEventCard
                    key={event.id}
                    event={event}
                    currentTime={today}
                  />
                ))}
              </div>
            ) : null}

            {!isLoading && !isError && visibleUpcomingEvents.length === 0 ? (
              <SbCard className="border-border/70 bg-surface-2 p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-muted-foreground">
                    No additional upcoming events beyond what is already shown.
                  </p>
                  <SbButton asChild href="#calendar" variant="ghost" size="sm">
                    View calendar
                  </SbButton>
                </div>
              </SbCard>
            ) : null}

            <div className="flex gap-3 overflow-x-auto pb-2">
              {sortedDailySpecials.map((special) => (
                <button
                  key={special.dayName}
                  className="min-w-56 max-w-64 shrink-0 text-left sm:min-w-64"
                  type="button"
                  aria-label={`Open ${special.dayName} specials on the calendar`}
                  onClick={() => openDailySpecialOnCalendar(special)}
                >
                  <SbCard className="h-full space-y-2 border-warning/35 bg-warning/10 p-3 transition hover:border-warning/60 hover:bg-warning/15">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold">
                        {special.dayName}
                      </h3>
                      <SbBadge tone="warning">Daily Specials</SbBadge>
                    </div>
                    <div className="grid gap-1">
                      {special.items.map((item) => (
                        <p
                          key={item}
                          className="rounded-sm bg-background/70 px-2 py-1 text-sm font-semibold text-foreground"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </SbCard>
                </button>
              ))}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {sortedPromoCards.map((promo) => (
                <button
                  key={promo.title}
                  className="min-w-72 max-w-80 shrink-0 sm:min-w-80 lg:min-w-0 lg:flex-1"
                  type="button"
                  aria-label={`Open ${promo.title} on the calendar`}
                  onClick={() => openPromoOnCalendar(promo)}
                >
                  <SbPromoCard
                    image={promo.image}
                    alt={promo.alt}
                    title={promo.title}
                    subtitle={promo.subtitle}
                    ctaText={promo.ctaText}
                    className="h-full text-left"
                  />
                </button>
              ))}
            </div>
          </SbContainer>
        </SbSection>

        <SbSection id="calendar" className="bg-surface-1/40 py-5 sm:py-8">
          <SbContainer className="space-y-3">
            <SbSectionHeader
              title="Event calendar"
              subtitle="Browse upcoming nights at Skoltz through football season."
              action={
                <div className="flex items-center gap-2">
                  <SbButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!canShowPreviousMonth}
                    aria-label="Show previous month"
                    onClick={showPreviousCalendarMonth}
                  >
                    Prev
                  </SbButton>
                  <p className="min-w-28 text-center text-sm font-semibold text-muted-foreground">
                    {calendarMonthLabel}
                  </p>
                  <SbButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!canShowNextMonth}
                    aria-label="Show next month"
                    onClick={showNextCalendarMonth}
                  >
                    Next
                  </SbButton>
                </div>
              }
            />

            <SbCard className="p-2 sm:p-4">
              <div className="space-y-3 px-2 pb-3 sm:px-0">
                <p className="text-sm font-semibold text-muted-foreground">
                  Tap any day to see what&apos;s happening. Calendar view runs
                  through {calendarMonthLabelFormatter.format(maxCalendarMonth)}.
                </p>
                <div className="flex flex-wrap gap-2">
                  {calendarFilters.map((filter) => {
                    const isActive = activeCalendarFilters.includes(filter.value);

                    return (
                      <SbButton
                        key={filter.value}
                        type="button"
                        size="sm"
                        variant={isActive ? "primary" : "ghost"}
                        aria-pressed={isActive}
                        onClick={() => toggleCalendarFilter(filter.value)}
                      >
                        {filter.label}
                      </SbButton>
                    );
                  })}
                  {activeCalendarFilters.length ? (
                    <SbButton
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setActiveCalendarFilters([])}
                    >
                      Clear
                    </SbButton>
                  ) : null}
                </div>
              </div>
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
                  eventsByDate={filteredCalendarEvents}
                />
              )}
            </SbCard>
          </SbContainer>
        </SbSection>
      </main>

      <SbBottomNav active="Today" />
    </>
  );
}
