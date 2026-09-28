import { createFileRoute, redirect } from "@tanstack/react-router"
import { store } from "../shared/store"
import { VasLayoutView } from "../modules/layout/VasLayoutView"

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: () => {
    const isAuth =
      store.getState().auth.signedIn ||
      (typeof window !== "undefined" && localStorage.getItem("pave360_vas_authenticated") === "true")
    if (!isAuth) {
      throw redirect({ to: "/login" })
    }
  },
  component: VasLayoutView,
})
