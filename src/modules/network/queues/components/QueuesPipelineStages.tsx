import * as React from "react"
import type { PipelineStage } from "../types"

interface QueuesPipelineStagesProps {
  stages: PipelineStage[]
  isLoading: boolean
}

export const QueuesPipelineStages: React.FC<QueuesPipelineStagesProps> = ({ stages, isLoading }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Dispatch Pipeline Stages</h3>
          <p className="text-xs text-slate-500">Live transaction lifecycle transitions across worker processors</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          5 Stages
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-2 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                {stage.name}
              </span>
              <span
                className={`h-2 w-2 rounded-full ${
                  stage.color === "emerald"
                    ? "bg-emerald-500"
                    : stage.color === "red"
                    ? "bg-red-500"
                    : stage.color === "indigo"
                    ? "bg-indigo-500"
                    : stage.color === "blue"
                    ? "bg-blue-500"
                    : "bg-slate-400"
                }`}
              />
            </div>

            <div>
              {isLoading ? (
                <div className="h-6 w-12 bg-slate-200 rounded animate-pulse" />
              ) : (
                <div className="text-xl font-bold font-mono text-slate-900">{stage.count}</div>
              )}
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{stage.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
