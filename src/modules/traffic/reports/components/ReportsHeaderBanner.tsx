import { Download } from "lucide-react"

interface ReportsHeaderBannerProps {
  activeTab: "financial" | "telemetry"
  setActiveTab: (tab: "financial" | "telemetry") => void
  onExportCSV: () => void
}

export function ReportsHeaderBanner({
  activeTab,
  setActiveTab,
  onExportCSV,
}: ReportsHeaderBannerProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200/90 pt-1">
      <div className="flex items-center gap-6 sm:gap-8">
        <button
          type="button"
          onClick={() => setActiveTab("financial")}
          className={`pb-3 text-[13.5px] font-semibold transition-colors cursor-pointer relative ${
            activeTab === "financial"
              ? "text-[#0070f3] border-b-2 border-[#0070f3]"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Financial &amp; Billing
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("telemetry")}
          className={`pb-3 text-[13.5px] font-semibold transition-colors cursor-pointer relative ${
            activeTab === "telemetry"
              ? "text-[#0070f3] border-b-2 border-[#0070f3]"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Traffic &amp; Carrier Telemetry
        </button>
      </div>

      {/* Export Ledger CSV button (visible on financial tab) */}
      {activeTab === "financial" && (
        <button
          type="button"
          onClick={onExportCSV}
          className="mb-2 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          <span>Export Ledger CSV</span>
        </button>
      )}
    </div>
  )
}
