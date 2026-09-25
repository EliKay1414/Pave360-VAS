import type { AlertRule } from "../types"

interface RulesTableProps {
  rules: AlertRule[]
}

export function RulesTable({ rules }: RulesTableProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Critical
          </span>
        )
      case "warning":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Warning
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {severity}
          </span>
        )
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          RULES
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-t border-b border-slate-200/80 bg-slate-50/50">
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                NAME
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TYPE
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                THRESHOLD
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                SEVERITY
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ENABLED
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rules.map((rule) => (
              <tr
                key={rule.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-3.5 px-6 text-sm font-semibold text-slate-800">
                  {rule.name}
                </td>
                <td className="py-3.5 px-6 text-sm text-slate-700">
                  {rule.type}
                </td>
                <td className="py-3.5 px-6 text-sm text-slate-600 font-mono">
                  {rule.threshold}
                </td>
                <td className="py-3.5 px-6 text-sm">
                  {getSeverityBadge(rule.severity)}
                </td>
                <td className="py-3.5 px-6 text-sm text-slate-700">
                  {rule.enabled}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
