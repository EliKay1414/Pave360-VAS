import { createFileRoute } from "@tanstack/react-router"

const SWAGGER_DOCS_URL = "https://vas.pave360.com/swagger/index.html"

export const Route = createFileRoute("/_dashboard/swagger")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      window.location.replace(SWAGGER_DOCS_URL)
    }
  },
  component: () => null,
})
