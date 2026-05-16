import { type ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sbBadgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-1 text-xs font-semibold uppercase tracking-normal",
  {
    variants: {
      tone: {
        blue: "border-primary/40 bg-primary/15 text-primary",
        red: "border-destructive/40 bg-destructive/15 text-destructive",
        success: "border-success/40 bg-success/15 text-success",
        warning: "border-warning/40 bg-warning/15 text-warning",
        neutral: "border-border bg-surface-2 text-muted-foreground",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
)

export function SbBadge({
  className,
  tone,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof sbBadgeVariants>) {
  return <span className={cn(sbBadgeVariants({ tone, className }))} {...props} />
}
