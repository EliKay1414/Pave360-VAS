import { createFileRoute } from "@tanstack/react-router"
import { ApiKeysView } from "../../modules/developers/ApiKeysView"

export const Route = createFileRoute("/_dashboard/developers/api-keys")({
  component: ApiKeysView,
})
