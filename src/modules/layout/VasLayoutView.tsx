import * as React from "react"
import { Outlet, useLocation } from "@tanstack/react-router"
import { Header } from "./Header"
import { SidebarContent } from "./SidebarContent"
import { BottomNavigation } from "./BottomNavigation"
import { useAuth } from "../../shared/hooks/useAuth"

export function VasLayoutView() {
  const { user } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-full min-h-0 bg-[#f5f7fa] text-slate-900 font-sans select-none">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar (Fixed non-collapsible for VAS Operator) */}
      <aside
        className={`fixed md:static z-40 h-full w-64 shrink-0 bg-[#011b33] border-r border-[#09223c] transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <SidebarContent
          user={user}
          location={location}
          onLinkClick={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main Content Viewport */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#f5f7fa]">
        {/* Static Header across Desktop & Mobile */}
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="app-scroll flex-1 p-4 md:px-7 md:py-6 pb-20 md:pb-8">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNavigation
        location={location}
        mobileSidebarOpen={sidebarOpen}
        onOpenSidebar={() => setSidebarOpen(true)}
      />
    </div>
  )
}

export default VasLayoutView
