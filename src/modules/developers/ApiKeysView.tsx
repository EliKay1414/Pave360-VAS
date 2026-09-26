import * as React from "react"
import {
  INITIAL_API_KEYS,
  ApiKeysHeader,
  ApiKeysTable,
  CreateApiKeyModal,
  RevokeApiKeyModal,
  SecretRevealModal,
  type ApiKeyRecord,
} from "./api-keys"

import { recordVasActivity } from "../../shared/lib/vasActivityStore"

// Re-export types for backward compatibility
export * from "./api-keys/types"

const STORAGE_KEY = "pave360_vas_api_keys"

export function ApiKeysView() {
  // Load keys from localStorage or fallback to INITIAL_API_KEYS
  const [apiKeys, setApiKeys] = React.useState<ApiKeyRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return INITIAL_API_KEYS
  })

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [keyToRevoke, setKeyToRevoke] = React.useState<ApiKeyRecord | null>(null)
  const [revealedSecret, setRevealedSecret] = React.useState<{
    secret: string
    name: string
  } | null>(null)

  // Save to localStorage whenever keys change
  const saveKeys = (keys: ApiKeyRecord[]) => {
    setApiKeys(keys)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
    } catch {
      // Ignore storage errors
    }
  }

  // Handle Create API Key
  const handleCreateKey = (newKey: ApiKeyRecord, secretKey: string) => {
    const updated = [newKey, ...apiKeys]
    saveKeys(updated)
    setIsCreateOpen(false)
    setRevealedSecret({
      secret: secretKey,
      name: newKey.name,
    })
    recordVasActivity({
      action: "apikey.create",
      entity: "API Key",
      summary: `API Key '${newKey.name}' generated (${newKey.prefix}...)`,
    })
  }

  // Handle Revoke API Key confirmation
  const handleRevokeConfirm = (keyId: string) => {
    const targetKey = apiKeys.find((k) => k.id === keyId)
    const updated = apiKeys.map((k) =>
      k.id === keyId ? { ...k, status: "Revoked" as const } : k
    )
    saveKeys(updated)
    recordVasActivity({
      action: "apikey.revoke",
      entity: "API Key",
      summary: `API Key '${targetKey?.name || keyId}' revoked`,
    })
    setKeyToRevoke(null)
  }

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* 1. Header with title, subtitle and Create button */}
      <ApiKeysHeader onCreateClick={() => setIsCreateOpen(true)} />

      {/* 2. API Keys Presentation Table */}
      <ApiKeysTable
        apiKeys={apiKeys}
        onRevokeClick={(key) => setKeyToRevoke(key)}
      />

      {/* 3. Create API Key Modal */}
      <CreateApiKeyModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateKey}
      />

      {/* 4. Revoke Confirmation Modal */}
      <RevokeApiKeyModal
        apiKey={keyToRevoke}
        isOpen={!!keyToRevoke}
        onClose={() => setKeyToRevoke(null)}
        onConfirm={handleRevokeConfirm}
      />

      {/* 5. Secret Reveal Modal (shown once upon creation) */}
      <SecretRevealModal
        isOpen={!!revealedSecret}
        secretKey={revealedSecret?.secret || null}
        keyName={revealedSecret?.name || ""}
        onClose={() => setRevealedSecret(null)}
      />
    </div>
  )
}

export const VasApiKeysView = ApiKeysView
export default ApiKeysView
