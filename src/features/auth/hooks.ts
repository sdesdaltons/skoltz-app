"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { type Session, type User } from "@supabase/supabase-js"

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type AuthState = {
  session: Session | null
  user: User | null
  loading: boolean
  hydrated: boolean
}

const supabase = createSupabaseBrowserClient()
const authSubscribers = new Set<() => void>()
let authSnapshot: AuthState = {
  session: null,
  user: null,
  loading: Boolean(supabase),
  hydrated: !supabase,
}
let authStoreInitialized = false
let authRequestVersion = 0
let authSubscription: { unsubscribe: () => void } | null = null

function emitAuthState(nextAuthState: AuthState) {
  authSnapshot = nextAuthState
  authSubscribers.forEach((subscriber) => subscriber())
}

function initializeAuthStore() {
  if (authStoreInitialized || !supabase) {
    return
  }

  authStoreInitialized = true
  const requestVersion = ++authRequestVersion

  supabase.auth
    .getSession()
    .then(({ data }) => {
      if (!authStoreInitialized || requestVersion !== authRequestVersion) {
        return
      }

      const session = data.session ?? null

      emitAuthState({
        session,
        user: session?.user ?? null,
        loading: false,
        hydrated: true,
      })
    })
    .catch(() => {
      if (!authStoreInitialized || requestVersion !== authRequestVersion) {
        return
      }

      emitAuthState({
        session: null,
        user: null,
        loading: false,
        hydrated: true,
      })
    })

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    emitAuthState({
      session: session ?? null,
      user: session?.user ?? null,
      loading: false,
      hydrated: true,
    })
  })

  authSubscription = subscription
}

function subscribeToAuthStore(subscriber: () => void) {
  authSubscribers.add(subscriber)
  initializeAuthStore()

  return () => {
    authSubscribers.delete(subscriber)

    if (authSubscribers.size === 0) {
      authSubscription?.unsubscribe()
      authSubscription = null
      authStoreInitialized = false
      authRequestVersion += 1
    }
  }
}

function getAuthSnapshot() {
  return authSnapshot
}

export function useAuth(): AuthState {
  return useSyncExternalStore(
    subscribeToAuthStore,
    getAuthSnapshot,
    getAuthSnapshot
  )
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)

  useEffect(() => {
    function syncOnlineStatus() {
      setIsOnline(window.navigator.onLine)
    }

    syncOnlineStatus()
    window.addEventListener("online", syncOnlineStatus)
    window.addEventListener("offline", syncOnlineStatus)

    return () => {
      window.removeEventListener("online", syncOnlineStatus)
      window.removeEventListener("offline", syncOnlineStatus)
    }
  }, [])

  return isOnline
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createSupabaseBrowserClient()

  if (!supabase) {
    throw new Error("Supabase auth is not configured.")
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createSupabaseBrowserClient()

  if (!supabase) {
    throw new Error("Supabase auth is not configured.")
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw error
  }
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient()

  if (!supabase) {
    throw new Error("Supabase auth is not configured.")
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}
