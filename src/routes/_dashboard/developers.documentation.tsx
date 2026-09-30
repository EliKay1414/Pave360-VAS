import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"

const SWAGGER_DOCS_URL = "https://vas.pave360.com/swagger/index.html"

export const Route = createFileRoute("/_dashboard/developers/documentation")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      window.location.replace(SWAGGER_DOCS_URL)
    }
  },
  component: SwaggerRedirect,
})

function SwaggerRedirect() {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace(SWAGGER_DOCS_URL)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 space-y-4 font-sans select-none">
      <div className="h-8 w-8 border-3 border-slate-200 border-t-[#00b8ec] rounded-full animate-spin" />
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-slate-800">
          Redirecting to Pave360 VAS Swagger Documentation...
        </p>
        <p className="text-xs text-slate-500">
          Opening{" "}
          <span className="font-mono text-slate-600">
            {SWAGGER_DOCS_URL}
          </span>
        </p>
      </div>
      <a
        href={SWAGGER_DOCS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold text-[#0070f3] hover:underline pt-2"
      >
        Click here if you are not redirected automatically &rarr;
      </a>
    </div>
  )
}
