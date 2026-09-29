import * as React from "react"
import { X } from "lucide-react"
import type { Connection, ConnectionFormData } from "../types"

interface ConnectionFormModalProps {
  isOpen: boolean
  modalMode: "create" | "edit"
  currentConnection: Connection | null
  carrierOptions: string[]
  onClose: () => void
  onSubmit: (data: ConnectionFormData) => void
  isSubmitting?: boolean
}

export const ConnectionFormModal: React.FC<ConnectionFormModalProps> = ({
  isOpen,
  modalMode,
  currentConnection,
  carrierOptions,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = React.useState<ConnectionFormData>({
    name: "",
    carrier: carrierOptions[0] || "AT Ghana SMSC",
    protocol: "SMPP",
    host: "127.0.0.1",
    port: 2775,
    systemId: "Pave360",
    password: "",
    systemType: "",
    bindType: "Transceiver",
    sourceIp: "",
    useTls: false,
    ton: 0,
    npi: 0,
    tpsLimit: 50,
    windowSize: 10,
    timeoutSeconds: 30,
    enquireLinkInterval: 30,
    reconnectDelay: 10,
    maxReconnectAttempts: 0,
  })

  React.useEffect(() => {
    if (modalMode === "edit" && currentConnection) {
      setFormData({
        name: currentConnection.name,
        carrier: currentConnection.carrier,
        protocol: currentConnection.protocol,
        host: currentConnection.host,
        port: currentConnection.port,
        systemId: currentConnection.systemId,
        password: currentConnection.password || "",
        systemType: currentConnection.systemType,
        bindType: currentConnection.bindType,
        sourceIp: currentConnection.sourceIp,
        useTls: currentConnection.useTls,
        ton: currentConnection.ton,
        npi: currentConnection.npi,
        tpsLimit: currentConnection.tpsLimit,
        windowSize: currentConnection.windowSize,
        timeoutSeconds: currentConnection.timeoutSeconds,
        enquireLinkInterval: currentConnection.enquireLinkInterval,
        reconnectDelay: currentConnection.reconnectDelay,
        maxReconnectAttempts: currentConnection.maxReconnectAttempts,
      })
    } else {
      setFormData({
        name: "",
        carrier: carrierOptions[0] || "AT Ghana SMSC",
        protocol: "SMPP",
        host: "127.0.0.1",
        port: 2775,
        systemId: "Pave360",
        password: "",
        systemType: "",
        bindType: "Transceiver",
        sourceIp: "",
        useTls: false,
        ton: 0,
        npi: 0,
        tpsLimit: 50,
        windowSize: 10,
        timeoutSeconds: 30,
        enquireLinkInterval: 30,
        reconnectDelay: 10,
        maxReconnectAttempts: 0,
      })
    }
  }, [modalMode, currentConnection, isOpen, carrierOptions])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.host.trim()) return
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {modalMode === "create" ? "Create connection" : "Edit connection"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-name">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="conn-name"
                type="text"
                required
                placeholder="e.g. AT Ghana Primary SMPP"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-carrier">
                Carrier
              </label>
              <select
                id="conn-carrier"
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                {carrierOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-protocol">
                Protocol
              </label>
              <select
                id="conn-protocol"
                value={formData.protocol}
                onChange={(e) => setFormData({ ...formData, protocol: e.target.value as "SMPP" | "HTTP" })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                <option value="SMPP">SMPP v3.4</option>
                <option value="HTTP">HTTP REST</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-host">
                Host / IP <span className="text-red-500">*</span>
              </label>
              <input
                id="conn-host"
                type="text"
                required
                placeholder="172.17.9.38"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-port">
                Port
              </label>
              <input
                id="conn-port"
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: Number(e.target.value) || 2775 })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-sysid">
                System ID
              </label>
              <input
                id="conn-sysid"
                type="text"
                placeholder="Pave360"
                value={formData.systemId}
                onChange={(e) => setFormData({ ...formData, systemId: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-pwd">
                Password
              </label>
              <input
                id="conn-pwd"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-bind">
                Bind Type
              </label>
              <select
                id="conn-bind"
                value={formData.bindType}
                onChange={(e) => setFormData({ ...formData, bindType: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                <option value="Transceiver">Transceiver (TRX)</option>
                <option value="Transmitter">Transmitter (TX)</option>
                <option value="Receiver">Receiver (RX)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-tps">
                Throughput Limit (TPS)
              </label>
              <input
                id="conn-tps"
                type="number"
                value={formData.tpsLimit}
                onChange={(e) => setFormData({ ...formData, tpsLimit: Number(e.target.value) || 50 })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-window">
                Window Size
              </label>
              <input
                id="conn-window"
                type="number"
                value={formData.windowSize}
                onChange={(e) => setFormData({ ...formData, windowSize: Number(e.target.value) || 10 })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 pb-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : modalMode === "create" ? "Create connection" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
