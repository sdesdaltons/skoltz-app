"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
  icon: "home" | "calendar" | "rewards" | "account"
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Calendar", href: "/#calendar", icon: "calendar" },
  { label: "Rewards", href: "/rewards", icon: "rewards" },
  { label: "Account", href: "/account", icon: "account" },
]

function NavIcon({ icon }: { icon: NavItem["icon"] }) {
  const commonProps = {
    "aria-hidden": true,
    className: "size-5",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
  }

  if (icon === "home") {
    return (
      <svg {...commonProps}>
        <path d="M4 11.5 12 5l8 6.5" />
        <path d="M6.5 10.5V20h11v-9.5" />
      </svg>
    )
  }

  if (icon === "calendar") {
    return (
      <svg {...commonProps}>
        <path d="M7 4v3" />
        <path d="M17 4v3" />
        <path d="M5 8h14" />
        <path d="M6 6h12v14H6z" />
      </svg>
    )
  }

  if (icon === "rewards") {
    return (
      <svg {...commonProps}>
        <path d="M12 4l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" />
      </svg>
    )
  }

  return (
    <svg {...commonProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c1.4-3.2 3.8-5 7-5s5.6 1.8 7 5" />
    </svg>
  )
}

export function SbBottomNav({
  active = "Home",
  className,
}: {
  active?: NavItem["label"]
  className?: string
}) {
  const pathname = usePathname()
  const [effectiveActive, setEffectiveActive] = useState<NavItem["label"]>(
    active
  )

  useEffect(() => {
    function resolveActiveItem(): NavItem["label"] {
      if (window.location.hash === "#calendar" || pathname === "/calendar") {
        return "Calendar"
      }

      if (pathname === "/rewards") {
        return "Rewards"
      }

      if (pathname === "/account" || pathname === "/login") {
        return "Account"
      }

      if (pathname === "/") {
        return "Home"
      }

      return active
    }

    function updateActiveItem() {
      setEffectiveActive(resolveActiveItem())
    }

    updateActiveItem()
    window.addEventListener("hashchange", updateActiveItem)

    return () => {
      window.removeEventListener("hashchange", updateActiveItem)
    }
  }, [active, pathname])

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-1/95 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-[var(--sb-shadow-lg)] backdrop-blur",
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
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-1 text-[0.6875rem] font-semibold text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive && "bg-primary/15 text-primary"
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
