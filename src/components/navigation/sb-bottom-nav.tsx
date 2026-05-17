"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type NavItem = {
  label: "Today" | "This Week" | "This Month" | "Menu"
  href: string
  icon: "today" | "week" | "month" | "menu"
}

const navItems: NavItem[] = [
  { label: "Today", href: "/", icon: "today" },
  { label: "This Week", href: "/#this-week", icon: "week" },
  { label: "This Month", href: "/#calendar", icon: "month" },
  { label: "Menu", href: "/menu", icon: "menu" },
]

function NavIcon({ icon }: { icon: NavItem["icon"] }) {
  const commonProps = {
    "aria-hidden": true,
    className: "size-4",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
  }

  if (icon === "today") {
    return (
      <svg {...commonProps}>
        <path d="M7 4v3" />
        <path d="M17 4v3" />
        <path d="M5 8h14" />
        <path d="M6 6h12v14H6z" />
        <path d="M9 13h6" />
      </svg>
    )
  }

  if (icon === "week") {
    return (
      <svg {...commonProps}>
        <path d="M7 4v3" />
        <path d="M17 4v3" />
        <path d="M5 8h14" />
        <path d="M6 6h12v14H6z" />
        <path d="M8 12h1" />
        <path d="M12 12h1" />
        <path d="M16 12h1" />
        <path d="M8 16h1" />
        <path d="M12 16h1" />
        <path d="M16 16h1" />
      </svg>
    )
  }

  if (icon === "month") {
    return (
      <svg {...commonProps}>
        <path d="M7 4v3" />
        <path d="M17 4v3" />
        <path d="M5 8h14" />
        <path d="M6 6h12v14H6z" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    )
  }

  return (
    <svg {...commonProps}>
      <path d="M7 5h10" />
      <path d="M7 12h10" />
      <path d="M7 19h10" />
      <path d="M4 5h.01" />
      <path d="M4 12h.01" />
      <path d="M4 19h.01" />
    </svg>
  )
}

export function SbBottomNav({
  active = "Today",
  className,
}: {
  active?: NavItem["label"] | null
  className?: string
}) {
  const pathname = usePathname()
  const [effectiveActive, setEffectiveActive] = useState<NavItem["label"] | null>(
    active
  )

  useEffect(() => {
    function resolveActiveItem(calendarInView = false): NavItem["label"] | null {
      if (pathname === "/menu") {
        return "Menu"
      }

      if (pathname === "/") {
        if (window.location.hash === "#calendar" || calendarInView) {
          return "This Month"
        }

        if (window.location.hash === "#this-week") {
          return "This Week"
        }

        if (window.scrollY < 120 && !calendarInView) {
          return "Today"
        }

        return "Today"
      }

      return active
    }

    function updateActiveItem() {
      setEffectiveActive(resolveActiveItem())
    }

    updateActiveItem()
    window.addEventListener("hashchange", updateActiveItem)

    const calendarSection = document.getElementById("calendar")
    const thisWeekSection = document.getElementById("this-week")
    const calendarObserver =
      pathname === "/" && calendarSection
        ? new IntersectionObserver(
            ([entry]) => {
              setEffectiveActive(resolveActiveItem(entry.isIntersecting))
            },
            {
              root: null,
              rootMargin: "-25% 0px -45% 0px",
              threshold: 0,
            }
          )
        : null

    calendarObserver?.observe(calendarSection as Element)

    const thisWeekObserver =
      pathname === "/" && thisWeekSection
        ? new IntersectionObserver(
            ([entry]) => {
              setEffectiveActive(
                entry.isIntersecting ? "This Week" : resolveActiveItem()
              )
            },
            {
              root: null,
              rootMargin: "-25% 0px -45% 0px",
              threshold: 0,
            }
          )
        : null

    thisWeekObserver?.observe(thisWeekSection as Element)

    return () => {
      window.removeEventListener("hashchange", updateActiveItem)
      calendarObserver?.disconnect()
      thisWeekObserver?.disconnect()
    }
  }, [active, pathname])

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-1/95 px-2 pt-1.5 pb-[calc(env(safe-area-inset-bottom)+0.375rem)] shadow-[var(--sb-shadow-lg)] backdrop-blur",
        className
      )}
    >
      <div className="mx-auto grid max-w-2xl grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = item.label === effectiveActive

          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex min-h-10 flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[0.625rem] font-semibold text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive && "bg-primary/10 text-primary"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <NavIcon icon={item.icon} />
              <span>{item.label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
