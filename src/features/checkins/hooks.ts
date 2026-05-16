"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/features/auth/hooks"
import { queryKeys } from "@/lib/queryKeys"
import {
  createSupabaseBrowserClient,
  hasSupabaseConfig,
} from "@/lib/supabase/client"

import { CheckInError, type CheckInPosition } from "./types"

const skoltzLocation: CheckInPosition = {
  latitude: 29.7604,
  longitude: -95.3698,
}
const allowedRadiusMeters = 150
const checkInCooldownMs = 12 * 60 * 60 * 1000

type LatestCheckInRow = {
  timestamp: string
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  if (!window.navigator.onLine) {
    return Promise.reject(
      new CheckInError("SUPABASE_ERROR", "You need to be online to check in.")
    )
  }

  if (!("geolocation" in window.navigator)) {
    return Promise.reject(
      new CheckInError("GEO_UNAVAILABLE", "Geolocation is not available.")
    )
  }

  return new Promise((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 60_000,
    })
  })
}

function mapGeolocationError(error: unknown): CheckInError {
  if (error instanceof CheckInError) {
    return error
  }

  const maybeGeolocationError = error as { code?: number }

  if (typeof maybeGeolocationError.code === "number") {
    if (maybeGeolocationError.code === 1) {
      return new CheckInError(
        "GEO_PERMISSION_DENIED",
        "Location permission is required to check in."
      )
    }

    if (maybeGeolocationError.code === 2) {
      return new CheckInError(
        "GEO_UNAVAILABLE",
        "Your location could not be determined."
      )
    }

    if (maybeGeolocationError.code === 3) {
      return new CheckInError("GEO_TIMEOUT", "Location lookup timed out.")
    }
  }

  return new CheckInError("GEO_ERROR", "Location check failed.")
}

function distanceInMeters(first: CheckInPosition, second: CheckInPosition) {
  const earthRadiusMeters = 6_371_000
  const firstLatitude = (first.latitude * Math.PI) / 180
  const secondLatitude = (second.latitude * Math.PI) / 180
  const latitudeDelta = ((second.latitude - first.latitude) * Math.PI) / 180
  const longitudeDelta = ((second.longitude - first.longitude) * Math.PI) / 180
  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2)

  return (
    earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  )
}

function mapSupabaseError(error: unknown): CheckInError {
  const maybeError = error as { code?: string; message?: string }
  const message = maybeError.message?.toLowerCase()

  if (
    maybeError.code === "23505" ||
    message?.includes("duplicate") ||
    message?.includes("12 hours")
  ) {
    return new CheckInError(
      "DUPLICATE",
      "You can only check in once every 12 hours."
    )
  }

  return new CheckInError(
    "SUPABASE_ERROR",
    maybeError.message ?? "Check-in could not be saved."
  )
}

async function assertCheckInCooldown(userId: string) {
  const supabase = createSupabaseBrowserClient()

  if (!supabase) {
    throw new CheckInError(
      "NOT_CONFIGURED",
      "Supabase is not configured for check-ins."
    )
  }

  const { data, error } = await supabase
    .from("checkins")
    .select("timestamp")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false })
    .limit(1)
    .maybeSingle<LatestCheckInRow>()

  if (error) {
    throw mapSupabaseError(error)
  }

  if (!data?.timestamp) {
    return
  }

  const lastCheckInTime = new Date(data.timestamp).getTime()

  if (Date.now() - lastCheckInTime < checkInCooldownMs) {
    throw new CheckInError(
      "DUPLICATE",
      "You can only check in once every 12 hours."
    )
  }
}

export function useCreateCheckIn() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async () => {
      if (!window.navigator.onLine) {
        throw new CheckInError("SUPABASE_ERROR", "You need to be online to check in.")
      }

      if (!user) {
        throw new CheckInError(
          "NOT_AUTHENTICATED",
          "You must be signed in to check in."
        )
      }

      if (!hasSupabaseConfig()) {
        throw new CheckInError(
          "NOT_CONFIGURED",
          "Supabase is not configured for check-ins."
        )
      }

      const supabase = createSupabaseBrowserClient()

      if (!supabase) {
        throw new CheckInError(
          "NOT_CONFIGURED",
          "Supabase is not configured for check-ins."
        )
      }

      await assertCheckInCooldown(user.id)

      let position: GeolocationPosition

      try {
        position = await getCurrentPosition()
      } catch (error) {
        throw mapGeolocationError(error)
      }

      const checkInPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      const distance = distanceInMeters(skoltzLocation, checkInPosition)

      if (distance > allowedRadiusMeters) {
        throw new CheckInError(
          "TOO_FAR",
          "You need to be at Skoltz to check in."
        )
      }

      const { error } = await supabase.from("checkins").insert({
        user_id: user.id,
        timestamp: new Date().toISOString(),
        latitude: checkInPosition.latitude,
        longitude: checkInPosition.longitude,
      })

      if (error) {
        throw mapSupabaseError(error)
      }
    },
    retry: false,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.rewards.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.checkins.all }),
        user
          ? queryClient.invalidateQueries({
              queryKey: queryKeys.checkins.byUser(user.id),
            })
          : Promise.resolve(),
      ])
    },
  })
}
