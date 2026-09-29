import * as React from "react"
import { toast } from "sonner"
import {
  SenderIdsHeader,
} from "./sender-ids/components/SenderIdsHeader"
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
    id: "pave360",
    senderHeader: "Pave360",
    displayName: "Pave360 Main",
    type: "Alphanumeric",
    status: "Approved",
    country: "GH",
    notes: "Primary transaction sender",
  },
]

export function SenderIdsView() {
  const { data: remoteSenders, isLoading, refetch, isFetching } = useSenderIds()
  const registerMutation = useRegisterSenderId()
  const deleteMutation = useDeleteSenderId()

  const [localSenders, setLocalSenders] = React.useState<SenderIdRecord[]>(() => {
    try {
      const saved = localStorage.getItem("pave360_vas_sender_ids")
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback
    }
    return INITIAL_SENDERS
  })

  // Selected for Edit & Modal Visibility
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false)
  const [editingSender, setEditingSender] = React.useState<SenderIdRecord | null>(null)

  // Remote data takes priority; only fallback to local if not live or query failed
  const displayedSenders: SenderIdRecord[] = React.useMemo(() => {
    if (env.isLive && remoteSenders) {
      return remoteSenders.map((item) => ({
        id: item.id || item.senderId,
        senderHeader: item.senderId,
        displayName: item.senderId,
        type: item.type || "Alphanumeric",
        status: item.status || "Pending",
        country: item.country || "GH",
        carriers: item.carriers,
        notes: item.purpose,
      }))
    }
    return localSenders
  }, [remoteSenders, localSenders])

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
          purpose: formData.purpose.trim(),
          documentUrl: formData.documentUrl.trim(),
          type: formData.type,
          country: formData.country,
        })
      }

      const newSender: SenderIdRecord = {
        id: formData.senderHeader.trim().toLowerCase().replace(/[^a-z0-9]/g, "_"),
        senderHeader: formData.senderHeader.trim(),
        displayName: formData.displayName.trim() || formData.senderHeader.trim(),
        type: formData.type,
        country: formData.country.trim() || "GH",
        status: "Pending",
        notes: formData.notes.trim(),
      }
      saveLocalSenders([...localSenders, newSender])
      recordVasActivity({
        action: "sender_id.register",
        entity: "SenderID",
        summary: `Sender ID '${formData.senderHeader.trim()}' submitted for regulatory review`,
      })
      toast.success(`Sender ID '${formData.senderHeader.trim()}' submitted successfully`)
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
      saveLocalSenders(displayedSenders.filter((s) => s.id !== id))
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
      <SenderIdsHeader
        onOpenRegister={() => setIsRegisterOpen(true)}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      <SenderIdsTable
        senders={displayedSenders}
        isLoading={env.isLive && isLoading}
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
