import * as React from "react"
import {
  API_ENDPOINTS,
  DocHeader,
  DocFilterBar,
  EndpointCard,
  AuthorizeModal,
  type ApiTag,
} from "./documentation"

// Re-export types
export * from "./documentation/types"

const STORAGE_API_KEY = "pave360_vas_doc_api_key"

export function DocumentationView() {
  const [apiKey, setApiKey] = React.useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_API_KEY) || "pk_live_1800cb88..."
    } catch {
      return "pk_live_1800cb88..."
    }
  })

  const [isAuthorizeOpen, setIsAuthorizeOpen] = React.useState(false)
  const [selectedTag, setSelectedTag] = React.useState<ApiTag>("All")
  const [searchQuery, setSearchQuery] = React.useState("")

  const saveApiKey = (newKey: string) => {
    setApiKey(newKey)
    try {
      localStorage.setItem(STORAGE_API_KEY, newKey)
    } catch {
      // Ignore
    }
  }

  // Filter endpoints reactively
  const filteredEndpoints = React.useMemo(() => {
    return API_ENDPOINTS.filter((ep) => {
      // Filter by Tag
      if (selectedTag !== "All" && ep.tag !== selectedTag) {
        return false
      }

      // Filter by Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const matches =
          ep.path.toLowerCase().includes(query) ||
          ep.method.toLowerCase().includes(query) ||
          ep.summary.toLowerCase().includes(query) ||
          ep.description.toLowerCase().includes(query) ||
          ep.tag.toLowerCase().includes(query)
        if (!matches) return false
      }

      return true
    })
  }, [selectedTag, searchQuery])

  return (
    <div className="space-y-5 font-sans select-none pb-14">
      {/* 1. Header Banner & Authorize */}
      <DocHeader
        apiKey={apiKey}
        onAuthorizeClick={() => setIsAuthorizeOpen(true)}
      />

      {/* 2. Filter & Search Bar */}
      <DocFilterBar
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 3. Endpoint Cards List */}
      <div className="space-y-3">
        {filteredEndpoints.length > 0 ? (
          filteredEndpoints.map((endpoint) => (
            <EndpointCard
              key={endpoint.id}
              endpoint={endpoint}
              apiKey={apiKey}
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-xs text-slate-500 font-normal">
            No endpoints found matching &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>

      {/* 4. Authorize Modal */}
      <AuthorizeModal
        isOpen={isAuthorizeOpen}
        currentApiKey={apiKey}
        onClose={() => setIsAuthorizeOpen(false)}
        onSave={saveApiKey}
      />
    </div>
  )
}

export const VasDocumentationView = DocumentationView
export default DocumentationView
