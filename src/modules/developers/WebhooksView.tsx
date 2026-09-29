import * as React from "react"
import { toast } from "sonner"
import {
  WebhooksHeader,
  WebhooksTable,
  CreateWebhookModal,
  type WebhookRecord,
} from "./webhooks"
import {
  useWebhooks,
  useCreateWebhook,
  useDeleteWebhook,
} from "../../shared/hooks/useWebhooks"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"
import { env } from "../../shared/config/env"

// Re-export types for backward compatibility
export * from "./webhooks/types"

const STORAGE_KEY = "pave360_vas_webhooks"

export function WebhooksView() {
  const { data: remoteWebhooks, isLoading, isFetching, refetch } = useWebhooks()
  const createMutation = useCreateWebhook()
  const deleteMutation = useDeleteWebhook()

  // Local storage fallback for offline / mock mode
  const [localWebhooks, setLocalWebhooks] = React.useState<WebhookRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {}
    return []
  })

  // Modal open/close state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Direct remote webhooks mapping: eliminates mock flash on page refresh
  const displayedWebhooks: WebhookRecord[] = React.useMemo(() => {
    if (env.isLive && remoteWebhooks) {
      return remoteWebhooks.map((w, idx) => ({
        id: w.id || `wh_${idx + 1}`,
        name: w.name || "Webhook Endpoint",
        url: w.url,
        event: (w.event as any) || "DeliveryReport",
        status: (w.status as any) || (w.enabled !== false ? "Active" : "Disabled"),
        secret: w.secret || "",
        failures: w.failures ?? 0,
        maxAttempts: w.maxAttempts ?? 5,
        timeoutSeconds: w.timeoutSeconds ?? 10,
        enabled: w.enabled ?? (w.status === "Active"),
        createdAt: w.createdAt || new Date().toISOString(),
      }))
    }
    return localWebhooks
  }, [remoteWebhooks, localWebhooks])

  const saveLocalWebhooks = (items: WebhookRecord[]) => {
    setLocalWebhooks(items)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }

  // Handle Create Webhook
  const handleCreateWebhook = async (newWebhook: WebhookRecord) => {
    try {
      if (env.isLive) {
        await createMutation.mutateAsync({
          name: newWebhook.name,
          url: newWebhook.url,
          event: newWebhook.event,
          secret: newWebhook.secret,
          enabled: newWebhook.enabled,
        })
      }
      saveLocalWebhooks([newWebhook, ...localWebhooks])
      recordVasActivity({
        action: "webhook.create",
        entity: "Webhook",
        summary: `Webhook created for '${newWebhook.url}' (${newWebhook.event})`,
      })
      toast.success(`Webhook '${newWebhook.name}' registered`)
      setIsCreateOpen(false)
    } catch (err: any) {
      toast.error(err?.message || "Failed to register webhook")
    }
  }

  // Handle Delete Webhook
  const handleDeleteWebhook = async (webhook: WebhookRecord) => {
    if (!window.confirm(`Delete webhook '${webhook.name}' (${webhook.url})?`)) return
    try {
      if (env.isLive) {
        await deleteMutation.mutateAsync(webhook.id)
      }
      saveLocalWebhooks(localWebhooks.filter((w) => w.id !== webhook.id))
      recordVasActivity({
        action: "webhook.delete",
        entity: "Webhook",
        summary: `Webhook '${webhook.url}' deleted`,
      })
      toast.success(`Webhook deleted`)
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete webhook")
    }
  }

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* 1. Header with Title, Status Pill, and Create Button */}
      <WebhooksHeader
        onCreateClick={() => setIsCreateOpen(true)}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      {/* 2. Webhooks Table / Empty State Card */}
      <WebhooksTable
        webhooks={displayedWebhooks}
        isLoading={env.isLive && isLoading}
        onDeleteClick={handleDeleteWebhook}
      />

      {/* 3. Create Webhook Modal */}
      <CreateWebhookModal
        isOpen={isCreateOpen}
        isSubmitting={createMutation.isPending}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateWebhook}
      />
    </div>
  )
}

export const VasWebhooksView = WebhooksView
export default WebhooksView
