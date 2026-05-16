"use client"

import { useEffect, useState } from "react"

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    function syncOnlineStatus() {
      setIsOffline(!window.navigator.onLine)
    }

    syncOnlineStatus()
    window.addEventListener("online", syncOnlineStatus)
    window.addEventListener("offline", syncOnlineStatus)

    return () => {
      window.removeEventListener("online", syncOnlineStatus)
      window.removeEventListener("offline", syncOnlineStatus)
    }
  }, [])

  if (!isOffline) {
    return null
  }

  return (
    <div className="sticky top-0 z-50 border-b border-warning/40 bg-surface-2 px-4 py-2 text-center text-sm font-semibold text-warning">
      You are offline. Showing the latest local preview state.
    </div>
  )
}
