import * as React from "react"
import { Copy, Check, ShieldAlert, X } from "lucide-react"

interface SecretRevealModalProps {
  secretKey: string | null
  keyName: string
  isOpen: boolean
  onClose: () => void
}

export function SecretRevealModal({
  secretKey,
  keyName,
  isOpen,
  onClose,
}: SecretRevealModalProps) {
  const [copied, setCopied] = React.useState(false)

  if (!isOpen || !secretKey) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(secretKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            <div className="flex items-center gap-2 text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <h3 className="text-base font-bold text-[#0c1a2e]">
                API Key Generated
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

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Warning Alert */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold block mb-0.5">
                  Save your secret key now!
                </span>
                For security reasons, this secret is displayed only once. You will not be able to retrieve it after closing this modal.
              </div>
            </div>

            {/* Key Name & Secret */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Secret Key for &quot;{keyName}&quot;
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={secretKey}
                  className="flex-1 h-10 px-3.5 font-mono text-xs rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-10 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              I have saved my secret key
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
