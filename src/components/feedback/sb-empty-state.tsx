import { type ReactNode } from "react"

import { SbCard } from "@/components/ui"
import { cn } from "@/lib/utils"

export function SbEmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <SbCard className={cn("space-y-4 bg-surface-2", className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </SbCard>
  )
}
