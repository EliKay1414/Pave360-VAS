import * as React from "react"
import { X } from "lucide-react"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"

export interface Connection {
  id: string
  name: string
  carrier: string
  protocol: "SMPP" | "HTTP"
  host: string
  port: number | string
  systemId: string
  password?: string
  systemType: string
  bindType: "Transceiver" | "Transmitter" | "Receiver"
  sourceIp: string
  useTls: boolean
  ton: number
  npi: number
  tpsLimit: number
  windowSize: number
  timeoutSeconds: number
  enquireLinkInterval: number
  reconnectDelay: number
  maxReconnectAttempts: number
  status: "Connected" | "Disconnected" | "Connecting"
}

const DEFAULT_CONNECTIONS: Connection[] = [
  {
    id: "1",
    name: "AT Ghana SMSC",
    carrier: "AT Ghana SMSC",
    protocol: "SMPP",
    host: "172.17.9.38",
    port: 3010,
    systemId: "Pave360",
    password: "",
    systemType: "TR",
    bindType: "Transceiver",
    sourceIp: "172.31.49.124",
    useTls: false,
    ton: 0,
    npi: 0,
    tpsLimit: 500,
    windowSize: 10,
    timeoutSeconds: 30,
    enquireLinkInterval: 30,
    reconnectDelay: 10,
    maxReconnectAttempts: 0,
    status: "Connected",
  },
]

const STORAGE_KEY = "pave360_vas_connections_data"
const CARRIERS_STORAGE_KEY = "pave360_vas_carriers_data"

export function ConnectionsView() {
  // Load connections from localStorage or fallback
  const [connections, setConnections] = React.useState<Connection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CONNECTIONS
  })

  // Load available carriers for the Carrier dropdown
  const [availableCarriers, setAvailableCarriers] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CARRIERS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: any) => c.name || c.code).filter(Boolean)
        }
      }
    } catch {
      // Fallback
    }
    return ["AT Ghana SMSC", "MTN Ghana SMSC", "Telecel Ghana Core", "Hubtel Aggregator"]
  })

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create")
  const [currentConnection, setCurrentConnection] = React.useState<Connection | null>(null)

  // Delete Confirmation Modal
  const [deleteConfirmTarget, setDeleteConfirmTarget] = React.useState<Connection | null>(null)

  // Form State
  const [formData, setFormData] = React.useState({
    carrier: "",
    name: "",
    protocol: "SMPP" as "SMPP" | "HTTP",
    host: "",
    port: "2775",
    systemId: "",
    password: "",
    systemType: "",
    bindType: "Transceiver" as "Transceiver" | "Transmitter" | "Receiver",
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

  // Persist connections
  const saveConnections = (updated: Connection[]) => {
    setConnections(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore
    }
  }

  // Open "Create connection" modal
  const handleOpenCreate = () => {
    setModalMode("create")
    setCurrentConnection(null)
    setFormData({
      carrier: "",
      name: "",
      protocol: "SMPP",
      host: "",
      port: "2775",
      systemId: "",
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
    setIsModalOpen(true)
  }

  // Open "Edit connection" modal
  const handleOpenEdit = (conn: Connection) => {
    setModalMode("edit")
    setCurrentConnection(conn)
    setFormData({
      carrier: conn.carrier,
      name: conn.name,
      protocol: conn.protocol,
      host: conn.host,
      port: String(conn.port),
      systemId: conn.systemId,
      password: "",
      systemType: conn.systemType,
      bindType: conn.bindType,
      sourceIp: conn.sourceIp,
      useTls: conn.useTls,
      ton: conn.ton,
      npi: conn.npi,
      tpsLimit: conn.tpsLimit,
      windowSize: conn.windowSize,
      timeoutSeconds: conn.timeoutSeconds,
      enquireLinkInterval: conn.enquireLinkInterval,
      reconnectDelay: conn.reconnectDelay,
      maxReconnectAttempts: conn.maxReconnectAttempts,
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentConnection(null)
  }

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    if (modalMode === "create") {
      const newConn: Connection = {
        id: String(Date.now()),
        name: formData.name.trim(),
        carrier: formData.carrier.trim() || formData.name.trim(),
        protocol: formData.protocol,
        host: formData.host.trim() || "127.0.0.1",
        port: Number(formData.port) || 2775,
        systemId: formData.systemId.trim() || "Pave360",
        password: formData.password.trim(),
        systemType: formData.systemType.trim(),
        bindType: formData.bindType,
        sourceIp: formData.sourceIp.trim(),
        useTls: formData.useTls,
        ton: Number(formData.ton) || 0,
        npi: Number(formData.npi) || 0,
        tpsLimit: Number(formData.tpsLimit) || 50,
        windowSize: Number(formData.windowSize) || 10,
        timeoutSeconds: Number(formData.timeoutSeconds) || 30,
        enquireLinkInterval: Number(formData.enquireLinkInterval) || 30,
        reconnectDelay: Number(formData.reconnectDelay) || 10,
        maxReconnectAttempts: Number(formData.maxReconnectAttempts) || 0,
        status: "Connected",
      }
      saveConnections([...connections, newConn])
      recordVasActivity({
        action: "connection.create",
        entity: "Connection",
        summary: `Bind session '${formData.name.trim()}' created (${formData.protocol} ${formData.bindType})`,
      })
    } else if (modalMode === "edit" && currentConnection) {
      const updated = connections.map((c) =>
        c.id === currentConnection.id
          ? {
              ...c,
              name: formData.name.trim(),
              carrier: formData.carrier.trim() || formData.name.trim(),
              protocol: formData.protocol,
              host: formData.host.trim(),
              port: Number(formData.port) || c.port,
              systemId: formData.systemId.trim(),
              password: formData.password.trim() || c.password,
              systemType: formData.systemType.trim(),
              bindType: formData.bindType,
              sourceIp: formData.sourceIp.trim(),
              useTls: formData.useTls,
              ton: Number(formData.ton) || 0,
              npi: Number(formData.npi) || 0,
              tpsLimit: Number(formData.tpsLimit) || 50,
              windowSize: Number(formData.windowSize) || 10,
              timeoutSeconds: Number(formData.timeoutSeconds) || 30,
              enquireLinkInterval: Number(formData.enquireLinkInterval) || 30,
              reconnectDelay: Number(formData.reconnectDelay) || 10,
              maxReconnectAttempts: Number(formData.maxReconnectAttempts) || 0,
            }
          : c
      )
      saveConnections(updated)
      recordVasActivity({
        action: "connection.update",
        entity: "Connection",
        summary: `Bind session '${formData.name.trim()}' parameters updated`,
      })
    }

    handleCloseModal()
  }

  // Delete Connection
  const handleDeleteConnection = (id: string) => {
    const target = connections.find((c) => c.id === id)
    const updated = connections.filter((c) => c.id !== id)
    saveConnections(updated)
    recordVasActivity({
      action: "connection.delete",
      entity: "Connection",
      summary: `Bind session '${target?.name || id}' removed`,
    })
    if (isModalOpen) handleCloseModal()
    if (deleteConfirmTarget) setDeleteConfirmTarget(null)
  }

  return (
    <div className="space-y-4 font-sans select-none">
      {/* 1. Subheader: Description on Left, "Create connection" button on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal">
          SMPP/HTTP sessions to carrier SMSCs. Passwords are never displayed after save.
        </p>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center px-4.5 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          Create connection
        </button>
      </div>

      {/* 2. Connections Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  CONNECTION
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  CARRIER
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  ENDPOINT
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  SYSTEM ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  BIND
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  TPS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  STATUS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                  {/* Actions Column */}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {connections.length > 0 ? (
                connections.map((conn) => (
                  <tr
                    key={conn.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(conn)}
                        className="text-[#046a56] font-semibold text-sm hover:underline cursor-pointer text-left"
                      >
                        {conn.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {conn.carrier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {conn.host ? `${conn.host}:${conn.port}` : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {conn.systemId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {conn.bindType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {conn.tpsLimit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {conn.status === "Connected" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                          Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Disconnected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(conn)}
                          className="text-[#046a56] font-semibold text-sm hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmTarget(conn)}
                          className="text-[#dc2626] font-semibold text-sm hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400 text-sm">
                    No connections configured yet. Click "Create connection" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Create / Edit Connection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
          <div
            className="relative w-full max-w-162.5 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden max-h-[92vh] flex flex-col font-sans"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-7 pt-6 pb-3">
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                {modalMode === "create" ? "Create connection" : "Edit connection"}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-7 py-2 space-y-4">
              {/* Row 1: Carrier & Name (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-carrier">
                    Carrier
                  </label>
                  <select
                    id="conn-carrier"
                    value={formData.carrier}
                    onChange={(e) => {
                      const val = e.target.value
                      setFormData({
                        ...formData,
                        carrier: val,
                        name: formData.name ? formData.name : val,
                      })
                    }}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 bg-white"
                  >
                    <option value="">Select carrier...</option>
                    {availableCarriers.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-name">
                    Name
                  </label>
                  <input
                    id="conn-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
              </div>

              {/* Row 2: Protocol (with helper text below it), Host, Port (3 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-protocol">
                    Protocol
                  </label>
                  <select
                    id="conn-protocol"
                    value={formData.protocol}
                    onChange={(e) => setFormData({ ...formData, protocol: e.target.value as "SMPP" | "HTTP" })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 bg-white"
                  >
                    <option value="SMPP">SMPP</option>
                    <option value="HTTP">HTTP</option>
                  </select>
                  {/* Note directly under Protocol in Column 1 */}
                  <p className="text-[11px] text-[#7c8ea2] leading-[1.35] mt-1.5 font-normal">
                    SMPP = A2P SMS. USSD HTTP = Six Dee USSN (System ID = clientId, System type = starCode). Live Center: set Host/clientId/starCode here and Ussd:Mode=Live. Do not mix with SMS routes.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-host">
                    Host
                  </label>
                  <input
                    id="conn-host"
                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-port">
                    Port
                  </label>
                  <input
                    id="conn-port"
                    type="text"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
              </div>

              {/* Row 3: System ID / clientId, Password, System type / starCode (3 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-sysid">
                    System ID / clientId
                  </label>
                  <input
                    id="conn-sysid"
                    type="text"
                    value={formData.systemId}
                    onChange={(e) => setFormData({ ...formData, systemId: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-password">
                    Password
                  </label>
                  <input
                    id="conn-password"
                    type="password"
                    placeholder={modalMode === "create" ? "Required" : "Leave blank to keep existing"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-systype">
                    System type / starCode
                  </label>
                  <input
                    id="conn-systype"
                    type="text"
                    value={formData.systemType}
                    onChange={(e) => setFormData({ ...formData, systemType: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
              </div>

              {/* Row 4: Bind type, Source IP, Use TLS (3 cols, perfectly aligned) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-bind">
                    Bind type
                  </label>
                  <select
                    id="conn-bind"
                    value={formData.bindType}
                    onChange={(e) => setFormData({ ...formData, bindType: e.target.value as any })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 bg-white"
                  >
                    <option value="Transceiver">Transceiver</option>
                    <option value="Transmitter">Transmitter</option>
                    <option value="Receiver">Receiver</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-sourceip">
                    Source IP
                  </label>
                  <input
                    id="conn-sourceip"
                    type="text"
                    value={formData.sourceIp}
                    onChange={(e) => setFormData({ ...formData, sourceIp: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div className="sm:pt-6">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none h-10">
                    <input
                      type="checkbox"
                      checked={formData.useTls}
                      onChange={(e) => setFormData({ ...formData, useTls: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <span>Use TLS</span>
                  </label>
                </div>
              </div>

              {/* Row 5: TON, NPI, TPS limit, Window size (4 cols) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-ton">
                    TON
                  </label>
                  <input
                    id="conn-ton"
                    type="number"
                    value={formData.ton}
                    onChange={(e) => setFormData({ ...formData, ton: Number(e.target.value) })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-npi">
                    NPI
                  </label>
                  <input
                    id="conn-npi"
                    type="number"
                    value={formData.npi}
                    onChange={(e) => setFormData({ ...formData, npi: Number(e.target.value) })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-tps">
                    TPS limit
                  </label>
                  <input
                    id="conn-tps"
                    type="number"
                    value={formData.tpsLimit}
                    onChange={(e) => setFormData({ ...formData, tpsLimit: Number(e.target.value) })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="conn-window">
                    Window size
                  </label>
                  <input
                    id="conn-window"
                    type="number"
                    value={formData.windowSize}
                    onChange={(e) => setFormData({ ...formData, windowSize: Number(e.target.value) })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
              </div>

              {/* Row 6: Timeout, Enquire link, Reconnect delay, Max reconnect (4 cols, level aligned) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 min-h-7.5 items-end" htmlFor="conn-timeout">
                    Timeout (seconds)
                  </label>
                  <input
                    id="conn-timeout"
                    type="number"
                    value={formData.timeoutSeconds}
                    onChange={(e) => setFormData({ ...formData, timeoutSeconds: Number(e.target.value) })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 min-h-7.5 items-end leading-tight" htmlFor="conn-enquire">
                    Enquire link interval (seconds)
                  </label>
                  <input
                    id="conn-enquire"
                    type="number"
                    value={formData.enquireLinkInterval}
                    onChange={(e) => setFormData({ ...formData, enquireLinkInterval: Number(e.target.value) })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 min-h-7.5 items-end leading-tight" htmlFor="conn-reconnect">
                    Reconnect delay (seconds)
                  </label>
                  <input
                    id="conn-reconnect"
                    type="number"
                    value={formData.reconnectDelay}
                    onChange={(e) => setFormData({ ...formData, reconnectDelay: Number(e.target.value) })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 min-h-7.5 items-end leading-tight" htmlFor="conn-maxreconnect">
                    Max reconnect attempts (0 = unlimited)
                  </label>
                  <input
                    id="conn-maxreconnect"
                    type="number"
                    value={formData.maxReconnectAttempts}
                    onChange={(e) => setFormData({ ...formData, maxReconnectAttempts: Number(e.target.value) })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-5 pb-3 flex items-center justify-between border-t border-slate-100 mt-2">
                {modalMode === "edit" && currentConnection ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteConnection(currentConnection.id)}
                    className="px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Delete connection
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    {modalMode === "create" ? "Create" : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150 font-sans">
          <div className="relative w-full max-w-105 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Delete Connection
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete connection <span className="font-semibold text-slate-900">{deleteConfirmTarget.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConnection(deleteConfirmTarget.id)}
                className="px-4.5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConnectionsView
