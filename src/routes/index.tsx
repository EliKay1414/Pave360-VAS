import { createFileRoute, redirect } from "@tanstack/react-router"
import { store } from "../shared/store"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const isAuth =
      store.getState().auth.signedIn ||
      (typeof window !== "undefined" && localStorage.getItem("pave360_vas_authenticated") === "true")
    if (!isAuth) {
      throw redirect({ to: "/login" })
    }
    throw redirect({ to: "/dashboard" })
  },
})
