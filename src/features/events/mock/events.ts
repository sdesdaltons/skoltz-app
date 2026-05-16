import { type RawEvent } from "../types"

export const rawMockEvents: RawEvent[] = [
  {
    id: "evt-2026-05-15-astros",
    title: "Astros game night",
    description:
      "Featured event treatment with specials surfaced up front for the game.",
    startTime: "2026-05-15T19:10:00-05:00",
    endTime: "2026-05-15T22:30:00-05:00",
    categories: ["astros"],
    location: "Skoltz main bar",
  },
  {
    id: "evt-2026-05-15-karaoke",
    title: "Karaoke night",
    description: "Friday karaoke on the Skoltz stage.",
    startTime: "2026-05-15T21:30:00-05:00",
    endTime: "2026-05-16T01:30:00-05:00",
    categories: ["karaoke"],
    location: "Skoltz stage",
  },
]
