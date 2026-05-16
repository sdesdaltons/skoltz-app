"use client"

import { useEffect, useState } from "react"

import { SbLogo } from "@/components/branding"
import { SbButton, SbCard } from "@/components/ui"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

type InstallBannerMode = "native-prompt" | "ios-guidance"

const installDismissedKey = "skoltz-pwa-install-dismissed"
const installDismissDurationMs = 24 * 60 * 60 * 1000
const isDevelopment = process.env.NODE_ENV === "development"

function isInstallDismissed() {
  const dismissedUntil = localStorage.getItem(installDismissedKey)

  if (!dismissedUntil) {
    return false
  }

  if (dismissedUntil === "true") {
    localStorage.removeItem(installDismissedKey)
    return false
  }

  const dismissedUntilTime = Number(dismissedUntil)

  if (!Number.isFinite(dismissedUntilTime) || dismissedUntilTime <= Date.now()) {
    localStorage.removeItem(installDismissedKey)
    return false
  }

  return true
}

function dismissInstallPrompt() {
  localStorage.setItem(
    installDismissedKey,
    String(Date.now() + installDismissDurationMs)
  )
}

function isStandaloneDisplay() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  )
}

function isIosDevice() {
  const navigatorWithTouch = window.navigator as Navigator & {
    maxTouchPoints?: number
  }

  return (
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" &&
      (navigatorWithTouch.maxTouchPoints ?? 0) > 1)
  )
}

export function PwaInstallBanner() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)
  const [bannerMode, setBannerMode] = useState<InstallBannerMode | null>(null)

  useEffect(() => {
    const initialCheck = window.setTimeout(() => {
      if (isStandaloneDisplay() || isInstallDismissed()) {
        return
      }

      if (isIosDevice()) {
        setBannerMode("ios-guidance")
        setIsDismissed(false)
      }
    }, 0)

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      const promptEvent = event as BeforeInstallPromptEvent

      if (isDevelopment) {
        console.debug("[Skoltz PWA] beforeinstallprompt fired")
      }

      if (isStandaloneDisplay() || isInstallDismissed()) {
        return
      }

      setInstallPrompt(promptEvent)
      setBannerMode("native-prompt")
      setIsDismissed(false)
    }

    function handleAppInstalled() {
      dismissInstallPrompt()
      setInstallPrompt(null)
      setBannerMode(null)
      setIsDismissed(true)

      if (isDevelopment) {
        console.debug("[Skoltz PWA] appinstalled fired")
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.clearTimeout(initialCheck)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  if (!bannerMode || isDismissed) {
    return null
  }

  async function handleInstall() {
    if (!installPrompt) {
      return
    }

    await installPrompt.prompt()
    const choice = await installPrompt.userChoice

    if (isDevelopment) {
      console.debug("[Skoltz PWA] install prompt outcome", choice.outcome)
    }

    if (choice.outcome === "accepted" || choice.outcome === "dismissed") {
      dismissInstallPrompt()
      setInstallPrompt(null)
      setBannerMode(null)
      setIsDismissed(true)
    }
  }

  function handleDismiss() {
    dismissInstallPrompt()
    setInstallPrompt(null)
    setBannerMode(null)
    setIsDismissed(true)
  }

  const isIosGuidance = bannerMode === "ios-guidance"

  return (
    <SbCard className="flex flex-col gap-3 border-primary/25 bg-surface-2 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="shrink-0 rounded-sm border border-border bg-background p-1">
          <SbLogo className="h-7 w-auto" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold sm:text-base">
            {isIosGuidance ? "Add Skoltz to your iPhone" : "Install Skoltz App"}
          </h2>
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
            {isIosGuidance
              ? "Tap Share, then Add to Home Screen for faster access at the bar."
              : "Add Skoltz to your home screen for faster access at the bar."}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {isIosGuidance ? (
          <SbButton type="button" size="sm" onClick={handleDismiss}>
            Got it
          </SbButton>
        ) : (
          <SbButton type="button" size="sm" onClick={handleInstall}>
            Install
          </SbButton>
        )}
        <SbButton type="button" size="sm" variant="ghost" onClick={handleDismiss}>
          Dismiss
        </SbButton>
      </div>
    </SbCard>
  )
}
