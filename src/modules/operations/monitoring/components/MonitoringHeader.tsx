interface MonitoringHeaderProps {
  onRawHealthClick: () => void
}

export function MonitoringHeader({ onRawHealthClick }: MonitoringHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
        System health, queues, carrier connections, and worker heartbeats.
      </p>

      <button
        type="button"
        onClick={onRawHealthClick}
        className="h-9.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
      >
        Raw /health
      </button>
    </div>
  )
}
