"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { OfflineBanner } from "@/components/feedback"
import { SbContainer, SbSection } from "@/components/layout"
import { SbBottomNav } from "@/components/navigation"
import { SbCard } from "@/components/ui"
import { useAuth, useOnlineStatus } from "@/features/auth/hooks"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { hydrated, loading, session } = useAuth()
  const isOnline = useOnlineStatus()

  useEffect(() => {
    if (hydrated && !loading && !session && isOnline === true) {
      router.replace("/login")
    }
  }, [hydrated, isOnline, loading, router, session])

  if (!hydrated || loading || !session) {
    return (
      <>
        <OfflineBanner />
        <main className="flex-1 pb-24 md:pb-0">
          <SbSection className="py-8 sm:py-12">
            <SbContainer>
              <SbCard className="space-y-3 bg-surface-2">
                <div className="h-4 w-24 rounded-sm bg-surface-1" />
                <div className="h-6 w-48 rounded-sm bg-surface-1" />
                <div className="h-4 w-full max-w-md rounded-sm bg-surface-1" />
                {hydrated && !session && isOnline === false ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    Sign-in status cannot be confirmed while offline.
                  </p>
                ) : null}
              </SbCard>
            </SbContainer>
          </SbSection>
        </main>
        <SbBottomNav active="Account" />
      </>
    )
  }

  return (
    <>
      <OfflineBanner />
      {children}
    </>
  )
}
