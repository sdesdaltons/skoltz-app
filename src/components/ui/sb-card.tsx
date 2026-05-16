import { type ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function SbCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-[var(--sb-shadow-sm)]",
        className
      )}
      {...props}
    />
  )
}
