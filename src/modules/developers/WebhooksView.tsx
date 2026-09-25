import * as React from "react"
import {
  INITIAL_WEBHOOKS,
  WebhooksHeader,
  WebhooksTable,
  CreateWebhookModal,
  type WebhookRecord,
} from "./webhooks"

// Re-export types for backward compatibility
export * from "./webhooks/types"

const STORAGE_KEY = "pave360_vas_webhooks"

export function WebhooksView() {
  // Load webhooks from localStorage or fallback to INITIAL_WEBHOOKS
  const [webhooks, setWebhooks] = React.useState<WebhookRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // Fallback
    }
    return INITIAL_WEBHOOKS
  })

  // Modal open/close state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Save to localStorage whenever webhooks change
  const saveWebhooks = (items: WebhookRecord[]) => {
    setWebhooks(items)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Ignore storage errors
    }
  }

  // Handle Create Webhook
  const handleCreateWebhook = (newWebhook: WebhookRecord) => {
    const updated = [newWebhook, ...webhooks]
    saveWebhooks(updated)
    setIsCreateOpen(false)
  }

  // Handle Delete Webhook
  const handleDeleteWebhook = (webhook: WebhookRecord) => {
    const updated = webhooks.filter((w) => w.id !== webhook.id)
    saveWebhooks(updated)
  }

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* 1. Header with Title, Status Pill, and Create Button */}
      <WebhooksHeader onCreateClick={() => setIsCreateOpen(true)} />

      {/* 2. Webhooks Table / Empty State Card */}
      <WebhooksTable
        webhooks={webhooks}
        onDeleteClick={handleDeleteWebhook}
      />

      {/* 3. Create Webhook Modal */}
      <CreateWebhookModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateWebhook}
      />
    </div>
  )
}

export const VasWebhooksView = WebhooksView
export default WebhooksView
