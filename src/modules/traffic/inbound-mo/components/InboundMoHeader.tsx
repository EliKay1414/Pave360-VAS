import * as React from "react"

interface InboundMoHeaderProps {
  onSimulateInbound: () => void
}

export const InboundMoHeader: React.FC<InboundMoHeaderProps> = ({
  onSimulateInbound,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <div>
        <p className="text-[13.5px] text-[#4b5563] font-normal leading-normal">
          Mobile-originated messages (STOP/START/HELP and replies).
        </p>
      </div>

      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onSimulateInbound}
          className="bg-[#0b4d3c] hover:bg-[#083a2d] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center"
        >
          Simulate inbound
        </button>
      </div>
    </div>
  )
}

export default InboundMoHeader
