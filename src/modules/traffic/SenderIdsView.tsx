import * as React from "react"
import { toast } from "sonner"
import { SenderIdsHeader } from "./sender-ids/components/SenderIdsHeader"
import {
  SenderIdsTable,
  type SenderIdRecord,
} from "./sender-ids/components/SenderIdsTable"
import {
  RegisterSenderModal,
  type RegisterSenderFormData,
} from "./sender-ids/components/RegisterSenderModal"
import { EditSenderModal } from "./sender-ids/components/EditSenderModal"
import {
  useSenderIds,
  useRegisterSenderId,
  useDeleteSenderId,
} from "../../shared/hooks/useSenderIds"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"
import { env } from "../../shared/config/env"

export { type SenderIdRecord } from "./sender-ids/components/SenderIdsTable"

const INITIAL_SENDERS: SenderIdRecord[] = [
  {
    id: "snd_oval_data",
    senderHeader: "OVAL-DATA",
    displayName: "OVAL-DATA",
    type: "Alphanumeric",
    status: "Approved",
    country: "GH",
    notes: "Production telemetry and data dispatches",
  },
  {
    id: "snd_pave360",
    senderHeader: "Pave360",
    displayName: "Pave360 Main",
    type: "Alphanumeric",
    status: "Approved",
    country: "GH",
    notes: "Primary transaction sender",
  },
]

export function SenderIdsView() {
  const { data: remoteSenders, isLoading } = useSenderIds()
  const registerMutation = useRegisterSenderId()
  const deleteMutation = useDeleteSenderId()

  const [localSenders, setLocalSenders] = React.useState<SenderIdRecord[]>(() => {
    try {
      const saved = localStorage.getItem("pave360_vas_sender_ids")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => {
            const header = item.senderHeader || item.senderId || item.header || item.name || "SENDER"
            return {
              id: String(item.id || `snd_${header}`),
              senderHeader: String(header),
              displayName: String(item.displayName || header),
              type: item.type || "Alphanumeric",
              status: item.status || "Approved",
              country: item.country || "GH",
              carriers: item.carriers,
              notes: item.notes || item.purpose || "",
            }
          })
        }
      }
    } catch {}
    return INITIAL_SENDERS
  })

  // Selected for Edit & Modal Visibility
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false)
  const [editingSender, setEditingSender] = React.useState<SenderIdRecord | null>(null)

  // Remote data takes priority; merge with seed and local state
  const displayedSenders: SenderIdRecord[] = React.useMemo(() => {
    const listToProcess = (remoteSenders && remoteSenders.length > 0) ? remoteSenders : localSenders

    const mapped: SenderIdRecord[] = (listToProcess || []).map((item: any) => {
      const header = String(item.senderHeader || item.senderId || item.header || item.name || item.id || "SENDER")
      return {
        id: String(item.id || item.senderId || `snd_${header}`),
        senderHeader: header,
        displayName:
          item.displayName ||
          (header === "Pave360"
            ? "Pave360 Main"
            : header === "OVAL-DATA"
            ? "OVAL-DATA"
            : header),
        type: item.type || "Alphanumeric",
        status: item.status || "Approved",
        country: item.country || "GH",
        carriers: item.carriers,
        notes: item.notes || item.purpose || "",
      }
    })

    // Merge with default seed if missing
    for (const seed of INITIAL_SENDERS) {
      const seedHeader = (seed.senderHeader || "").toLowerCase()
      if (!mapped.some((m) => (m?.senderHeader || "").toLowerCase() === seedHeader)) {
        mapped.push(seed)
      }
    }
    return mapped
  }, [remoteSenders, localSenders])

  // Check URL query param for direct sender linking
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get("id") || params.get("senderId")
    if (idParam && !editingSender && displayedSenders.length > 0) {
      const found = displayedSenders.find(
        (s) => s.id === idParam || (s.senderHeader || "").toLowerCase() === idParam.toLowerCase()
      )
      if (found) {
        setEditingSender(found)
      }
    }
  }, [displayedSenders, editingSender])

  const saveLocalSenders = (list: SenderIdRecord[]) => {
    setLocalSenders(list)
    try {
      localStorage.setItem("pave360_vas_sender_ids", JSON.stringify(list))
    } catch {}
  }

  const handleRegisterSubmit = async (formData: RegisterSenderFormData) => {
    try {
      if (env.isLive) {
        await registerMutation.mutateAsync({
          senderId: formData.senderHeader.trim(),
          purpose: formData.notes.trim(),
          type: formData.type,
          country: formData.country,
        })
      }

      const newSender: SenderIdRecord = {
        id: `snd_${Date.now()}_${formData.senderHeader.trim().toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        senderHeader: formData.senderHeader.trim(),
        displayName: formData.displayName.trim() || formData.senderHeader.trim(),
        type: formData.type,
        country: formData.country.trim() || "GH",
        status: formData.status || "Approved",
        notes: formData.notes.trim(),
      }

      saveLocalSenders([newSender, ...displayedSenders])
      recordVasActivity({
        action: "sender_id.register",
        entity: "SenderID",
        summary: `Sender ID '${formData.senderHeader.trim()}' registered`,
      })
      toast.success(`Sender ID '${formData.senderHeader.trim()}' registered successfully`)
      setIsRegisterOpen(false)
    } catch (err: any) {
      toast.error(err?.message || "Failed to register Sender ID")
    }
  }

  const handleEditSubmit = (updated: SenderIdRecord) => {
    const list = displayedSenders.map((s) => (s.id === updated.id ? updated : s))
    saveLocalSenders(list)
    setEditingSender(null)
    toast.success(`Sender ID '${updated.senderHeader}' updated`)
  }

  const handleDelete = async (id: string) => {
    const target = displayedSenders.find((s) => s.id === id)
    if (!window.confirm(`Delete Sender ID '${target?.senderHeader || id}'?`)) return

    try {
      if (env.isLive) {
        await deleteMutation.mutateAsync(id)
      }
      const filtered = displayedSenders.filter((s) => s.id !== id)
      saveLocalSenders(filtered)
      recordVasActivity({
        action: "sender_id.delete",
        entity: "SenderID",
        summary: `Sender ID '${target?.senderHeader || id}' removed`,
      })
      toast.success(`Sender ID '${target?.senderHeader || id}' deleted`)
      if (editingSender?.id === id) setEditingSender(null)
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete Sender ID")
    }
  }

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      <SenderIdsHeader onOpenRegister={() => setIsRegisterOpen(true)} />

      <SenderIdsTable
        senders={displayedSenders}
        isLoading={isLoading}
        onEdit={(s) => setEditingSender(s)}
        onDelete={handleDelete}
      />

      <RegisterSenderModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={handleRegisterSubmit}
        isSubmitting={registerMutation.isPending}
      />

      <EditSenderModal
        sender={editingSender}
        isOpen={Boolean(editingSender)}
        onClose={() => setEditingSender(null)}
        onSubmit={handleEditSubmit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export const TrafficSenderIdsView = SenderIdsView
export default SenderIdsView
