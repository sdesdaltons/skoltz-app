import Image from "next/image"

import logoImage from "../../../logo.jpg"

export function SbLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <Image
      src={logoImage}
      alt="Skoltz Sports Bar and Grill"
      className={className}
      priority
    />
  )
}
