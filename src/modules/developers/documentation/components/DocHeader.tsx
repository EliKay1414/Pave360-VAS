import * as React from "react"
import { Key, Copy, Check, ExternalLink } from "lucide-react"
import { API_BASE_URL } from "../apiSpec"

interface DocHeaderProps {
  apiKey: string
  onAuthorizeClick: () => void
}

export function DocHeader({ apiKey, onAuthorizeClick }: DocHeaderProps) {
  const [copiedUrl, setCopiedUrl] = React.useState(false)

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(API_BASE_URL)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 1500)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg font-bold text-[#0c1a2e] tracking-tight">
              Pave360 VAS API Documentation &amp; Swagger
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
              OAS 3.0.3
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
              v1.0.0
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Standard HTTP/REST endpoints for Outbound SMS dispatch, Inbound MO routing, USSD session dialogs, Sender IDs, and Webhook deliveries.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 pt-1">
            <span className="font-semibold text-slate-400">Base URL:</span>
            <code className="bg-slate-100 px-2 py-0.5 rounded text-[#0c1a2e]">
              {API_BASE_URL}
            </code>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Copy Base URL"
            >
              {copiedUrl ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onAuthorizeClick}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              apiKey
                ? "bg-[#eefaf3] border border-[#a7f3d0] text-[#059669] hover:bg-[#d1fae5]"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Key className="h-3.5 w-3.5 text-amber-500" />
            <span>{apiKey ? "Authorized (Key Set)" : "Authorize"}</span>
          </button>

          <a
            href="/developers/logs"
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Live Logs</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  )
}
