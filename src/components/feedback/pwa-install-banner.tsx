"use client"

import { useEffect, useState } from "react"

import { SbLogo } from "@/components/branding"
import { SbButton, SbCard } from "@/components/ui"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

const installDismissedKey = "skoltz-pwa-install-dismissed"

export function PwaInstallBanner() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()

      if (localStorage.getItem(installDismissedKey) === "true") {
        return
      }

      setInstallPrompt(event as BeforeInstallPromptEvent)
      setIsDismissed(false)
    }

    function handleAppInstalled() {
      localStorage.setItem(installDismissedKey, "true")
      setInstallPrompt(null)
      setIsDismissed(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  if (!installPrompt || isDismissed) {
    return null
  }

  async function handleInstall() {
    if (!installPrompt) {
      return
    }

    await installPrompt.prompt()
    const choice = await installPrompt.userChoice

    if (choice.outcome === "accepted" || choice.outcome === "dismissed") {
      localStorage.setItem(installDismissedKey, "true")
      setInstallPrompt(null)
      setIsDismissed(true)
    }
  }

  function handleDismiss() {
    localStorage.setItem(installDismissedKey, "true")
    setInstallPrompt(null)
    setIsDismissed(true)
  }

  return (
    <SbCard className="flex flex-col gap-3 border-primary/25 bg-surface-2 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="shrink-0 rounded-sm border border-border bg-background p-1">
          <SbLogo className="h-7 w-auto" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold sm:text-base">
            Install Skoltz App
          </h2>
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
            Add Skoltz to your home screen for faster access at the bar.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <SbButton type="button" size="sm" onClick={handleInstall}>
          Install
        </SbButton>
        <SbButton type="button" size="sm" variant="ghost" onClick={handleDismiss}>
          Dismiss
        </SbButton>
      </div>
    </SbCard>
  )
}
