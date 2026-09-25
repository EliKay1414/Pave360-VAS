import { createFileRoute } from "@tanstack/react-router"
import { SettingsView } from "../../modules/settings/SettingsView"

export const Route = createFileRoute("/_dashboard/settings")({
  component: SettingsView,
})
