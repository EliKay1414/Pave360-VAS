import { createFileRoute } from "@tanstack/react-router"
import { DocumentationView } from "../../modules/developers/DocumentationView"

export const Route = createFileRoute("/_dashboard/developers/documentation")({
  component: DocumentationView,
})
