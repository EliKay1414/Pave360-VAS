/**
 * Global Theme & Brand Styling Architecture
 * Synchronizes CSS Custom Properties, Tailwind v4 tokens, and shadcn mode states.
 */

export type ThemeMode = "LIGHT" | "DARK" | "SYSTEM"

export const PAVE = {
  teal: "#1ec94d",
  tealHover: "#16a34a",
  darkTeal: "#0f172a",
  accent: "#1ec94d",
  mint: "#1ec94d",
  pageLight: "#f8fafc",
  pageDark: "#0b0f17",
  cardDark: "#111820",
} as const

/**
 * Adjust hex color brightness dynamically (negative for darker hover, positive for lighter)
 */
export function adjustHexBrightness(hex: string, percent: number): string {
  let clean = hex.replace("#", "")
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("")
  }
  const num = parseInt(clean, 16)
  if (isNaN(num)) return hex

  let r = (num >> 16) + Math.round((255 * percent) / 100)
  let g = ((num >> 8) & 0x00ff) + Math.round((255 * percent) / 100)
  let b = (num & 0x0000ff) + Math.round((255 * percent) / 100)

  r = Math.min(255, Math.max(0, r))
  g = Math.min(255, Math.max(0, g))
  b = Math.min(255, Math.max(0, b))

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}

/**
 * Convert hex color to RGBA string for transparent rings & backdrop highlights
 */
export function hexToRgba(hex: string, alpha: number): string {
  let clean = hex.replace("#", "")
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("")
  }
  const num = parseInt(clean, 16)
  if (isNaN(num)) return `rgba(30, 201, 77, ${alpha})`

  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Global Theme Applicator
 * Applies active brand color and light/dark theme classes globally to document.documentElement.
 */
export function applyGlobalTheme(
  color: string = "#1ec94d",
  mode: ThemeMode = "LIGHT"
): void {
  if (typeof document === "undefined") return

  const root = document.documentElement

  // 1. Resolve Theme Mode (Light / Dark / System)
  let isDark = false
  if (mode === "DARK") {
    isDark = true
  } else if (mode === "SYSTEM") {
    isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  } else {
    isDark = false
  }

  root.classList.toggle("dark", isDark)

  // 2. Compute dynamic color shades
  const primaryHex = color || "#1ec94d"
  const hoverHex = adjustHexBrightness(primaryHex, -15)
  const lightRgba = hexToRgba(primaryHex, 0.12)
  const ringRgba = hexToRgba(primaryHex, 0.35)

  // 3. Set global CSS custom properties on :root
  root.style.setProperty("--brand-primary", primaryHex)
  root.style.setProperty("--brand-primary-hover", hoverHex)
  root.style.setProperty("--brand-primary-light", lightRgba)
  root.style.setProperty("--brand-primary-ring", ringRgba)
  root.style.setProperty("--color-primary", primaryHex)
  root.style.setProperty("--color-primary-hover", hoverHex)

  // 4. Persist in localStorage for instant bootstrapping
  try {
    localStorage.setItem("pave_theme_mode", mode)
    localStorage.setItem("pave_brand_color", primaryHex)
  } catch {}
}
