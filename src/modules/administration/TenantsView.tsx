import { useState, useMemo } from "react"
import type { Tenant, TenantFormData, TenantStatus } from "./tenants/types"
import {
  TenantsHeader,
  TenantsTable,
  TenantModal,
  INITIAL_TENANTS,
} from "./tenants"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"
import { useTenants, useCreateTenant, useUpdateTenant } from "../../shared/hooks/useTenants"
import { env } from "../../shared/config/env"
import { useAppSelector } from "../../shared/store"

const STORAGE_KEY = "pave360_vas_tenants_data"

export function TenantsView() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)
  const { data: apiTenants, isLoading } = useTenants()
  const createTenantMutation = useCreateTenant()
  const updateTenantMutation = useUpdateTenant()

  const [localTenants, setLocalTenants] = useState<Tenant[]>(() => {
    // If live backend is enabled and user is logged in, do not flash initial mock data
    if (env.isLive && signedIn) {
      return []
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      /* ignore */
    }
    return INITIAL_TENANTS
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)

  const saveLocalTenants = (updated: Tenant[]) => {
    setLocalTenants(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      /* ignore */
    }
  }

  // Map live API tenants or fallback to local
  const tenants = useMemo<Tenant[]>(() => {
    if (apiTenants && Array.isArray(apiTenants) && apiTenants.length > 0) {
      return apiTenants.map((t) => ({
        id: t.id,
        company: t.name,
        slug: t.slug || t.name.toLowerCase().replace(/\s+/g, "-"),
        status: (t.status as TenantStatus) || "Active",
        contact: t.contactEmail || "",
        contactName: t.contactName,
        contactPhone: t.contactPhone,
        country: t.countryCode || "GH",
        notes: "",
        balance:
          typeof t.walletBalance === "number"
            ? `${t.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${t.currency || "GHS"}`
            : "0.00 GHS",
        billingType: (t.billingMode as "Prepaid" | "Postpaid") || "Prepaid",
        usersCount: t.userCount ?? 0,
        created: t.createdAt ? new Date(t.createdAt).toISOString().split("T")[0] : "",
      }))
    }
    if (!env.isLive || !signedIn) {
      return localTenants
    }
    return localTenants.length > 0 ? localTenants : INITIAL_TENANTS
  }, [apiTenants, localTenants, signedIn])

  const handleOpenCreate = () => {
    setEditingTenant(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setIsModalOpen(true)
  }

  const handleSaveTenant = async (formData: TenantFormData) => {
    if (editingTenant) {
      if (env.isLive && signedIn) {
        try {
          await updateTenantMutation.mutateAsync({
            id: editingTenant.id,
            payload: {
              name: formData.company,
              slug: formData.slug || formData.company.toLowerCase().replace(/\s+/g, "-"),
              status: formData.status,
              contactEmail: formData.contactEmail,
              contactName: formData.contactName,
              contactPhone: formData.contactPhone,
              countryCode: formData.country,
              timeZoneId: formData.timeZone,
              notes: formData.notes,
            },
          })
        } catch {
          // graceful fallback
        }
      }

      const updated = tenants.map((t) =>
        t.id === editingTenant.id
          ? {
              ...t,
              company: formData.company,
              slug: formData.slug || formData.company.toLowerCase().replace(/\s+/g, "-"),
              status: formData.status,
              contact: formData.contactEmail,
              contactName: formData.contactName,
              contactPhone: formData.contactPhone,
              country: formData.country,
              timeZone: formData.timeZone,
              notes: formData.notes,
            }
          : t
      )
      saveLocalTenants(updated)
      recordVasActivity({
        action: "tenant.update",
        entity: "Tenant",
        summary: `Tenant "${formData.company}" updated`,
      })
    } else {
      if (env.isLive && signedIn) {
        try {
          await createTenantMutation.mutateAsync({
            name: formData.company,
            slug: formData.slug || formData.company.toLowerCase().replace(/\s+/g, "-"),
            status: formData.status,
            contactEmail: formData.contactEmail,
            contactName: formData.contactName,
            contactPhone: formData.contactPhone,
            countryCode: formData.country,
            timeZoneId: formData.timeZone,
            notes: formData.notes,
          })
        } catch {
          // graceful fallback
        }
      }

      const newTenant: Tenant = {
        id: `TEN-${Date.now().toString().slice(-3)}`,
        company: formData.company,
        slug: formData.slug || formData.company.toLowerCase().replace(/\s+/g, "-"),
        status: formData.status,
        contact: formData.contactEmail,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        country: formData.country,
        timeZone: formData.timeZone,
        notes: formData.notes,
        balance: "0.00 GHS",
        billingType: "Prepaid",
        usersCount: 0,
        created: new Date().toISOString().split("T")[0],
      }
      const updated = [newTenant, ...tenants]
      saveLocalTenants(updated)
      recordVasActivity({
        action: "tenant.create",
        entity: "Tenant",
        summary: `New tenant "${formData.company}" created`,
      })
    }
    setIsModalOpen(false)
  }

    const isTenantsLoading = Boolean(isLoading && env.isLive && (!apiTenants || (apiTenants as any[])?.length === 0))

  return (
    <div className="space-y-6">
      {/* Page Subtitle & Create Tenant Action */}
      <TenantsHeader onCreateClick={handleOpenCreate} />

      {/* Tenants Table with clean loading state */}
      {isTenantsLoading ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-12 text-center">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading tenants from server...</p>
        </div>
      ) : (
        <TenantsTable tenants={tenants} onEdit={handleOpenEdit} />
      )}

      {/* Create / Edit Tenant Modal */}
      <TenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTenant}
        editingTenant={editingTenant}
      />
    </div>
  )
}

export const VasTenantsView = TenantsView
export default TenantsView
