"use client"

import { useEffect, useState } from "react"
import { type Session, type User } from "@supabase/supabase-js"

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type AuthState = {
  session: Session | null
  user: User | null
  loading: boolean
  hydrated: boolean
}

export function useAuth(): AuthState {
  const supabase = createSupabaseBrowserClient()
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    loading: Boolean(supabase),
    hydrated: !supabase,
  })

  useEffect(() => {
    if (!supabase) {
      return
    }

    let isMounted = true

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) {
          return
        }

        const session = data.session ?? null

        setAuthState({
          session,
          user: session?.user ?? null,
          loading: false,
          hydrated: true,
        })
      })
      .catch(() => {
        if (!isMounted) {
          return
        }

        setAuthState({
          session: null,
          user: null,
          loading: false,
          hydrated: true,
        })
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        session: session ?? null,
        user: session?.user ?? null,
        loading: false,
        hydrated: true,
      })
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  return authState
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
