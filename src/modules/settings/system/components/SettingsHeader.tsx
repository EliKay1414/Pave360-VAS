interface SettingsHeaderProps {
  onAddClick: () => void
}

export function SettingsHeader({ onAddClick }: SettingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
        Platform-wide key/value settings. Secrets are masked in this list.
      </p>

      <button
        type="button"
        onClick={onAddClick}
        className="h-9 px-4 bg-[#005743] hover:bg-[#004737] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
      >
        Add setting
      </button>
    </div>
  )
}
