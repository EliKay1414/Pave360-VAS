import * as React from "react"
import { toast } from "sonner"
import { CarriersHeader } from "./carriers/components/CarriersHeader"
import { CarriersTable } from "./carriers/components/CarriersTable"
import { CarrierFormModal } from "./carriers/components/CarrierFormModal"
import { DeleteCarrierModal } from "./carriers/components/DeleteCarrierModal"
import {
  useCarriers,
  useCreateCarrier,
  useUpdateCarrier,
  useDeleteCarrier,
} from "../../shared/hooks/useNetworkCarriers"
import type { CarrierListItemViewModel } from "../../shared/services/vas/types"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"
import { env } from "../../shared/config/env"
import type { Carrier, CarrierFormData } from "./carriers/types"

export type { Carrier } from "./carriers/types"

const STORAGE_KEY = "pave360_vas_carriers"

const INITIAL_CARRIERS: Carrier[] = [
  {
    id: "1",
    name: "AT Ghana SMSC",
    code: "AT-GH",
    country: "GH",
    mcc: "620",
    mnc: "03",
    status: "Active",
    protocol: "SMPP",
    priority: 100,
    connections: "1 / 1 enabled",
    supportsSms: true,
    supportsDlrs: true,
    supportsUnicode: true,
    supportsConcatenated: true,
  },
]

function mapApiCarrier(item: CarrierListItemViewModel): Carrier {
  return {
    id: item.id,
    name: item.name,
    code: item.code,
    country: item.countryCode || "GH",
    mcc: item.mcc || "",
    mnc: item.mnc || "",
    status: (item.status === "Active" || item.status === "Enabled" || !item.status ? "Active" : "Inactive") as "Active" | "Inactive",
    protocol: item.defaultProtocol || "SMPP",
    priority: item.priority ?? 100,
    connections: `${item.enabledConnectionCount ?? 0} / ${item.connectionCount ?? 0} enabled`,
    supportsSms: true,
    supportsDlrs: true,
    supportsUnicode: true,
    supportsConcatenated: true,
    notes: "",
  }
}

export function CarriersView() {
  const { data: liveCarriers, isLoading, isFetching, refetch } = useCarriers()
  const createCarrierMutation = useCreateCarrier()
  const updateCarrierMutation = useUpdateCarrier()
  const deleteCarrierMutation = useDeleteCarrier()

  const [carriers, setCarriers] = React.useState<Carrier[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return INITIAL_CARRIERS
  })

  const displayedCarriers = React.useMemo(() => {
    if (env.isLive && liveCarriers) {
      return liveCarriers.map(mapApiCarrier)
    }
    return env.isLive ? [] : carriers
  }, [liveCarriers, carriers])

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create")
  const [currentCarrier, setCurrentCarrier] = React.useState<Carrier | null>(null)
  const [deleteConfirmTarget, setDeleteConfirmTarget] = React.useState<Carrier | null>(null)

  const saveCarriers = (updated: Carrier[]) => {
    setCarriers(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {}
  }

  const handleOpenCreate = () => {
    setModalMode("create")
    setCurrentCarrier(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (carrier: Carrier) => {
    setModalMode("edit")
    setCurrentCarrier(carrier)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (formData: CarrierFormData) => {
    try {
      if (modalMode === "create") {
        if (env.isLive) {
          await createCarrierMutation.mutateAsync({
            name: formData.name.trim(),
            code: formData.code.trim(),
            countryCode: formData.country.trim(),
            mcc: formData.mcc.trim(),
            mnc: formData.mnc.trim(),
            status: formData.status,
            defaultProtocol: formData.protocol,
            priority: formData.priority,
            supportsSms: formData.supportsSms,
            supportsDeliveryReceipts: formData.supportsDlrs,
            supportsUnicode: formData.supportsUnicode,
            supportsConcatenated: formData.supportsConcatenated,
            notes: formData.notes.trim(),
          })
        }
        const newCarrier: Carrier = {
          id: `carrier_${Date.now()}`,
          name: formData.name.trim(),
          code: formData.code.trim(),
          country: formData.country.trim(),
          mcc: formData.mcc.trim(),
          mnc: formData.mnc.trim(),
          status: formData.status,
          protocol: formData.protocol,
          priority: formData.priority,
          connections: "0 / 0 enabled",
          supportsSms: formData.supportsSms,
          supportsDlrs: formData.supportsDlrs,
          supportsUnicode: formData.supportsUnicode,
          supportsConcatenated: formData.supportsConcatenated,
          notes: formData.notes.trim(),
        }
        saveCarriers([...carriers, newCarrier])
        recordVasActivity({
          action: "carrier.create",
          entity: "Carrier",
          summary: `Carrier '${formData.name.trim()}' (${formData.code.trim()}) registered`,
        })
        toast.success(`Carrier '${formData.name.trim()}' created`)
      } else if (modalMode === "edit" && currentCarrier) {
        if (env.isLive) {
          await updateCarrierMutation.mutateAsync({
            id: currentCarrier.id,
            payload: {
              name: formData.name.trim(),
              code: formData.code.trim(),
              countryCode: formData.country.trim(),
              mcc: formData.mcc.trim(),
              mnc: formData.mnc.trim(),
              status: formData.status,
              defaultProtocol: formData.protocol,
              priority: formData.priority,
              supportsSms: formData.supportsSms,
              supportsDeliveryReceipts: formData.supportsDlrs,
              supportsUnicode: formData.supportsUnicode,
              supportsConcatenated: formData.supportsConcatenated,
              notes: formData.notes.trim(),
            },
          })
        }
        const updated = carriers.map((c) =>
          c.id === currentCarrier.id
            ? { ...c, ...formData, connections: c.connections }
            : c
        )
        saveCarriers(updated)
        recordVasActivity({
          action: "carrier.update",
          entity: "Carrier",
          summary: `Carrier '${formData.name.trim()}' updated`,
        })
        toast.success(`Carrier '${formData.name.trim()}' updated`)
      }
      setIsModalOpen(false)
    } catch (err: any) {
      toast.error(err?.message || "Failed to save carrier")
    }
  }

  const handleDeleteConfirm = async (target: Carrier) => {
    try {
      if (env.isLive) {
        await deleteCarrierMutation.mutateAsync(target.id)
      }
      saveCarriers(carriers.filter((c) => c.id !== target.id))
      recordVasActivity({
        action: "carrier.delete",
        entity: "Carrier",
        summary: `Carrier '${target.name}' deleted`,
      })
      toast.success(`Carrier '${target.name}' deleted`)
      setDeleteConfirmTarget(null)
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete carrier")
    }
  }

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      <CarriersHeader
        onOpenCreate={handleOpenCreate}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      <CarriersTable
        carriers={displayedCarriers}
        isLoading={env.isLive && isLoading}
        onEdit={handleOpenEdit}
        onDelete={(c) => setDeleteConfirmTarget(c)}
      />

      <CarrierFormModal
        isOpen={isModalOpen}
        modalMode={modalMode}
        currentCarrier={currentCarrier}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createCarrierMutation.isPending || updateCarrierMutation.isPending}
      />

      <DeleteCarrierModal
        target={deleteConfirmTarget}
        onClose={() => setDeleteConfirmTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteCarrierMutation.isPending}
      />
    </div>
  )
}
