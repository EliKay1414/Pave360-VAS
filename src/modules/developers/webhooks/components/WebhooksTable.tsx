import type { WebhookRecord } from "../types"

interface WebhooksTableProps {
  webhooks: WebhookRecord[]
  onDeleteClick?: (webhook: WebhookRecord) => void
}

export function WebhooksTable({ webhooks, onDeleteClick }: WebhooksTableProps) {
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
                URL
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                EVENT
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                SECRET
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                FAILURES
              </th>
              {webhooks.length > 0 && (
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {webhooks.length > 0 ? (
              webhooks.map((hook) => {
                const isEnabled = hook.enabled || hook.status === "Active"

                return (
                  <tr
                    key={hook.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* NAME */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-[#0c1a2e] text-xs">
                        {hook.name}
                      </span>
                    </td>

                    {/* URL */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600 max-w-70 truncate">
                      {hook.url}
                    </td>

                    {/* EVENT */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {hook.event}
                      </span>
                    </td>

                    {/* SECRET */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-400">
                      {hook.secret ? "••••••••••••" : "—"}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEnabled ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Disabled
                        </span>
                      )}
                    </td>

                    {/* FAILURES */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-700 font-semibold">
                      {hook.failures}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {onDeleteClick && (
                        <button
                          type="button"
                          onClick={() => onDeleteClick(hook)}
                          className="text-[#dc2626] hover:underline text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              /* Exact empty state matching media_1790356807987.png */
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-xs sm:text-sm text-slate-500 font-normal"
                >
                  No webhooks configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
