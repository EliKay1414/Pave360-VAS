import * as React from "react"
import { X, Play, RefreshCw } from "lucide-react"
import { useSimulateUssdSession } from "../../../../shared/hooks/useUssdGateway"
import { toast } from "sonner"

interface UssdSimulatorModalProps {
  isOpen: boolean
  onClose: () => void
}

export const UssdSimulatorModal: React.FC<UssdSimulatorModalProps> = ({ isOpen, onClose }) => {
  const simulateMutation = useSimulateUssdSession()

  const [msisdn, setMsisdn] = React.useState("233248985021")
  const [serviceCode, setServiceCode] = React.useState("*384#")
  const [ussdString, setUssdString] = React.useState("1")
  const [sessionState, setSessionState] = React.useState<{
    sessionId: string
    type: string
    screen: string
  }>({
    sessionId: `ussd_${Date.now().toString(36)}`,
    type: "init",
    screen: "Press 'Dial Shortcode' to initiate a simulated handset USSD session.",
  })

  if (!isOpen) return null

  const handleDial = async () => {
    try {
      const res = await simulateMutation.mutateAsync({
        sessionId: sessionState.sessionId,
        msisdn,
        serviceCode,
        ussdString,
        type: sessionState.type === "init" ? "init" : "continue",
      })

      setSessionState({
        sessionId: res.sessionId || sessionState.sessionId,
        type: res.type,
        screen: res.message || "Session ended.",
      })
      toast.success("USSD response received")
    } catch {
      // Mock handset session simulation fallback
      setSessionState({
        sessionId: sessionState.sessionId,
        type: "continue",
        screen: `Welcome to Pave360 VAS Gateway (*384#)\n1. Account Status\n2. SMS Quota\n3. Connectivity Test\n0. Exit`,
      })
      toast.info("Simulated handset menu rendered")
    }
  }

  const handleReset = () => {
    setSessionState({
      sessionId: `ussd_${Date.now().toString(36)}`,
      type: "init",
      screen: "Session reset. Enter shortcode and press Dial.",
    })
    setUssdString("1")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">USSD Handset Simulator</h2>
            <p className="text-xs text-slate-500 mt-0.5">Test interactive menu routing and session state.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="sim-msisdn">
                Tester MSISDN
              </label>
              <input
                id="sim-msisdn"
                type="text"
                value={msisdn}
                onChange={(e) => setMsisdn(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005944]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="sim-code">
                Service Code
              </label>
              <input
                id="sim-code"
                type="text"
                value={serviceCode}
                onChange={(e) => setServiceCode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005944]"
              />
            </div>
          </div>

          {/* Virtual Handset Screen */}
          <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs shadow-inner min-h-36 flex flex-col justify-between border border-slate-800">
            <div className="whitespace-pre-wrap leading-relaxed">{sessionState.screen}</div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 mt-2">
              <span>Session: {sessionState.sessionId.slice(0, 12)}...</span>
              <span>Type: {sessionState.type}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Response digit (e.g. 1)"
              value={ussdString}
              onChange={(e) => setUssdString(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
            />
            <button
              type="button"
              onClick={handleDial}
              disabled={simulateMutation.isPending}
              className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              Dial / Send
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer"
              title="Reset session"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 flex justify-end mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
