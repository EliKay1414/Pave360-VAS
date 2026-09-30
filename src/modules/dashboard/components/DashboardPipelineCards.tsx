import * as React from "react"
import { Send, CheckCircle2, XCircle, Clock } from "lucide-react"
import type { VasMetricData } from "../types"

interface DashboardPipelineCardsProps {
  data: VasMetricData
}

export function DashboardPipelineCards({ data }: DashboardPipelineCardsProps) {
  return (
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
  )
}
