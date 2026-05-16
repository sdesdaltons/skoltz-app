"use client"

import { useEffect } from "react"

const isDevelopment = process.env.NODE_ENV === "development"

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
