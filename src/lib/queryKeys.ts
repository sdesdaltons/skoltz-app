export const queryKeys = {
  events: {
    all: ["events"] as const,
    upcoming: ["events", "upcoming"] as const,
    calendar: (month: string) => ["events", "calendar", month] as const,
  },
  rewards: {
    all: ["rewards"] as const,
  },
  checkins: {
    all: ["checkins"] as const,
    byUser: (userId: string) => ["checkins", userId] as const,
  },
} as const
