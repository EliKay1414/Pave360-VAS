import * as React from "react"
import { X, Calendar } from "lucide-react"
import { ALL_SCOPES_LEFT, ALL_SCOPES_RIGHT, type ApiKeyRecord } from "../types"

interface CreateApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (newKey: ApiKeyRecord, secretKey: string) => void
}

export function CreateApiKeyModal({
  isOpen,
  onClose,
  onCreate,
}: CreateApiKeyModalProps) {
  const [name, setName] = React.useState("")
  const [tenant, setTenant] = React.useState("Pave360")
  const [selectedScopes, setSelectedScopes] = React.useState<string[]>([
    "messages.read",
    "messages.send",
  ])
  const [expiresAt, setExpiresAt] = React.useState("")
  const [isSandbox, setIsSandbox] = React.useState(true)
  const [notes, setNotes] = React.useState("")

  if (!isOpen) return null

  const handleToggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const rawHex = Math.random().toString(16).substring(2, 10)
    const rawSecretHex =
      Math.random().toString(16).substring(2, 14) +
      Math.random().toString(16).substring(2, 14)

    const prefix = isSandbox
      ? `pk_test_${rawHex}...`
      : `pk_live_${rawHex}...`

    const secretKey = isSandbox
      ? `vas_test_sec_${rawSecretHex}`
      : `vas_live_sec_${rawSecretHex}`

    const nowUtc = new Date().toISOString().replace("T", " ").substring(0, 19) + "Z"

    const newKeyRecord: ApiKeyRecord = {
      id: `key_${Date.now()}`,
      name: name.trim() || "Production messaging",
      prefix,
      secretKey,
      scopes: selectedScopes,
      mode: isSandbox ? "Sandbox" : "Live",
      status: "Active",
      lastUsed: "Never",
      tenant: tenant || "Pave360",
      expiresAt: expiresAt || undefined,
      notes: notes.trim() || undefined,
      createdAt: nowUtc,
    }

    onCreate(newKeyRecord, secretKey)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden relative z-10 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0c1a2e]">
              Create API key
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Production messaging"
                className="w-full h-10 px-3.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944]"
              />
            </div>

            {/* Tenant Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Tenant
              </label>
              <select
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                className="w-full h-10 px-3.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] cursor-pointer"
              >
                <option value="— Select tenant —">— Select tenant —</option>
                <option value="Pave360">Pave360</option>
              </select>
            </div>

            {/* Scopes Field (Two Columns matching media_1790356235642.png) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Scopes
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Left Column */}
                <div className="space-y-2">
                  {ALL_SCOPES_LEFT.map((scope) => {
                    const isChecked = selectedScopes.includes(scope)
                    return (
                      <label
                        key={scope}
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleScope(scope)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-[#0070f3] focus:ring-[#0070f3] cursor-pointer"
                        />
                        <span className="font-mono text-xs text-slate-700">
                          {scope}
                        </span>
                      </label>
                    )
                  })}
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  {ALL_SCOPES_RIGHT.map((scope) => {
                    const isChecked = selectedScopes.includes(scope)
                    return (
                      <label
                        key={scope}
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleScope(scope)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-[#0070f3] focus:ring-[#0070f3] cursor-pointer"
                        />
                        <span className="font-mono text-xs text-slate-700">
                          {scope}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Expires at (UTC) & Sandbox key checkbox row */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-slate-700">
                Expires at (UTC)
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-50">
                  <input
                    type="text"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    placeholder="mm/dd/yyyy --:-- --"
                    className="w-full h-10 pl-3.5 pr-9 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944]"
                  />
                  <Calendar className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={isSandbox}
                    onChange={(e) => setIsSandbox(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-[#0070f3] focus:ring-[#0070f3] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Sandbox key
                  </span>
                </label>
              </div>
            </div>

            {/* Notes Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes or integration details..."
                className="w-full h-10 px-3.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944]"
              />
            </div>

            {/* Footer Actions matching screenshot */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
