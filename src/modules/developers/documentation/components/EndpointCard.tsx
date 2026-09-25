import * as React from "react"
import {
  ChevronDown,
  Copy,
  Check,
  Play,
  RotateCcw,
  Code2,
} from "lucide-react"
import type { ApiEndpoint } from "../types"

interface EndpointCardProps {
  endpoint: ApiEndpoint
  apiKey: string
}

export function EndpointCard({ endpoint, apiKey }: EndpointCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isTesting, setIsTesting] = React.useState(false)
  const [requestBodyInput, setRequestBodyInput] = React.useState(
    endpoint.requestBodyExample || ""
  )
  const [testResult, setTestResult] = React.useState<{
    status: number
    body: string
    duration: number
  } | null>(null)
  const [activeCodeLang, setActiveCodeLang] = React.useState<
    "cURL" | "Node.js" | "Python" | "C#"
  >("cURL")
  const [copiedCode, setCopiedCode] = React.useState(false)

  // Color theme based on HTTP Method
  const methodColors = {
    POST: {
      badge: "bg-[#eefaf3] text-[#059669] border-[#a7f3d0]",
      border: "border-emerald-200/80 hover:border-emerald-300",
      bgHeader: "hover:bg-emerald-50/20",
    },
    GET: {
      badge: "bg-[#eff6ff] text-[#0070f3] border-[#bfdbfe]",
      border: "border-blue-200/80 hover:border-blue-300",
      bgHeader: "hover:bg-blue-50/20",
    },
    DELETE: {
      badge: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
      border: "border-red-200/80 hover:border-red-300",
      bgHeader: "hover:bg-red-50/20",
    },
    PUT: {
      badge: "bg-[#fffbeb] text-[#d97706] border-[#fde68a]",
      border: "border-amber-200/80 hover:border-amber-300",
      bgHeader: "hover:bg-amber-50/20",
    },
  }[endpoint.method] || {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    border: "border-slate-200 hover:border-slate-300",
    bgHeader: "hover:bg-slate-50",
  }

  // Generate code snippet in selected language
  const codeSnippet = React.useMemo(() => {
    const compactBody = requestBodyInput.replace(/\s+/g, " ")
    const effectiveKey = apiKey || "pk_live_1800cb88..."
    const fullUrl = `https://vas.pave360.com${endpoint.path}`

    switch (activeCodeLang) {
      case "cURL":
        if (endpoint.method === "GET" || endpoint.method === "DELETE") {
          return `curl -X ${endpoint.method} "${fullUrl}" \\\n  -H "X-Api-Key: ${effectiveKey}"`
        }
        return `curl -X ${endpoint.method} "${fullUrl}" \\\n  -H "Content-Type: application/json" \\\n  -H "X-Api-Key: ${effectiveKey}" \\\n  -d '${compactBody}'`

      case "Node.js":
        return `const response = await fetch("${fullUrl}", {\n  method: "${endpoint.method}",\n  headers: {\n    "Content-Type": "application/json",\n    "X-Api-Key": "${effectiveKey}",\n  },\n  ${
          endpoint.method !== "GET"
            ? `body: JSON.stringify(${requestBodyInput.trim() || "{}"}),\n`
            : ""
        }});\n\nconst data = await response.json();\nconsole.log(data);`

      case "Python":
        return `import requests\n\nurl = "${fullUrl}"\nheaders = {\n    "X-Api-Key": "${effectiveKey}",\n    "Content-Type": "application/json"\n}\n${
          endpoint.method !== "GET"
            ? `payload = ${requestBodyInput.trim() || "{}"}\n\nresponse = requests.${endpoint.method.toLowerCase()}(url, json=payload, headers=headers)\n`
            : `\nresponse = requests.${endpoint.method.toLowerCase()}(url, headers=headers)\n`
        }print(response.json())`

      case "C#":
        return `using var client = new HttpClient();\nclient.DefaultRequestHeaders.Add("X-Api-Key", "${effectiveKey}");\n\nvar response = await client.${
          endpoint.method === "GET"
            ? `GetAsync("${fullUrl}")`
            : `PostAsJsonAsync("${fullUrl}", payload)`
        };\nvar content = await response.Content.ReadAsStringAsync();\nConsole.WriteLine(content);`

      default:
        return ""
    }
  }, [endpoint, apiKey, requestBodyInput, activeCodeLang])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 1500)
  }

  // Simulate API Execution
  const handleExecute = () => {
    setIsTesting(true)
    setTimeout(() => {
      setIsTesting(false)
      const successResp = endpoint.responses[0]
      setTestResult({
        status: successResp.status,
        body: successResp.exampleBody || "{}",
        duration: Math.floor(Math.random() * 80) + 25,
      })
    }, 450)
  }

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-150 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${methodColors.border}`}
    >
      {/* Header Bar (Click to expand) */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`w-full text-left px-5 py-4 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${methodColors.bgHeader}`}
      >
        <div className="flex items-center gap-3.5 flex-wrap min-w-0">
          {/* Method Badge */}
          <span
            className={`px-3 py-1 font-mono text-xs font-bold rounded-lg border shadow-2xs ${methodColors.badge}`}
          >
            {endpoint.method}
          </span>

          {/* Path */}
          <span className="font-mono text-xs sm:text-[13px] font-bold text-[#0c1a2e]">
            {endpoint.path}
          </span>

          {/* Summary */}
          <span className="text-xs text-slate-500 font-normal truncate max-w-md hidden sm:inline">
            — {endpoint.summary}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {endpoint.tag}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180 text-slate-700" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-100 space-y-6 animate-in fade-in-50 duration-150 bg-slate-50/30">
          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Description
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {endpoint.description}
            </p>
          </div>

          {/* Parameters */}
          {endpoint.parameters.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Parameters &amp; Headers
              </h4>
              <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">In</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Required</th>
                      <th className="px-4 py-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {endpoint.parameters.map((param) => (
                      <tr key={param.name}>
                        <td className="px-4 py-3 font-mono font-bold text-[#0c1a2e]">
                          {param.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500">
                          {param.in}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500">
                          {param.type}
                        </td>
                        <td className="px-4 py-3">
                          {param.required ? (
                            <span className="text-red-600 font-bold">required</span>
                          ) : (
                            <span className="text-slate-400">optional</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {param.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Body & Testing Console */}
          {endpoint.requestBodyExample && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Request Body (application/json)
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    setRequestBodyInput(endpoint.requestBodyExample || "")
                  }
                  className="text-xs text-[#0070f3] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset payload</span>
                </button>
              </div>

              <textarea
                rows={7}
                value={requestBodyInput}
                onChange={(e) => setRequestBodyInput(e.target.value)}
                className="w-full p-4 font-mono text-xs rounded-xl bg-[#0c1322] text-[#38bdf8] border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed shadow-inner"
              />
            </div>
          )}

          {/* Code Snippets Generator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-slate-500" />
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Example Code Snippet
                </h4>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                {(["cURL", "Node.js", "Python", "C#"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveCodeLang(lang)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                      activeCodeLang === lang
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative bg-[#0c1322] rounded-xl p-4 border border-slate-800">
              <pre className="font-mono text-xs leading-relaxed text-slate-200 select-text overflow-x-auto whitespace-pre">
                {codeSnippet}
              </pre>
              <button
                type="button"
                onClick={handleCopyCode}
                className="absolute right-3 top-3 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-md shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Test / Execute Action */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleExecute}
              disabled={isTesting}
              className="px-5 py-2.5 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Play className={`h-3.5 w-3.5 ${isTesting ? "animate-spin" : ""}`} />
              <span>{isTesting ? "Executing Request..." : "Try it out (Execute)"}</span>
            </button>
          </div>

          {/* Test Result Display */}
          {testResult && (
            <div className="space-y-2 pt-2 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">
                    Response Output
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      testResult.status >= 200 && testResult.status < 300
                        ? "bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {testResult.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {testResult.duration} ms
                  </span>
                </div>
              </div>

              <div className="bg-[#0c1322] rounded-xl p-4 overflow-x-auto border border-slate-800">
                <pre className="font-mono text-xs leading-relaxed text-[#34d399] select-text">
                  {testResult.body}
                </pre>
              </div>
            </div>
          )}

          {/* Responses Documentation */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Documented Responses
            </h4>
            <div className="space-y-2.5">
              {endpoint.responses.map((resp) => (
                <div
                  key={resp.status}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold ${
                        resp.status >= 200 && resp.status < 300
                          ? "bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {resp.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {resp.description}
                    </span>
                  </div>

                  {resp.exampleBody && (
                    <div className="bg-[#0c1322] rounded-lg p-3 overflow-x-auto border border-slate-800">
                      <pre className="font-mono text-[11.5px] leading-relaxed text-[#cbd5e1] select-text">
                        {resp.exampleBody}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
