import type { ApiKeyRecord } from "../types"

interface ApiKeysTableProps {
  apiKeys: ApiKeyRecord[]
  onRevokeClick: (key: ApiKeyRecord) => void
}

export function ApiKeysTable({ apiKeys, onRevokeClick }: ApiKeysTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                NAME
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                PREFIX
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                SCOPES
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                MODE
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                LAST USED
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {apiKeys.length > 0 ? (
              apiKeys.map((key) => {
                const isActive = key.status === "Active"
                const scopesText = Array.isArray(key.scopes)
                  ? key.scopes.join(",")
                  : key.scopes

                return (
                  <tr
                    key={key.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* NAME */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-[#0c1a2e] text-xs">
                        {key.name}
                      </span>
                    </td>

                    {/* PREFIX */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                      {key.prefix}
                    </td>

                    {/* SCOPES */}
                    <td className="px-6 py-4 max-w-70 sm:max-w-85">
                      <div className="font-mono text-[11.5px] text-slate-500 truncate" title={scopesText}>
                        {scopesText}
                      </div>
                    </td>

                    {/* MODE */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-800">
                      {key.mode}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                          Revoked
                        </span>
                      )}
                    </td>

                    {/* LAST USED */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                      {key.lastUsed}
                    </td>

                    {/* ACTION: Revoke */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {isActive ? (
                        <button
                          type="button"
                          onClick={() => onRevokeClick(key)}
                          className="text-[#dc2626] hover:underline text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-normal">
                          Revoked
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-16 text-center text-xs text-slate-500 font-normal"
                >
                  No API keys found. Click &quot;Create API key&quot; to generate one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
