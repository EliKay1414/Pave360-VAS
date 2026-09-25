import type { CarrierTelemetryRecord } from "../types"

interface CarrierTelemetryViewProps {
  data: CarrierTelemetryRecord[]
}

export function CarrierTelemetryView({ data }: CarrierTelemetryViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-150">
      {/* 5 Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Outbound SMS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500 block">
            Total Outbound SMS
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
              23
            </span>
          </div>
          <span className="text-xs font-normal text-slate-500">
            Submitted in window
          </span>
        </div>

        {/* Card 2: Delivered */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500 block">
            Delivered
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-[26px] font-bold text-[#059669] tracking-tight">
              16
            </span>
          </div>
          <span className="text-xs font-semibold text-[#059669]">
            69.6% success rate
          </span>
        </div>

        {/* Card 3: Failed / Undelivered */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500 block">
            Failed / Undelivered
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-[26px] font-bold text-[#dc2626] tracking-tight">
              7
            </span>
          </div>
          <span className="text-xs font-normal text-slate-500">
            Terminal carrier errors
          </span>
        </div>

        {/* Card 4: Inbound MO */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500 block">
            Inbound MO
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-[26px] font-bold text-[#2563eb] tracking-tight">
              1
            </span>
          </div>
          <span className="text-xs font-normal text-slate-500">
            Incoming mobile replies
          </span>
        </div>

        {/* Card 5: USSD Sessions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500 block">
            USSD Sessions
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-[26px] font-bold text-[#d97706] tracking-tight">
              0
            </span>
          </div>
          <span className="text-xs font-normal text-slate-500">
            Interactive menus
          </span>
        </div>
      </div>

      {/* Section: CARRIER BENCHMARK & INTERCONNECT TELEMETRY */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-bold text-slate-900 tracking-wider uppercase">
            CARRIER BENCHMARK &amp; INTERCONNECT TELEMETRY
          </h2>
          <span className="text-xs text-slate-500 font-normal">
            {data.length} network(s)
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-white">
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                    CARRIER NETWORK
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                    CODE
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                    TOTAL TRAFFIC
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                    DELIVERED
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                    FAILED
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                    DELIVERY SUCCESS RATE
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                    AVG LATENCY
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row) => (
                  <tr
                    key={row.network}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Carrier Network */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-[#0c1a2e]">
                      {row.network}
                    </td>

                    {/* Code */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-500">
                      {row.code}
                    </td>

                    {/* Total Traffic */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-800">
                      {row.totalTraffic}
                    </td>

                    {/* Delivered */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-[#059669]">
                      {row.delivered}
                    </td>

                    {/* Failed */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-[#dc2626]">
                      {row.failed}
                    </td>

                    {/* Delivery Success Rate with progress bar */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-28 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.successRate > 0
                                ? "bg-[#059669]"
                                : "bg-transparent"
                            }`}
                            style={{ width: `${row.successRate}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            row.successRate > 0
                              ? "text-[#059669]"
                              : "text-[#dc2626]"
                          }`}
                        >
                          {row.successRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* Avg Latency */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                      {row.avgLatency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
