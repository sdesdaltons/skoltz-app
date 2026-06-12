import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

export function SbSectionHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-normal sm:text-3xl">
          <span
            aria-hidden
            className="h-6 w-1 shrink-0 rounded-full bg-gradient-to-b from-primary to-accent"
          />
          {title}
        </h2>
        {subtitle ? (
          <p className="max-w-2xl pl-3.5 text-sm leading-6 text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
