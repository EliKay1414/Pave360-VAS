export function FinancialMetricsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* Card 1: Total Revenue Billed */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <span className="text-xs font-medium text-slate-500 block">
          Total Revenue Billed
        </span>
        <div className="my-2 flex items-baseline">
          <span className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
            0.68
          </span>
          <span className="text-xs font-semibold text-slate-500 ml-1.5">
            GHS
          </span>
        </div>
        <span className="text-xs font-medium text-[#059669]">
          Prepaid + Postpaid settled
        </span>
      </div>

      {/* Card 2: Prepaid Debited */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <span className="text-xs font-medium text-slate-500 block">
          Prepaid Debited
        </span>
        <div className="my-2 flex items-baseline">
          <span className="text-2xl sm:text-[26px] font-bold text-[#059669] tracking-tight">
            0.68
          </span>
          <span className="text-xs font-semibold text-slate-500 ml-1.5">
            GHS
          </span>
        </div>
        <span className="text-xs font-normal text-slate-500">
          Settled wallet debits
        </span>
      </div>

      {/* Card 3: Postpaid Accrued */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <span className="text-xs font-medium text-slate-500 block">
          Postpaid Accrued
        </span>
        <div className="my-2 flex items-baseline">
          <span className="text-2xl sm:text-[26px] font-bold text-[#0070f3] tracking-tight">
            0.00
          </span>
          <span className="text-xs font-semibold text-slate-500 ml-1.5">
            GHS
          </span>
        </div>
        <span className="text-xs font-normal text-slate-500">
          Accrued unbilled usage
        </span>
      </div>

      {/* Card 4: In-Flight Reserved */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <span className="text-xs font-medium text-slate-500 block">
          In-Flight Reserved
        </span>
        <div className="my-2 flex items-baseline">
          <span className="text-2xl sm:text-[26px] font-bold text-[#d97706] tracking-tight">
            0.92
          </span>
          <span className="text-xs font-semibold text-slate-500 ml-1.5">
            GHS
          </span>
        </div>
        <span className="text-xs font-normal text-slate-500">
          Pending carrier delivery
        </span>
      </div>

      {/* Card 5: Total Top-Ups */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <span className="text-xs font-medium text-slate-500 block">
          Total Top-Ups
        </span>
        <div className="my-2 flex items-baseline">
          <span className="text-2xl sm:text-[26px] font-bold text-[#6366f1] tracking-tight">
            0.00
          </span>
          <span className="text-xs font-semibold text-slate-500 ml-1.5">
            GHS
          </span>
        </div>
        <span className="text-xs font-normal text-slate-500">
          Prepaid wallet recharges
        </span>
      </div>
    </div>
  )
}
