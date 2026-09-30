import * as React from "react"
import { MessageDetailView } from "./MessageDetailView"
import { useDeliveryReports } from "../../shared/hooks/useDeliveryReports"
import { env } from "../../shared/config/env"
import {
  INITIAL_REPORTS,
  DeliveryReportsFilter,
  DeliveryReportsTable,
  type DeliveryReportRecord,
} from "./delivery-reports"

export type { DeliveryReportRecord } from "./delivery-reports"
export { DLR_STATUS_OPTIONS } from "./delivery-reports"

export function DeliveryReportsView() {
  const [statusFilter, setStatusFilter] = React.useState<string>("All")
  const [idFilter, setIdFilter] = React.useState<string>("")
  const [submittedQuery, setSubmittedQuery] = React.useState<string>("")

  // Fetch live delivery reports from VAS backend
  const { reports: liveReports, isLoading, isFetching } = useDeliveryReports({
    status: statusFilter !== "All" ? statusFilter : undefined,
    query: submittedQuery ? submittedQuery : undefined,
  })

  // Selected report for Message Detail View
  const [selectedReport, setSelectedReport] = React.useState<DeliveryReportRecord | null>(null)

  // Map live API records with fallback to INITIAL_REPORTS
  const allReports: DeliveryReportRecord[] = React.useMemo(() => {
    if (env.isLive && liveReports && liveReports.length > 0) {
      return liveReports.map((r) => ({
        id: r.messageId || r.id,
        tenant: r.tenant || r.tenantName || "Pave360",
        carrier: r.carrier || r.carrierName || "AT Ghana SMSC",
        carrierMsgId: r.carrierMsgId || r.id,
        status: r.status || "Delivered",
        error: r.error || r.errorCode || "000",
        latency: r.latency || (r.latencyMs !== undefined ? `${r.latencyMs} ms` : "0 ms"),
        received: r.received || r.receivedAt || r.deliveredAt || "Just now",
        timeline: r.timeline,
      }))
    }
    return INITIAL_REPORTS
  }, [liveReports])

  // Direct reactive filtering matching table
  const filteredReports = React.useMemo(() => {
    return allReports.filter((item) => {
      if (statusFilter !== "All") {
        if (item.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false
        }
      }

      const query = (submittedQuery || idFilter).trim().toLowerCase()
      if (query) {
        const matchMsg = item.id.toLowerCase().includes(query)
        const matchCarrierMsg = item.carrierMsgId.toLowerCase().includes(query)
        if (!matchMsg && !matchCarrierMsg) {
          return false
        }
      }

      return true
    })
  }, [allReports, statusFilter, idFilter, submittedQuery])

  const handleFilterSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSubmittedQuery(idFilter.trim())
  }

  // Check URL query param for direct message linking
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get("messageId") || params.get("id")
    if (idParam) {
      const found = allReports.find((r) => r.id === idParam || r.carrierMsgId === idParam)
      if (found) {
        setSelectedReport(found)
      } else {
        setSelectedReport({
          id: idParam,
          tenant: "Pave360",
          carrier: "AT Ghana SMSC",
          carrierMsgId: idParam,
          status: "Delivered",
          error: "000",
          latency: "0 ms",
          received: "Just now",
        })
      }
    }
  }, [allReports])

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const idParam = params.get("messageId") || params.get("id")
      if (idParam) {
        const found = allReports.find((r) => r.id === idParam || r.carrierMsgId === idParam)
        setSelectedReport(
          found || {
            id: idParam,
            tenant: "Pave360",
            carrier: "AT Ghana SMSC",
            carrierMsgId: idParam,
            status: "Delivered",
            error: "000",
            latency: "0 ms",
            received: "Just now",
          }
        )
      } else {
        setSelectedReport(null)
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [allReports])

  const handleOpenReport = (report: DeliveryReportRecord) => {
    setSelectedReport(report)
    const url = new URL(window.location.href)
    url.searchParams.set("messageId", report.id)
    window.history.pushState({}, "", url.toString())
  }

  const handleBackFromDetail = () => {
    setSelectedReport(null)
    const url = new URL(window.location.href)
    url.searchParams.delete("messageId")
    url.searchParams.delete("id")
    window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""))
  }

  if (selectedReport) {
    return (
      <MessageDetailView
        message={{
          id: selectedReport.id,
          carrier: selectedReport.carrier,
          carrierMsgId: selectedReport.carrierMsgId,
          status: selectedReport.status,
          createdUtc: selectedReport.received,
          errorReason: selectedReport.error !== "000" ? selectedReport.error : undefined,
          dlrReports: [
            {
              status: selectedReport.status,
              carrierId: selectedReport.carrierMsgId,
              error: selectedReport.error,
              latency: selectedReport.latency,
              received: selectedReport.received,
            },
          ],
        }}
        onBack={handleBackFromDetail}
      />
    )
  }

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      {/* 1. Subheader: Page Description */}
      <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal pt-1">
        Carrier delivery receipts (DLRs) for this tenant. Simulated SMPP writes a Delivered DLR after submit. Live SMSC deliver_sm will land here once Inetlab is wired. Open a message ID for the retry timeline.
      </p>

      {/* 2. Top Filter Form Card */}
      <DeliveryReportsFilter
        statusFilter={statusFilter}
        onStatusChange={(status) => setStatusFilter(status)}
        idFilter={idFilter}
        onIdChange={(id) => {
          setIdFilter(id)
          setSubmittedQuery(id.trim())
        }}
        onSubmit={handleFilterSubmit}
      />

      {/* 3. Delivery Reports Data Table Card */}
      <DeliveryReportsTable
        reports={filteredReports}
        isLoading={env.isLive && isLoading && !liveReports?.length}
        onOpenReport={handleOpenReport}
      />
    </div>
  )
}

export default DeliveryReportsView
