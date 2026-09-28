import * as React from "react"
import {
  MessageSquare,
  BarChart2,
  Clock,
  User,
  Send,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Wifi,
} from "lucide-react"

export interface VasMetricData {
  messagesToday: number
  avgLatency: string
  messagesThisMonth: number
  deliveryRate: number
  currentTps: number
  submitted: number
  delivered: number
  failed: number
  pendingQueue: number
  queueDepth: number
  platform: {
    tenantsTotal: number
    tenantsActive: number
    usersTotal: number
    usersActive: number
    tenantsThisMonth: number
    activeCarriers: number
  }
  carrierConnections: Array<{
    id: string
    name: string
    status: "Connected" | "Disconnected" | "Connecting"
  }>
  recentAuditActivity: Array<{
    id: string
    when: string
    action: string
    entity: string
    summary: string
    user: string
  }>
}

import { useDashboardAnalytics } from "../../shared/hooks/useDashboardAnalytics"

interface VasDashboardViewProps {
  initialData?: VasMetricData
}

export function VasDashboardView({ initialData }: VasDashboardViewProps) {
  const { data: liveData, isLive, isFetching, refetch } = useDashboardAnalytics()
  const data = initialData || liveData

  return (
    <div className="space-y-5 font-sans select-none">
      {/* Telemetry Status Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLive ? "bg-emerald-400" : "bg-sky-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLive ? "bg-emerald-500" : "bg-sky-500"
              }`}
            />
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {isLive ? "Live Gateway Telemetry · Connected" : "Local Telemetry Cache"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Refresh metrics from VAS Gateway"
        >
          <span className={isFetching ? "inline-block animate-spin" : ""}>↻</span>
          <span>{isFetching ? "Updating..." : "Refresh"}</span>
        </button>
      </div>

      {/* 1. Row 1: Four Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: MESSAGES TODAY */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-35">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
              MESSAGES TODAY
            </span>
            <div className="h-9 w-9 rounded-full bg-[#edf6ff] flex items-center justify-center text-[#2563eb] shrink-0">
              <MessageSquare className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#0c1a2e] leading-none mb-3">
              {data.messagesToday}
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xs text-[#7c8ea2] font-medium">
                Avg delivery latency:{" "}
                <span className="font-bold text-[#0c1a2e]">
                  {data.avgLatency}
                </span>
              </span>
              {/* Mini Spark Bars */}
              <div className="flex items-end gap-1 pb-0.5">
                <span className="w-1.5 h-2 rounded-t-xs bg-[#7dd3fc]" />
                <span className="w-1.5 h-3.5 rounded-t-xs bg-[#38bdf8]" />
                <span className="w-1.5 h-5 rounded-t-xs bg-[#0284c7]" />
                <span className="w-1.5 h-4 rounded-t-xs bg-[#38bdf8]" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: MESSAGES THIS MONTH */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-35">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
              MESSAGES THIS MONTH
            </span>
            <div className="h-9 w-9 rounded-full bg-[#edf6ff] flex items-center justify-center text-[#2563eb] shrink-0">
              <BarChart2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#0c1a2e] leading-none mb-3">
              {data.messagesThisMonth}
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xs text-[#7c8ea2] font-medium">
                Calendar month to date
              </span>
              {/* Mini Spark Bars */}
              <div className="flex items-end gap-1 pb-0.5">
                <span className="w-1.5 h-1.5 rounded-t-xs bg-[#7dd3fc]" />
                <span className="w-1.5 h-3 rounded-t-xs bg-[#38bdf8]" />
                <span className="w-1.5 h-4.5 rounded-t-xs bg-[#0284c7]" />
                <span className="w-1.5 h-6 rounded-t-xs bg-[#38bdf8]" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: DELIVERY RATE */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-35">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
              DELIVERY RATE
            </span>
            <div className="h-9 w-9 rounded-full bg-[#edf6ff] flex items-center justify-center text-[#2563eb] shrink-0">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#0c1a2e] leading-none mb-3">
              {data.deliveryRate}%
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xs text-[#7c8ea2] font-medium">
                Delivered / submitted
              </span>
              {/* Mini Circular Gauge Indicator */}
              <div className="relative h-6 w-6 flex items-center justify-center">
                <svg className="h-6 w-6 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#38bdf8]"
                    strokeDasharray={`${data.deliveryRate || 4}, 100`}
                    strokeLinecap="round"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: CURRENT TPS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-35">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
              CURRENT TPS
            </span>
            <div className="h-9 w-9 rounded-full bg-[#edf6ff] flex items-center justify-center text-[#2563eb] shrink-0">
              <User className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#0c1a2e] leading-none mb-3">
              {data.currentTps}
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xs text-[#7c8ea2] font-medium">
                Messages created in last 60s
              </span>
              {/* Mini Spark Bars */}
              <div className="flex items-end gap-1 pb-0.5">
                <span className="w-1.5 h-1.5 rounded-t-xs bg-[#7dd3fc]" />
                <span className="w-1.5 h-3.5 rounded-t-xs bg-[#38bdf8]" />
                <span className="w-1.5 h-5 rounded-t-xs bg-[#0284c7]" />
                <span className="w-1.5 h-3 rounded-t-xs bg-[#38bdf8]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Row 2: Four Mini Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SUBMITTED */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-[#edf6ff] flex items-center justify-center text-[#2563eb] shrink-0">
            <Send className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
              SUBMITTED
            </span>
            <span className="block text-2xl font-bold text-[#0c1a2e] leading-tight mt-0.5">
              {data.submitted}
            </span>
          </div>
        </div>

        {/* DELIVERED */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-[#edf6ff] flex items-center justify-center text-[#2563eb] shrink-0">
            <CheckCircle2 className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
              DELIVERED
            </span>
            <span className="block text-2xl font-bold text-[#0c1a2e] leading-tight mt-0.5">
              {data.delivered}
            </span>
          </div>
        </div>

        {/* FAILED */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-[#edf6ff] flex items-center justify-center text-[#2563eb] shrink-0">
            <XCircle className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
              FAILED
            </span>
            <span className="block text-2xl font-bold text-[#0c1a2e] leading-tight mt-0.5">
              {data.failed}
            </span>
          </div>
        </div>

        {/* PENDING / QUEUE */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-[#edf6ff] flex items-center justify-center text-[#2563eb] shrink-0">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
              PENDING / QUEUE
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-[#0c1a2e] leading-tight">
                {data.pendingQueue}
              </span>
              <span className="text-xs text-[#7c8ea2] font-medium">
                Queue depth: {data.queueDepth}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Row 3: Platform Foundation (Left - Spans 3 cols to align under FAILED) & Carrier Connections (Right - Spans 1 col for vertical symmetry with PENDING/QUEUE & CURRENT TPS) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        {/* PLATFORM FOUNDATION (Span 3 - perfectly falls under FAILED card) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
            PLATFORM FOUNDATION
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-center">
            {/* Stat 1: Tenants */}
            <div>
              <div className="h-9 w-9 rounded-full bg-[#edf6ff] mx-auto flex items-center justify-center text-[#2563eb]">
                <Building2 className="h-4.5 w-4.5" />
              </div>
              <div className="text-2xl font-extrabold text-[#0c1a2e] mt-2">
                {data.platform.tenantsTotal}
              </div>
              <div className="text-xs text-[#7c8ea2] mt-1 font-medium">
                Tenants (
                <span className="font-bold text-[#0c1a2e]">
                  {data.platform.tenantsActive} active
                </span>
                )
              </div>
            </div>

            {/* Stat 2: Users */}
            <div>
              <div className="h-9 w-9 rounded-full bg-[#edf6ff] mx-auto flex items-center justify-center text-[#2563eb]">
                <User className="h-4.5 w-4.5" />
              </div>
              <div className="text-2xl font-extrabold text-[#0c1a2e] mt-2">
                {data.platform.usersTotal}
              </div>
              <div className="text-xs text-[#7c8ea2] mt-1 font-medium">
                Users (
                <span className="font-bold text-[#0c1a2e]">
                  {data.platform.usersActive} active
                </span>
                )
              </div>
            </div>

            {/* Stat 3: Tenants this month */}
            <div>
              <div className="h-9 w-9 rounded-full bg-[#edf6ff] mx-auto flex items-center justify-center text-[#2563eb]">
                <Calendar className="h-4.5 w-4.5" />
              </div>
              <div className="text-2xl font-extrabold text-[#0c1a2e] mt-2">
                {data.platform.tenantsThisMonth}
              </div>
              <div className="text-xs text-[#7c8ea2] mt-1 font-medium">
                Tenants this month
              </div>
            </div>

            {/* Stat 4: Active carriers */}
            <div>
              <div className="h-9 w-9 rounded-full bg-[#edf6ff] mx-auto flex items-center justify-center text-[#2563eb]">
                <Wifi className="h-4.5 w-4.5" />
              </div>
              <div className="text-2xl font-extrabold text-[#0c1a2e] mt-2">
                {data.platform.activeCarriers}
              </div>
              <div className="text-xs text-[#7c8ea2] mt-1 font-medium">
                Active carriers
              </div>
            </div>
          </div>
        </div>

        {/* CARRIER CONNECTIONS (Span 1 - in vertical symmetry with CURRENT TPS & PENDING/QUEUE) */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase mb-3">
            CARRIER CONNECTIONS
          </span>

          <div className="space-y-3 my-auto py-2">
            {data.carrierConnections.map((carrier) => (
              <div
                key={carrier.id}
                className="flex items-center justify-between gap-2"
              >
                <span className="font-bold text-[#0c1a2e] text-sm truncate" title={carrier.name}>
                  {carrier.name}
                </span>
                <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                  <span>{carrier.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Row 4: Recent Audit Activity Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <span className="block text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase mb-4">
          RECENT AUDIT ACTIVITY
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                <th className="pb-3 pr-4 font-bold">WHEN</th>
                <th className="pb-3 pr-4 font-bold">ACTION</th>
                <th className="pb-3 pr-4 font-bold">ENTITY</th>
                <th className="pb-3 pr-4 font-bold">SUMMARY</th>
                <th className="pb-3 font-bold">USER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-xs">
              {data.recentAuditActivity.map((audit) => (
                <tr
                  key={audit.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-3.5 pr-4 whitespace-nowrap text-[#64748b] font-medium">
                    {audit.when}
                  </td>
                  <td className="py-3.5 pr-4 whitespace-nowrap font-extrabold text-[#0c1a2e]">
                    {audit.action}
                  </td>
                  <td className="py-3.5 pr-4 whitespace-nowrap text-[#64748b] font-medium">
                    {audit.entity}
                  </td>
                  <td className="py-3.5 pr-4 text-[#475569] font-medium">
                    {audit.summary}
                  </td>
                  <td className="py-3.5 whitespace-nowrap text-[#64748b] font-medium">
                    {audit.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VasDashboardView
