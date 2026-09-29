import * as React from "react"
import type { RouteRule } from "../types"

interface DeleteRouteModalProps {
  target: RouteRule | null
  onClose: () => void
  onConfirm: (route: RouteRule) => void
  isDeleting?: boolean
}

export const DeleteRouteModal: React.FC<DeleteRouteModalProps> = ({
  target,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!target) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col items-center text-center space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">
          !
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Delete Route Rule</h3>
          <p className="text-xs text-slate-600 mt-1">
            Are you sure you want to delete rule <span className="font-semibold">{target.name}</span>?
          </p>
        </div>
        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(target)}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}
