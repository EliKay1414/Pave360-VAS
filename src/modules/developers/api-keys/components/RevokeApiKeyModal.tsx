import { X } from "lucide-react"
import type { ApiKeyRecord } from "../types"

interface RevokeApiKeyModalProps {
  apiKey: ApiKeyRecord | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (keyId: string) => void
}

export function RevokeApiKeyModal({
  apiKey,
  isOpen,
  onClose,
  onConfirm,
}: RevokeApiKeyModalProps) {
  if (!isOpen || !apiKey) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden relative z-10 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Header matching media_1790356242217.png */}
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0c1a2e]">
              Revoke API key
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body matching screenshot */}
          <div className="p-6">
            <p className="text-xs text-slate-600 leading-relaxed">
              Revoke this API key? It cannot be used again and the secret cannot be recovered.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onConfirm(apiKey.id)}
              className="px-5 py-2 bg-[#c53030] hover:bg-[#b91c1c] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
