import * as React from "react"
import { Key, X, Check } from "lucide-react"

interface AuthorizeModalProps {
  isOpen: boolean
  currentApiKey: string
  onClose: () => void
  onSave: (key: string) => void
}

export function AuthorizeModal({
  isOpen,
  currentApiKey,
  onClose,
  onSave,
}: AuthorizeModalProps) {
  const [apiKeyInput, setApiKeyInput] = React.useState(currentApiKey)

  React.useEffect(() => {
    setApiKeyInput(currentApiKey)
  }, [currentApiKey, isOpen])

  if (!isOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(apiKeyInput.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200 cursor-pointer"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden relative z-10 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-500" />
              <h3 className="text-base font-bold text-[#0c1a2e]">
                Authorize API Requests
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Requests made in the interactive test console will include this key in the <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">X-Api-Key</code> header.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                API Key (Value)
              </label>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="pk_live_1800cb88..."
                className="w-full h-10 px-3.5 font-mono text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Save Key</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
