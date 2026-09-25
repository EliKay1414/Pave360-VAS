import { createFileRoute } from "@tanstack/react-router"
import { SmppServerView } from "../../modules/network/SmppServerView"

export const Route = createFileRoute("/_dashboard/network/smpp-server")({
  component: SmppServerView,
})
