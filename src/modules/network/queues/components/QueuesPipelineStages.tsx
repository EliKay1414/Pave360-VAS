import * as React from "react"
import type { PipelineStage } from "../types"

interface QueuesPipelineStagesProps {
  stages: PipelineStage[]
  isLoading: boolean
}

export const QueuesPipelineStages: React.FC<QueuesPipelineStagesProps> = ({ stages, isLoading }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          MESSAGE LIFECYCLE PIPELINE BREAKDOWN
        </span>
        <span className="text-xs font-medium text-slate-500">Live Stages</span>
      </div>

      {/* 5-Column Lifecycle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={`stage-skel-${idx}`}
                className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between border-t-[3px] border-t-slate-200 animate-pulse min-h-[96px]"
              >
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-6 w-12 bg-slate-200 rounded my-1.5" />
                <div className="h-3 w-28 bg-slate-200 rounded" />
              </div>
            ))
          : stages.map((stage) => {
              const borderTopClass =
                stage.color === "emerald"
                  ? "border-t-emerald-500"
                  : stage.color === "red"
                  ? "border-t-rose-500"
                  : stage.color === "indigo"
                  ? "border-t-indigo-500"
                  : stage.color === "blue"
                  ? "border-t-blue-500"
                  : "border-t-slate-400"

              const titleColorClass =
                stage.color === "emerald"
                  ? "text-emerald-600"
                  : stage.color === "red"
                  ? "text-rose-600"
                  : stage.color === "indigo"
                  ? "text-indigo-600"
                  : stage.color === "blue"
                  ? "text-blue-600"
                  : "text-slate-500"

              return (
                <div
                  key={stage.id}
                  className={`p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between border-t-[3px] ${borderTopClass}`}
                >
                  <span className={`text-[11px] font-bold tracking-wider uppercase ${titleColorClass}`}>
                    {stage.name}
                  </span>

                  <div className="text-2xl font-bold font-mono text-slate-900 mt-2 mb-1">
                    {stage.count}
                  </div>

                  <p className="text-xs text-slate-500 leading-snug">
                    {stage.description}
                  </p>
                </div>
              )
            })}
      </div>
    </div>
  )
}
