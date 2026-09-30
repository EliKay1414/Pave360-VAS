import * as React from "react"
import {
  INITIAL_LEDGER_RECORDS,
  CARRIER_TELEMETRY_DATA,
  ReportsHeaderBanner,
  FinancialMetricsCards,
  ReportsFilterBar,
  FinancialLedgerTable,
  CarrierTelemetryView,
  type LedgerRecord,
  type CarrierTelemetryRecord,
} from "./reports"
import { useBillingReports } from "../../shared/hooks/useBillingReports"
import { env } from "../../shared/config/env"

// Re-export types for backward compatibility
export * from "./reports/types"

export function ReportsBillingView() {
  const [activeTab, setActiveTab] = React.useState<"financial" | "telemetry">("financial")

  // Filter Bar state
  const [fromDate, setFromDate] = React.useState("08/26/2026 03:52 PM")
  const [toDate, setToDate] = React.useState("09/25/2026 03:52 PM")
  const [selectedTenant, setSelectedTenant] = React.useState("All Tenants")
  const [selectedType, setSelectedType] = React.useState<string>("All Types")

  // Live billing and telemetry reports from VAS Backend
  const { financial, telemetry, messaging, isLoading } = useBillingReports({
    fromDate,
    toDate,
    tenantId: selectedTenant !== "All Tenants" ? selectedTenant : undefined,
    type: selectedType !== "All Types" ? selectedType : undefined,
  })

  // Dynamically update page header title & subtitle based on active tab
  React.useEffect(() => {
    if (activeTab === "financial") {
      window.dispatchEvent(
        new CustomEvent("pave_set_page_title", { detail: "Reports & Analytics" })
      )
      window.dispatchEvent(
        new CustomEvent("pave_set_page_subtitle", {
          detail: "Financial billing ledgers, prepaid reserves, postpaid usage, and carrier metrics.",
        })
      )
    } else {
      window.dispatchEvent(
        new CustomEvent("pave_set_page_title", { detail: "Traffic Telemetry Reports" })
      )
      window.dispatchEvent(
        new CustomEvent("pave_set_page_subtitle", {
          detail: "Real-time carrier performance benchmarks, delivery rates, and network pipeline volumes.",
        })
      )
    }

    return () => {
      window.dispatchEvent(new CustomEvent("pave_set_page_title", { detail: null }))
      window.dispatchEvent(new CustomEvent("pave_set_page_subtitle", { detail: null }))
    }
  }, [activeTab])

  // Map live API records with fallback to mock data
  const baseLedgerRecords: LedgerRecord[] = React.useMemo(() => {
    if (env.isLive && financial?.ledgerRecords && financial.ledgerRecords.length > 0) {
      return financial.ledgerRecords
    }
    return INITIAL_LEDGER_RECORDS
  }, [financial])

  const baseTelemetryRecords: CarrierTelemetryRecord[] = React.useMemo(() => {
    if (env.isLive && telemetry?.carrierBreakdown && telemetry.carrierBreakdown.length > 0) {
      return telemetry.carrierBreakdown
    }
    return CARRIER_TELEMETRY_DATA
  }, [telemetry])

  // Real-time filtering reacting immediately to selectedType and selectedTenant
  const filteredRecords = React.useMemo(() => {
    return baseLedgerRecords.filter((r) => {
      // Filter by Tenant
      if (selectedTenant !== "All Tenants" && r.tenant !== selectedTenant) {
        return false
      }

      // Filter by Transaction Type matching exact dropdown options
      if (selectedType === "Debit (Prepaid)") {
        if (r.type !== "Debit") return false
      } else if (selectedType === "Postpaid Usage") {
        if (r.type !== "Postpaid") return false
      } else if (selectedType === "Reserve") {
        if (r.type !== "Reserve") return false
      } else if (selectedType === "Release") {
        if (r.type !== "Release") return false
      } else if (selectedType === "Top-Up") {
        if (r.type !== "Top-Up") return false
      }
      // "All Types" allows everything

      return true
    })
  }, [baseLedgerRecords, selectedTenant, selectedType])

  // Filter button
  const handleApplyFilter = () => {
    // Already reactive via hook and state
  }

  // Reset button
  const handleResetFilter = () => {
    setSelectedTenant("All Tenants")
    setSelectedType("All Types")
    setFromDate("08/26/2026 03:52 PM")
    setToDate("09/25/2026 03:52 PM")
  }

  // Export Ledger to CSV
  const handleExportCSV = () => {
    const headers = [
      "DATE & TIME (UTC)",
      "TENANT",
      "CATEGORY",
      "TYPE",
      "AMOUNT",
      "BALANCE AFTER",
      "SEGMENTS / RATE",
      "REFERENCE",
      "DESCRIPTION",
    ]
    const rows = filteredRecords.map((r) => [
      `"${r.dateTime}"`,
      `"${r.tenant}"`,
      `"${r.category}"`,
      `"${r.type}"`,
      `"${r.amount}"`,
      `"${r.balanceAfter}"`,
      `"${r.segmentsRate}"`,
      `"${r.reference}"`,
      `"${r.description.replace(/"/g, '""')}"`,
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `financial_ledger_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-5 font-sans select-none pb-12">
      {/* 1. Header Banner & Tabs */}
      <ReportsHeaderBanner
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportCSV={handleExportCSV}
      />

      {/* 2. Tab 1: Financial & Billing */}
      {activeTab === "financial" && (
        <div className="space-y-6 animate-in fade-in-50 duration-150">
          {/* Financial KPI Cards */}
          <FinancialMetricsCards summary={financial?.summary} />

          {/* Filter Bar with DateTimePickers and Transaction Type dropdown */}
          <ReportsFilterBar
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            selectedTenant={selectedTenant}
            setSelectedTenant={setSelectedTenant}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            onApplyFilter={handleApplyFilter}
            onResetFilter={handleResetFilter}
          />

          {/* Financial Ledger Table */}
          <FinancialLedgerTable
            records={filteredRecords}
            totalCount={baseLedgerRecords.length}
          />
        </div>
      )}

      {/* 3. Tab 2: Traffic & Carrier Telemetry */}
      {activeTab === "telemetry" && (
        <CarrierTelemetryView data={baseTelemetryRecords} />
      )}
    </div>
  )
}

export const VasReportsView = ReportsBillingView
export default ReportsBillingView
