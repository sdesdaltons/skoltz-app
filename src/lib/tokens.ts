export const colors = {
  blue: "#1E4DFF",
  red: "#E53935",
  background: "#111111",
  surface1: "#171717",
  surface2: "#1D1D1D",
  text: "#F2F2F2",
  mutedText: "#CCCCCC",
  success: "#2ECC71",
  warning: "#FFB020",
  error: "#FF4D4F",
} as const

export const spacing = {
  0: "0",
  1: "0.5rem",
  2: "1rem",
  3: "1.5rem",
  4: "2rem",
  5: "2.5rem",
  6: "3rem",
  8: "4rem",
  10: "5rem",
  12: "6rem",
} as const

export const radius = {
  xs: "0.25rem",
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
} as const

export const shadows = {
  sm: "0 1px 2px rgb(0 0 0 / 0.32)",
  md: "0 12px 32px rgb(0 0 0 / 0.36)",
  lg: "0 24px 64px rgb(0 0 0 / 0.42)",
  glowBlue:
    "0 0 0 1px rgb(30 77 255 / 0.24), 0 0 32px rgb(30 77 255 / 0.22)",
  glowRed:
    "0 0 0 1px rgb(229 57 53 / 0.22), 0 0 32px rgb(229 57 53 / 0.18)",
} as const

export const tokens = {
  colors,
  spacing,
  radius,
  shadows,
} as const
