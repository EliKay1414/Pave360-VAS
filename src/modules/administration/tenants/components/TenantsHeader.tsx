interface TenantsHeaderProps {
  onCreateClick: () => void
}

export function TenantsHeader({ onCreateClick }: TenantsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
        Customer companies that send traffic through the gateway.
      </p>

      <button
        type="button"
        onClick={onCreateClick}
        className="h-9 px-4 bg-[#005743] hover:bg-[#004737] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
      >
        Create tenant
      </button>
    </div>
  )
}
