"use client"

import { useEffect } from "react"

const isDevelopment = process.env.NODE_ENV === "development"
let isRefreshingServiceWorker = false

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return
    }

    if (process.env.NODE_ENV !== "production") {
      return
    }

    function registerServiceWorker() {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          void registration.update()

          if (isDevelopment) {
            console.debug("[Skoltz PWA] service worker registered", registration.scope)
          }
        })
        .catch((error) => {
          if (isDevelopment) {
            console.debug("[Skoltz PWA] service worker registration failed", error)
          }
        })
    }

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (isRefreshingServiceWorker) {
        return
      }

      isRefreshingServiceWorker = true
      window.location.reload()
    })

    if (document.readyState === "complete") {
      registerServiceWorker()
      return
    }

    window.addEventListener("load", registerServiceWorker, { once: true })

    return () => {
      window.removeEventListener("load", registerServiceWorker)
    }
  }, [])

  return null
}
