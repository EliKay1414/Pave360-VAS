interface WebhooksHeaderProps {
  onCreateClick: () => void
}

export function WebhooksHeader({ onCreateClick }: WebhooksHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
        Signed outbound callbacks for delivery and inbound events.
      </p>

      <button
        type="button"
        onClick={onCreateClick}
        className="h-9.5 px-4 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
      >
        Create webhook
      </button>
    </div>
  )
}
