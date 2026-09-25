import * as React from "react"
import { Copy, Check, X } from "lucide-react"
import type { ApiLogRecord } from "../types"
import {
  formatGmtTimestamp,
  getSanitizedRequestHeaders,
  getResponseHeaders,
  getCurlCommand,
} from "../types"

interface LogInspectDrawerProps {
  log: ApiLogRecord | null
  onClose: () => void
}

export function LogInspectDrawer({ log, onClose }: LogInspectDrawerProps) {
  const [drawerTab, setDrawerTab] = React.useState<
    "Overview" | "Request Payload" | "Response Body" | "Headers"
  >("Overview")
  const [copiedCurl, setCopiedCurl] = React.useState(false)
  const [copiedReqPayload, setCopiedReqPayload] = React.useState(false)
  const [copiedResPayload, setCopiedResPayload] = React.useState(false)

  // Reset tab when new log is opened
  React.useEffect(() => {
    if (log) {
      setDrawerTab("Overview")
      setCopiedCurl(false)
      setCopiedReqPayload(false)
      setCopiedResPayload(false)
    }
  }, [log])

  if (!log) return null

  const handleCopyCurl = () => {
    const cmd = getCurlCommand(log)
    navigator.clipboard.writeText(cmd)
    setCopiedCurl(true)
    setTimeout(() => setCopiedCurl(false), 1500)
  }

  const handleCopyReqPayload = () => {
    navigator.clipboard.writeText(log.requestBody)
    setCopiedReqPayload(true)
    setTimeout(() => setCopiedReqPayload(false), 1500)
  }

  const handleCopyResPayload = () => {
    navigator.clipboard.writeText(log.responseBody)
    setCopiedResPayload(true)
    setTimeout(() => setCopiedResPayload(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200 cursor-pointer"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-145 sm:max-w-155 bg-white shadow-2xl border-l border-slate-200/90 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Top Header */}
          <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-block px-2.5 py-0.5 font-mono text-xs font-semibold rounded-md ${
                    log.status >= 200 && log.status < 300
                      ? "bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]"
                      : "bg-[#fffbeb] text-[#b45309] border border-[#fde68a]"
                  }`}
                >
                  {log.status}
                </span>
                <span className="inline-block px-2 py-0.5 font-mono text-[11px] font-bold rounded bg-[#eefaf3] text-[#059669]">
                  {log.method}
                </span>
                <span className="font-mono text-base font-bold text-[#0c1a2e]">
                  {log.path}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Duration: {log.duration} ms · Timestamp: {formatGmtTimestamp(log.timestamp)}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Copy cURL Button */}
              <button
                type="button"
                onClick={handleCopyCurl}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                {copiedCurl ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Drawer Tabs */}
          <div className="px-6 border-b border-slate-200 flex items-center gap-6 sm:gap-7 shrink-0 bg-white">
            {(["Overview", "Request Payload", "Response Body", "Headers"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDrawerTab(tab)}
                  className={`py-3 text-[13px] font-semibold transition-colors cursor-pointer relative ${
                    drawerTab === tab
                      ? "text-[#0070f3] border-b-2 border-[#0070f3]"
                      : "text-slate-500 hover:text-slate-800 font-medium"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Drawer Content Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {/* 1. OVERVIEW TAB */}
            {drawerTab === "Overview" && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                {/* 2x2 Grid of Meta Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Client IP Address */}
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5">
                    <span className="text-[11.5px] font-semibold text-slate-400 block mb-1">
                      Client IP Address
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {log.clientIp}
                    </span>
                  </div>

                  {/* API Key Prefix */}
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5">
                    <span className="text-[11.5px] font-semibold text-slate-400 block mb-1">
                      API Key Prefix
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {log.apiKey}
                    </span>
                  </div>

                  {/* Tenant Account */}
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5">
                    <span className="text-[11.5px] font-semibold text-slate-400 block mb-1">
                      Tenant Account
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {log.tenant}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5">
                    <span className="text-[11.5px] font-semibold text-slate-400 block mb-1">
                      Duration
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {log.duration} ms
                    </span>
                  </div>
                </div>

                {/* User Agent */}
                <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5">
                  <span className="text-[11.5px] font-semibold text-slate-400 block mb-1">
                    User Agent
                  </span>
                  <span className="font-mono text-xs text-slate-700">
                    {log.userAgent}
                  </span>
                </div>

                {/* cURL Equivalent */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700">
                    cURL Equivalent
                  </span>
                  <div className="bg-[#0c1322] rounded-xl p-4 overflow-x-auto border border-slate-800">
                    <pre className="font-mono text-xs leading-relaxed text-slate-200 select-text">
                      <span className="text-[#38bdf8]">curl</span> -X{" "}
                      <span className="text-[#34d399]">{log.method}</span>{" "}
                      <span className="text-[#fde047]">
                        &quot;https://vas.pave360.com{log.path}&quot;
                      </span>{" "}
                      \<br />
                      {"  "}-H{" "}
                      <span className="text-[#fde047]">
                        &quot;Content-Type: application/json&quot;
                      </span>{" "}
                      \<br />
                      {"  "}-H{" "}
                      <span className="text-[#fde047]">
                        &quot;X-Api-Key: {log.apiKey}&quot;
                      </span>{" "}
                      \<br />
                      {"  "}-d{" "}
                      <span className="text-[#cbd5e1]">
                        &quot;{log.requestBody.replace(/\s+/g, " ").replace(/"/g, '\\"')}&quot;
                      </span>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* 2. REQUEST PAYLOAD TAB */}
            {drawerTab === "Request Payload" && (
              <div className="space-y-2.5 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    JSON Request Payload
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReqPayload}
                    className="px-2.5 py-1 text-xs border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedReqPayload ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#0c1322] rounded-xl p-4 overflow-x-auto border border-slate-800">
                  <pre className="font-mono text-xs leading-relaxed text-[#38bdf8] select-text">
                    {log.requestBody}
                  </pre>
                </div>
              </div>
            )}

            {/* 3. RESPONSE BODY TAB */}
            {drawerTab === "Response Body" && (
              <div className="space-y-2.5 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    JSON Response Body
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyResPayload}
                    className="px-2.5 py-1 text-xs border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedResPayload ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#0c1322] rounded-xl p-4 overflow-x-auto border border-slate-800">
                  <pre className="font-mono text-xs leading-relaxed text-[#34d399] select-text">
                    {log.responseBody}
                  </pre>
                </div>
              </div>
            )}

            {/* 4. HEADERS TAB matching media_1790354734617.png & media_1790354740679.png */}
            {drawerTab === "Headers" && (
              <div className="space-y-6 animate-in fade-in-50 duration-150">
                <div>
                  <h4 className="text-[13px] font-bold text-slate-700 mb-2.5">
                    Request Headers (Sanitized)
                  </h4>
                  <div className="bg-[#0b1329] rounded-xl p-5 overflow-x-auto border border-slate-800">
                    <pre className="font-mono text-xs leading-relaxed text-slate-100 select-text whitespace-pre">
                      {getSanitizedRequestHeaders(log)}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-[13px] font-bold text-slate-700 mb-2.5">
                    Response Headers
                  </h4>
                  <div className="bg-[#0b1329] rounded-xl p-5 overflow-x-auto border border-slate-800">
                    <pre className="font-mono text-xs leading-relaxed text-slate-100 select-text whitespace-pre">
                      {getResponseHeaders(log)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
