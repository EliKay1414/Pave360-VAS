import * as React from "react"
import { Building2, User, Calendar, Wifi } from "lucide-react"
import type { VasMetricData } from "../types"

interface DashboardPlatformCardsProps {
  data: VasMetricData
}

export function DashboardPlatformCards({ data }: DashboardPlatformCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
      {/* PLATFORM FOUNDATION (Span 3) */}
      <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
          PLATFORM FOUNDATION
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-center">
          {/* Stat 1: Tenants */}
          <div>
            <div className="h-9 w-9 rounded-full bg-[#edf6ff] mx-auto flex items-center justify-center text-[#2563eb]">
              <Building2 className="h-4.5 w-4.5" />
            </div>
            <div className="text-2xl font-extrabold text-[#0c1a2e] mt-2">
              {data.platform.tenantsTotal}
            </div>
            <div className="text-xs text-[#7c8ea2] mt-1 font-medium">
              Tenants (
              <span className="font-bold text-[#0c1a2e]">
                {data.platform.tenantsActive} active
              </span>
              )
            </div>
          </div>

          {/* Stat 2: Users */}
          <div>
            <div className="h-9 w-9 rounded-full bg-[#edf6ff] mx-auto flex items-center justify-center text-[#2563eb]">
              <User className="h-4.5 w-4.5" />
            </div>
            <div className="text-2xl font-extrabold text-[#0c1a2e] mt-2">
              {data.platform.usersTotal}
            </div>
            <div className="text-xs text-[#7c8ea2] mt-1 font-medium">
              Users (
              <span className="font-bold text-[#0c1a2e]">
                {data.platform.usersActive} active
              </span>
              )
            </div>
          </div>

          {/* Stat 3: Tenants this month */}
          <div>
            <div className="h-9 w-9 rounded-full bg-[#edf6ff] mx-auto flex items-center justify-center text-[#2563eb]">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <div className="text-2xl font-extrabold text-[#0c1a2e] mt-2">
              {data.platform.tenantsThisMonth}
            </div>
            <div className="text-xs text-[#7c8ea2] mt-1 font-medium">
              Tenants this month
            </div>
          </div>

          {/* Stat 4: Active carriers */}
          <div>
            <div className="h-9 w-9 rounded-full bg-[#edf6ff] mx-auto flex items-center justify-center text-[#2563eb]">
              <Wifi className="h-4.5 w-4.5" />
            </div>
            <div className="text-2xl font-extrabold text-[#0c1a2e] mt-2">
              {data.platform.activeCarriers}
            </div>
            <div className="text-xs text-[#7c8ea2] mt-1 font-medium">
              Active carriers
            </div>
          </div>
        </div>
      </div>

      {/* CARRIER CONNECTIONS (Span 1) */}
      <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase mb-3">
          CARRIER CONNECTIONS
        </span>

        <div className="space-y-3 my-auto py-2">
          {data.carrierConnections.map((carrier) => (
            <div
              key={carrier.id}
              className="flex items-center justify-between gap-2"
            >
              <span className="font-bold text-[#0c1a2e] text-sm truncate" title={carrier.name}>
                {carrier.name}
              </span>
              <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                <span>{carrier.status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
