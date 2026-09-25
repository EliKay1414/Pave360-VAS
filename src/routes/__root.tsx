import * as React from "react"
import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router"
import { useBrand } from "../shared/hooks/useBrand"
import { applyGlobalTheme, type ThemeMode } from "../shared/lib/theme"
import { Toaster } from "sonner"

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  React.useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
    const mainEl = document.querySelector("main")
    if (mainEl) mainEl.scrollTop = 0
  }, [pathname, hash])
  return null
}

function ThemeApplier() {
  const { theme, brand } = useBrand()
  const { pathname } = useLocation()

  React.useEffect(() => {
    applyGlobalTheme(brand.brandColor || "#00b8ec", (theme as ThemeMode) || "LIGHT")
  }, [theme, brand.brandColor])

  React.useEffect(() => {
    if (pathname === "/login") {
      document.title = "Operator Sign In · Pave360 VAS"
      return
    }
    if (pathname === "/logout") {
      document.title = "Operator Signed Out · Pave360 VAS"
      return
    }
    if (pathname === "/register") {
      document.title = "Operator Sign In · Pave360 VAS"
      return
    }

    const leaf = pathname.split("/").filter(Boolean).pop() || "Dashboard"
    const page = leaf.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    document.title = `${page} · Pave360 VAS`
  }, [pathname])
  return null
}

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { pathname } = useLocation()
  const isAuthPage = pathname === "/login" || pathname === "/logout" || pathname === "/register"

  return (
    <>
      <ScrollToTop />
      <ThemeApplier />
      <div className={`min-h-full font-sans antialiased relative ${isAuthPage ? "w-full" : "h-full overflow-hidden surface-page"}`}>
        <Outlet />
      </div>
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={3500}
        toastOptions={{
          style: {
            borderRadius: "1rem",
            fontSize: "0.8125rem",
            fontWeight: "600",
            padding: "0.75rem 1.25rem",
          },
        }}
      />
    </>
  )
}
