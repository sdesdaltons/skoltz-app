import { SbBadge, SbButton, SbCard } from "@/components/ui"

export type SbInAppAlert = {
  id: string
  title: string
  description: string
  tone?: "blue" | "red" | "success" | "warning" | "neutral"
  actionHref?: string
  actionLabel?: string
}

export function SbAlertList({ alerts }: { alerts: SbInAppAlert[] }) {
  if (!alerts.length) {
    return null
  }

  return (
    <section aria-label="Skoltz alerts" className="space-y-2">
      {alerts.map((alert) => (
        <SbCard
          key={alert.id}
          className="border-primary/25 bg-surface-2 p-3"
          role="status"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <SbBadge tone={alert.tone ?? "blue"}>Alert</SbBadge>
                <h2 className="text-sm font-semibold sm:text-base">
                  {alert.title}
                </h2>
              </div>
              <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                {alert.description}
              </p>
            </div>
            {alert.actionHref && alert.actionLabel ? (
              <SbButton
                asChild
                href={alert.actionHref}
                variant="ghost"
                size="sm"
                className="w-full sm:w-auto"
              >
                {alert.actionLabel}
              </SbButton>
            ) : null}
          </div>
        </SbCard>
      ))}
    </section>
  )
}
