import * as React from "react"
import { MessageSquare, BarChart2, Clock, User } from "lucide-react"
import type { VasMetricData } from "../types"

interface DashboardOverviewCardsProps {
  data: VasMetricData
}

export function DashboardOverviewCards({ data }: DashboardOverviewCardsProps) {
  return (
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
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-extrabold text-[#0c1a2e] leading-none mb-3">
              {data.deliveryRate}%
            </div>
            <span className="text-xs text-[#7c8ea2] font-medium">
              Delivered / submitted
            </span>
          </div>
          {/* Radial mini gauge */}
          <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
            <svg className="h-10 w-10 transform -rotate-90" viewBox="0 0 36 36">
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
  )
}
