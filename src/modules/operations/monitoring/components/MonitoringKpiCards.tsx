import type { MonitoringOverview } from "../types"

interface MonitoringKpiCardsProps {
  overview: MonitoringOverview
}

export function MonitoringKpiCards({ overview }: MonitoringKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* OVERALL */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs min-h-[110px] flex flex-col justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          OVERALL
        </span>
        <div className="my-1">
          <span className="text-2xl font-bold text-slate-800">
            {overview.overallStatus}
          </span>
        </div>
        <span className="text-xs text-slate-500">
          {overview.openAlerts} open alerts
        </span>
      </div>

      {/* LAST 15 MIN */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs min-h-[110px] flex flex-col justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          LAST 15 MIN
        </span>
        <div className="my-1">
          <span className="text-2xl font-bold text-slate-800">
            {overview.last15MinTotal}
          </span>
        </div>
        <span className="text-xs text-slate-500">
          delivered {overview.last15MinDelivered} · failed {overview.last15MinFailed}
        </span>
      </div>

      {/* SMS.SUBMIT */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs min-h-[110px] flex flex-col justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          SMS.SUBMIT
        </span>
        <div className="my-1">
          <span className="text-2xl font-bold text-slate-800">
            {overview.smsSubmitQueue}
          </span>
        </div>
        <div className="h-4" />
      </div>

      {/* SIDE QUEUES */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs min-h-[110px] flex flex-col justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          SIDE QUEUES
        </span>
        <div className="my-1">
          <span className="text-sm sm:text-base font-semibold text-slate-800">
            DLR {overview.sideQueues.dlr} · WH {overview.sideQueues.wh} · IN {overview.sideQueues.in}
          </span>
        </div>
        <div className="h-4" />
      </div>
    </div>
  )
}
