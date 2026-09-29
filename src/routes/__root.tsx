import * as React from "react"
import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router"
import { useBrand } from "../shared/hooks/useBrand"
import { applyGlobalTheme, type ThemeMode } from "../shared/lib/theme"
import { useAuth } from "../shared/hooks/useAuth"
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

function AuthSessionInitializer() {
  const { checkSession, signedIn, user } = useAuth()
  const hasChecked = React.useRef(false)

  React.useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true

    if (typeof window === "undefined") return
    const pathname = window.location.pathname
    const isAuthPage = pathname.includes("/login") || pathname.includes("/logout") || pathname.includes("/register")
    if (isAuthPage) return

    // If operator session is already active & hydrated, skip speculative auth/me call
    if (signedIn && user?.email) return

    const hasSavedAuth = localStorage.getItem("pave360_vas_authenticated") === "true"
    if (!hasSavedAuth) return

    checkSession().catch(() => undefined)
  }, [checkSession, signedIn, user?.email])

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
      <AuthSessionInitializer />
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
