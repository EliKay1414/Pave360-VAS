interface AuditLogsPaginationProps {
  currentPage: number
  totalPages: number
  totalRecords: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function AuditLogsPagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}: AuditLogsPaginationProps) {
  const currentCount = Math.min(currentPage * pageSize, totalRecords)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3">
      <span className="text-xs text-slate-500">
        Showing {currentCount} of {totalRecords} total audit record(s) &middot; Page {currentPage} of {totalPages}
      </span>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-600">
          {currentPage} / {totalPages}
        </span>

        {currentPage > 1 && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Previous
          </button>
        )}

        {currentPage < totalPages && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
