import { Link } from "@tanstack/react-router"
import { LayoutGrid, Wifi, AlignLeft, Bell, MoreHorizontal } from "lucide-react"

interface BottomNavigationProps {
  location: { pathname: string }
  mobileSidebarOpen: boolean
  onOpenSidebar: () => void
}

export function BottomNavigation({ location, mobileSidebarOpen, onOpenSidebar }: BottomNavigationProps) {
  const item = (active: boolean) =>
    `flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all ${
      active
        ? "text-[#00b8ec] font-bold"
        : "text-slate-500 hover:text-slate-900 font-medium"
    }`

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#011b33] text-slate-400 flex justify-around items-center h-16 pb-[env(safe-area-inset-bottom)] border-t border-[#09223c] font-sans">
      <Link to="/dashboard" className={item(location.pathname === "/dashboard")}>
        <LayoutGrid className="h-5 w-5" />
        <span className="text-[11px] mt-1">Dashboard</span>
      </Link>
      <Link to={"/network/carriers" as any} className={item(location.pathname.startsWith("/network"))}>
        <Wifi className="h-5 w-5" />
        <span className="text-[11px] mt-1">Network</span>
      </Link>
      <Link to={"/traffic/logs" as any} className={item(location.pathname.startsWith("/traffic"))}>
        <AlignLeft className="h-5 w-5" />
        <span className="text-[11px] mt-1">Traffic</span>
      </Link>
      <Link to={"/operations/alarms" as any} className={item(location.pathname.startsWith("/operations"))}>
        <Bell className="h-5 w-5" />
        <span className="text-[11px] mt-1">Alarms</span>
      </Link>
      <button type="button" onClick={onOpenSidebar} className={item(mobileSidebarOpen)}>
        <MoreHorizontal className="h-5 w-5" />
        <span className="text-[11px] mt-1">Menu</span>
      </button>
    </div>
  )
}

export default BottomNavigation
