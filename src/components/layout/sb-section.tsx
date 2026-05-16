import { type ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function SbSection({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("py-8 sm:py-12", className)} {...props} />
}
