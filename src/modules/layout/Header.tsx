import * as React from "react"
import { Menu } from "lucide-react"
import { useLocation } from "@tanstack/react-router"
import { ADMIN_NAV_GROUPS, BOTTOM_NAV_ITEMS } from "../nav/AdminNav"

interface HeaderProps {
  onOpenSidebar: () => void
}

const PAGE_SUBTITLES: Record<string, string> = {
  "/traffic/sender-ids": "Registered alphanumeric, shortcode, and longcode headers used as Message From",
  "/senders": "Registered alphanumeric, shortcode, and longcode headers used as Message From",
  "/traffic/reports-billing": "Financial billing ledgers, prepaid reserves, postpaid usage, and carrier metrics.",
  "/reports": "Financial billing ledgers, prepaid reserves, postpaid usage, and carrier metrics.",
  "/network/queues": "Asynchronous message pipelines, worker heartbeats, and queue depth metrics",
  "/queues": "Asynchronous message pipelines, worker heartbeats, and queue depth metrics",
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const location = useLocation()
  const pathname = location.pathname

  // Current active page title
  const activePageTitle = React.useMemo(() => {
    if (pathname === "/dashboard" || pathname === "/") return "Dashboard"
    if (pathname === "/ussd" || pathname === "/ussd/notify" || pathname === "/traffic/ussd-sessions") return "USSD"
    if (pathname === "/traffic/reports-billing" || pathname === "/reports") return "Reports & Analytics"
    if (pathname === "/operations/alarms" || pathname === "/alerts") return "Alerts"
    if (pathname === "/administration/roles" || pathname === "/roles") return "Roles & Permissions"
    if (pathname === "/audit-logs" || pathname === "/audit") return "Audit Logs"
    if (pathname === "/settings") return "System Settings"

    for (const group of ADMIN_NAV_GROUPS) {
      const match = group.items.find((item) => item.path === pathname)
      if (match) return match.title
    }

    const bottomMatch = BOTTOM_NAV_ITEMS.find((item) => item.path === pathname)
    if (bottomMatch) return bottomMatch.title

    const leaf = pathname.split("/").filter(Boolean).pop() || "Dashboard"
    return leaf.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }, [pathname])

  const [overrideTitle, setOverrideTitle] = React.useState<string | null>(null)
  const [overrideSubtitle, setOverrideSubtitle] = React.useState<string | null>(null)

  // Listen for custom title overrides (e.g. Message Detail view)
  React.useEffect(() => {
    const handleSetTitle = (e: any) => {
      setOverrideTitle(e.detail || null)
    }
    const handleSetSubtitle = (e: any) => {
      setOverrideSubtitle(e.detail || null)
    }
    window.addEventListener("pave_set_page_title", handleSetTitle)
    window.addEventListener("pave_set_page_subtitle", handleSetSubtitle)
    return () => {
      window.removeEventListener("pave_set_page_title", handleSetTitle)
      window.removeEventListener("pave_set_page_subtitle", handleSetSubtitle)
    }
  }, [])

  // Reset override whenever route pathname changes
  React.useEffect(() => {
    setOverrideTitle(null)
    setOverrideSubtitle(null)
  }, [pathname])

  const displayTitle = overrideTitle || activePageTitle
  const displaySubtitle = overrideSubtitle !== null ? overrideSubtitle : PAGE_SUBTITLES[pathname]

  return (
    <header className="sticky top-0 z-30 flex min-h-16 py-2 items-center justify-between border-b border-slate-200/80 bg-white px-4 md:px-7 font-sans select-none">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden cursor-pointer"
          aria-label="Open Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0c1a2e] truncate">
            {displayTitle}
          </h1>
          {displaySubtitle && (
            <p className="text-xs text-[#5b6e82] font-normal truncate mt-0.5">
              {displaySubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Exact Template Status Indicator (Complete + Latency Metrics) */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          <span>Complete</span>
        </div>
        <span className="text-xs font-medium text-[#7c8ea2]">
          38ms/14ms
        </span>
      </div>
    </header>
  )
}

export default Header

