import { createFileRoute } from "@tanstack/react-router"
import { ApiKeysView } from "../../modules/developers/ApiKeysView"

export const Route = createFileRoute("/_dashboard/developers/api-keys")({
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id: (search.id as string) || undefined,
  }),
  component: ApiKeysView,
})
