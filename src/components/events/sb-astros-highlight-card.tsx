import { type ReactNode } from "react"
import Image from "next/image"

import { SbBadge, SbButton, SbCard } from "@/components/ui"
import { cn } from "@/lib/utils"

const defaultSpecials = ["$2 Hot Dogs", "$2 Ziegenbock Pints"]

export function SbAstrosHighlightCard({
  title,
  description,
  dateTime,
  logoUrls = [],
  specials = defaultSpecials,
  cta,
  className,
}: {
  title: string
  description: string
  dateTime: string
  logoUrls?: string[]
  specials?: string[]
  cta?: ReactNode
  className?: string
}) {
  return (
    <SbCard
      className={cn(
        "space-y-3 border-primary/25 bg-primary/6 p-3.5 shadow-[0_0_0_1px_rgb(30_77_255_/_0.1),0_0_14px_rgb(30_77_255_/_0.08)] sm:p-4",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {logoUrls.slice(0, 2).length ? (
          <div className="flex items-center -space-x-1">
            {logoUrls.slice(0, 2).map((logoUrl) => (
              <span
                key={logoUrl}
                className="relative size-8 overflow-hidden rounded-full border border-primary/25 bg-surface-1"
              >
                <Image
                  src={logoUrl}
                  alt=""
                  fill
                  sizes="32px"
                  className="object-contain p-1"
                />
              </span>
            ))}
          </div>
        ) : null}
        <SbBadge tone="blue">Astros</SbBadge>
        <SbBadge tone="neutral">Featured</SbBadge>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-muted-foreground">{dateTime}</p>
        <h2 className="text-xl font-semibold tracking-normal text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid gap-1.5 sm:grid-cols-2">
        {specials.map((special) => (
          <div
            key={special}
            className="rounded-md border border-primary/15 bg-surface-1 px-3 py-1.5 text-sm font-semibold text-foreground"
          >
            {special}
          </div>
        ))}
      </div>

      {cta ?? (
        <SbButton type="button" className="w-full sm:w-auto">
          View calendar
        </SbButton>
      )}
    </SbCard>
  )
}
