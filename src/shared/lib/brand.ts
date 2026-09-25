import type { BrandConfig, User } from "../store/types"
import { PAVE } from "./theme"

const PRODUCT = "Pave360 VAS"

export function shopHandleFromName(name?: string | null) {
  return (
    (name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "vas"
  )
}

function clean(value?: string | null) {
  const text = value?.trim() || ""
  if (!text) return ""
  return text
}

export function initialsOf(name?: string | null, fallback = "PV") {
  if (!clean(name)) return fallback
  return clean(name)
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function profileIdentity(user?: User | null) {
  const company = clean(user?.company)
  const person = clean(user?.name)
  return {
    company,
    person,
    headerName: company || person,
    product: PRODUCT,
  }
}

export function resolveBrand(
  brand: BrandConfig,
  _shopName?: string,
  _user?: User | null,
) {
  const name = "Pave360 VAS"
  const tagline = clean(brand.brandTagline) || "Enterprise Telecom Switching & Operator Telemetry"
  const color = brand.brandColor?.trim() || PAVE.teal
  return {
    name,
    tagline,
    color,
    logo: brand.brandLogoUrl,
    domain: brand.brandDomain,
    custom: false,
    product: PRODUCT,
    glanceTitle: "Dashboard",
    glanceSubtitle: `${name} at a glance — traffic, routes, and interconnects.`,
    footerName: name,
  }
}
