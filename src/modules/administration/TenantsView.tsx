import { useState } from "react"
import type { Tenant, TenantFormData } from "./tenants/types"
import {
  TenantsHeader,
  TenantsTable,
  TenantModal,
  INITIAL_TENANTS,
} from "./tenants"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"

export function TenantsView() {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)

  const handleOpenCreate = () => {
    setEditingTenant(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setIsModalOpen(true)
  }

  const handleSaveTenant = (formData: TenantFormData) => {
    if (editingTenant) {
      setTenants((prev) =>
        prev.map((t) =>
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
      )
      recordVasActivity({
        action: "tenant.update",
        entity: "Tenant",
        summary: `Tenant "${formData.company}" updated`,
      })
    } else {
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
      setTenants((prev) => [newTenant, ...prev])
      recordVasActivity({
        action: "tenant.create",
        entity: "Tenant",
        summary: `New tenant "${formData.company}" created`,
      })
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Subtitle & Create Tenant Action */}
      <TenantsHeader onCreateClick={handleOpenCreate} />

      {/* Tenants Table */}
      <TenantsTable tenants={tenants} onEdit={handleOpenEdit} />

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
