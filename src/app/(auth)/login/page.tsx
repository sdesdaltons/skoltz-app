"use client"

import { type FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { OfflineBanner } from "@/components/feedback"
import { SbContainer, SbSection } from "@/components/layout"
import { SbBottomNav } from "@/components/navigation"
import { SbBadge, SbButton, SbCard } from "@/components/ui"
import {
  signInWithEmail,
  signUpWithEmail,
  useAuth,
} from "@/features/auth/hooks"

export default function LoginPage() {
  const router = useRouter()
  const { hydrated, loading: authLoading, session } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pendingAction, setPendingAction] = useState<"signin" | "signup" | null>(
    null
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (hydrated && !authLoading && session) {
      router.replace("/")
    }
  }, [authLoading, hydrated, router, session])

  async function handleAuth(action: "signin" | "signup") {
    setErrorMessage(null)
    setPendingAction(action)

    try {
      if (action === "signin") {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password)
      }

      router.replace("/")
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Authentication failed."
      )
    } finally {
      setPendingAction(null)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void handleAuth("signin")
  }

  if (!hydrated || authLoading || session) {
    return (
      <>
        <OfflineBanner />
        <main className="flex-1 pb-24 md:pb-0">
          <SbSection className="py-8 sm:py-12">
            <SbContainer className="max-w-xl">
              <SbCard className="space-y-3 bg-surface-2">
                <div className="h-4 w-24 rounded-sm bg-surface-1" />
                <div className="h-6 w-48 rounded-sm bg-surface-1" />
                <div className="h-4 w-full rounded-sm bg-surface-1" />
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
      <main className="flex-1 pb-24 md:pb-0">
        <SbSection className="py-8 sm:py-12">
          <SbContainer className="max-w-xl space-y-6">
            <div className="space-y-3">
              <SbBadge tone="blue">Account</SbBadge>
              <h1 className="text-4xl font-semibold tracking-normal">
                Sign in to Skoltz
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Guests can still browse events. Sign in when you need protected
                account and rewards areas.
              </p>
            </div>

            <SbCard className="space-y-4 bg-surface-2">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="min-h-12 w-full rounded-md border border-input bg-surface-1 px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="min-h-12 w-full rounded-md border border-input bg-surface-1 px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  />
                </div>

                {errorMessage ? (
                  <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {errorMessage}
                  </p>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <SbButton
                    type="submit"
                    disabled={Boolean(pendingAction) || authLoading}
                  >
                    {pendingAction === "signin" ? "Signing in..." : "Sign in"}
                  </SbButton>
                  <SbButton
                    type="button"
                    variant="secondary"
                    disabled={Boolean(pendingAction) || authLoading}
                    onClick={() => void handleAuth("signup")}
                  >
                    {pendingAction === "signup" ? "Creating..." : "Sign up"}
                  </SbButton>
                </div>
              </form>
            </SbCard>
          </SbContainer>
        </SbSection>
      </main>
      <SbBottomNav active="Account" />
    </>
  )
}
