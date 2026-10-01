import * as React from "react"
import { Plus } from "lucide-react"

interface SenderIdsHeaderProps {
  onOpenRegister: () => void
}

export const SenderIdsHeader: React.FC<SenderIdsHeaderProps> = ({
  onOpenRegister,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <p className="text-[13.5px] text-[#4b5563] font-normal leading-normal">
        Whitelisted sender headers for outbound SMS dispatch & compliance.
      </p>

      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onOpenRegister}
          className="bg-[#0b4d3c] hover:bg-[#083a2d] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Register Sender</span>
        </button>
      </div>
    </div>
  )
}

export default SenderIdsHeader
