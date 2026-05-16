import { type ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sbButtonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-primary-foreground shadow-[var(--sb-glow-blue)] hover:bg-primary/90",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
        danger:
          "border-destructive bg-destructive text-destructive-foreground shadow-[var(--sb-glow-red)] hover:bg-destructive/90",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-surface-2",
      },
      size: {
        sm: "min-h-8 px-3 py-1.5 text-xs",
        md: "min-h-10 px-4 py-2 text-sm",
        lg: "min-h-12 px-5 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export function SbButton({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof sbButtonVariants>) {
  return (
    <button
      className={cn(sbButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
