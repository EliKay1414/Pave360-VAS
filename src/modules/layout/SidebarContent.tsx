import { Link, useNavigate } from "@tanstack/react-router"
import { LogOut } from "lucide-react"
import {
  TOP_NAV_ITEM,
  ADMIN_NAV_GROUPS,
  BOTTOM_NAV_ITEMS,
} from "../nav/AdminNav"
import { useAuth } from "../../shared/hooks/useAuth"

interface SidebarContentProps {
  user?: any
  location: any
  onLinkClick: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function SidebarContent({
  user: propUser,
  location,
  onLinkClick,
}: SidebarContentProps) {
  const navigate = useNavigate()
  const { user: authUser, signOut } = useAuth()
  const activeUser = propUser || authUser

  const email = activeUser?.email?.trim() || ""
  const name = activeUser?.name?.trim() || (email ? email.split("@")[0] : "Admin")
  const initial = (name ? name.charAt(0) : (email ? email.charAt(0) : "A")).toUpperCase() || "A"
  const currentPath = location?.pathname || ""

  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/dashboard"
    return currentPath === path || currentPath.startsWith(path + "/")
  }

  const navItemClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13.5px] transition-colors cursor-pointer select-none ${
      active
        ? "text-[#00b8ec] font-medium"
        : "text-[#8fa3b7] hover:text-white hover:bg-white/[0.04] font-normal"
    }`

  const iconClass = (active: boolean) =>
    `h-[18px] w-[18px] shrink-0 transition-colors ${
      active ? "text-[#00b8ec]" : "text-[#8fa3b7]"
    }`

  const TopIcon = TOP_NAV_ITEM.icon

  return (
    <div className="flex flex-col h-full bg-[#011b33] text-slate-300 font-sans select-none overflow-hidden">
      {/* 1. Header (Fixed at top) */}
      <div className="px-4.5 pt-4 pb-3 flex items-center gap-3 shrink-0">
        <img
          src="/images/pave.png"
          alt="Pave360 VAS"
          className="h-8 w-auto object-contain shrink-0"
        />
        <div className="min-w-0 flex flex-col">
          <h3 className="font-bold text-[16px] text-white leading-tight tracking-tight">
            Pave360 VAS
          </h3>
          <span className="text-[#7e95ab] text-[11px] font-normal leading-tight mt-0.5">
            VAS Engine &middot; Operator
          </span>
        </div>
      </div>

      {/* 2. Scrollable Middle Area (Dashboard + 5 Groups in Exact Order) */}
      <div className="vas-sidebar-scroll flex-1 min-h-0 px-3 py-1 space-y-4">
        {/* Top: Dashboard Link */}
        <div>
          <Link
            to={TOP_NAV_ITEM.path as any}
            preload="intent"
            onClick={onLinkClick}
            className={navItemClass(isActive(TOP_NAV_ITEM.path))}
          >
            <TopIcon className={iconClass(isActive(TOP_NAV_ITEM.path))} />
            <span className="truncate">{TOP_NAV_ITEM.title}</span>
          </Link>
        </div>

        {/* 5 Navigation Groups */}
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.heading} className="space-y-0.5">
            <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#637d97]">
              {group.heading}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const ItemIcon = item.icon
                const active = isActive(item.path)

                if (item.externalUrl) {
                  return (
                    <a
                      key={item.id}
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onLinkClick}
                      className={navItemClass(false)}
                      title={`${item.title} (Opens Swagger Docs)`}
                    >
                      <ItemIcon className={iconClass(false)} />
                      <span className="truncate">{item.title}</span>
                    </a>
                  )
                }

                return (
                  <Link
                    key={item.id}
                    to={item.path as any}
                    preload="intent"
                    onClick={onLinkClick}
                    className={navItemClass(active)}
                  >
                    <ItemIcon className={iconClass(active)} />
                    <span className="truncate">{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Pinned Bottom Section (Audit Logs, Settings, User Profile) */}
      <div className="shrink-0 px-3 pt-2 pb-3 space-y-1 border-t border-[#09223c]">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const ItemIcon = item.icon
          const active = isActive(item.path)

          if (item.externalUrl) {
            return (
              <a
                key={item.id}
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onLinkClick}
                className={navItemClass(false)}
              >
                <ItemIcon className={iconClass(false)} />
                <span className="truncate">{item.title}</span>
              </a>
            )
          }

          return (
            <Link
              key={item.id}
              to={item.path as any}
              preload="intent"
              onClick={onLinkClick}
              className={navItemClass(active)}
            >
              <ItemIcon className={iconClass(active)} />
              <span className="truncate">{item.title}</span>
            </Link>
          )
        })}

        {/* Dynamic User Profile Row */}
        <div className="pt-2 px-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2" title={email || "Operator Admin"}>
            <div className="h-7 w-7 rounded-full bg-[#00b8ec] text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase">
              {initial}
            </div>
            <span className="text-white font-semibold text-[13px] truncate">
              {email || "admin@pave360.com"}
            </span>
          </div>
          <button
            type="button"
            title="Log out"
            onClick={async () => {
              onLinkClick()
              await signOut()
              navigate({ to: "/login" })
            }}
            className="text-[#7e95ab] hover:text-white p-1 rounded transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SidebarContent
