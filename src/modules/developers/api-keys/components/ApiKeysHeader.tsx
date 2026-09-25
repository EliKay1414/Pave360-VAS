interface ApiKeysHeaderProps {
  onCreateClick: () => void
}

export function ApiKeysHeader({ onCreateClick }: ApiKeysHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
        Tenant API keys authenticate with the{" "}
        <span className="font-mono text-xs text-slate-700">
          x-Api-Key
        </span>{" "}
        header. Secrets are shown once at creation.
      </p>

      <button
        type="button"
        onClick={onCreateClick}
        className="h-9.5 px-4 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
      >
        Create API key
      </button>
    </div>
  )
}
