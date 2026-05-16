"use client"

import { useState } from "react"

import { useAuth, useOnlineStatus } from "@/features/auth/hooks"
import { SbButton } from "@/components/ui"

import { useCreateCheckIn } from "../hooks"
import { CheckInError } from "../types"

export function CheckInButton() {
  const { hydrated, loading, user } = useAuth()
  const isOnline = useOnlineStatus()
  const createCheckIn = useCreateCheckIn()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!hydrated || loading || !user) {
    return null
  }

  async function handleCheckIn() {
    if (isSubmitting || createCheckIn.isPending) {
      return
    }

    setMessage(null)
    setErrorMessage(null)

    if (isOnline === false) {
      setErrorMessage("You need to be online to check in.")
      return
    }

    try {
      setIsSubmitting(true)
      await createCheckIn.mutateAsync()
      setMessage("Check-in saved. Rewards updates are handled by the server.")
    } catch (error) {
      setErrorMessage(
        error instanceof CheckInError
          ? error.message
          : "Check-in could not be completed."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-3">
      <SbButton
        type="button"
        disabled={isSubmitting || createCheckIn.isPending || isOnline === false}
        onClick={() => void handleCheckIn()}
      >
        {isSubmitting || createCheckIn.isPending
          ? "Checking in..."
          : isOnline === false
            ? "Offline"
            : "Check in"}
      </SbButton>
      {message ? <p className="text-sm text-success">{message}</p> : null}
      {errorMessage ? (
        <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
