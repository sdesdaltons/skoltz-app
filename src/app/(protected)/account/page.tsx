"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { SbContainer, SbSection, SbSectionHeader } from "@/components/layout"
import { SbBottomNav } from "@/components/navigation"
import { SbBadge, SbButton, SbCard } from "@/components/ui"
import { signOut, useAuth } from "@/features/auth/hooks"

export default function AccountPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSignOut() {
    setIsSigningOut(true)
    setErrorMessage(null)

    try {
      await signOut()
      router.replace("/login")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Sign out failed.")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <>
      <main className="flex-1 pb-24 md:pb-0">
        <SbSection className="py-8 sm:py-12">
          <SbContainer className="space-y-6">
            <SbSectionHeader
              title="Account"
              subtitle="Protected account placeholder for the signed-in user."
            />

            <SbCard className="space-y-4 bg-surface-2">
              <SbBadge tone="blue">Signed in</SbBadge>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">
                  Email
                </p>
                <p className="break-words text-xl font-semibold">
                  {user?.email ?? "Unknown email"}
                </p>
              </div>
              {errorMessage ? (
                <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}
              <SbButton
                type="button"
                variant="secondary"
                disabled={isSigningOut}
                onClick={() => void handleSignOut()}
              >
                {isSigningOut ? "Signing out..." : "Sign out"}
              </SbButton>
            </SbCard>
          </SbContainer>
        </SbSection>
      </main>
      <SbBottomNav active={null} />
    </>
  )
}
