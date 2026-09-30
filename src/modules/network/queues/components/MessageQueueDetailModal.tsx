import * as React from "react"
import type { QueueTransaction } from "../types"

interface MessageQueueDetailModalProps {
  message: QueueTransaction | null
  onClose: () => void
}

export function MessageQueueDetailModal({ message, onClose }: MessageQueueDetailModalProps) {
  if (!message) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Message Queue Details</h3>
        <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
          <div>
            <span className="font-semibold text-slate-700">Message ID:</span>{" "}
            <span className="font-mono text-[#0070f3]">{message.id}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Sender:</span>{" "}
            <span className="font-medium text-slate-900">{message.sender}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Destination:</span>{" "}
            <span className="font-mono text-slate-800">{message.destination}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Encoding:</span>{" "}
            <span className="text-slate-800">{message.encoding}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Segments:</span>{" "}
            <span className="text-slate-800">{message.segments}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Status:</span>{" "}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
              {message.status}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Created:</span>{" "}
            <span className="font-mono text-slate-600">{message.created}</span>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
