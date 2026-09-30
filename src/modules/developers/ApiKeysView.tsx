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
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from "../../shared/hooks/useApiKeys"
import { env } from "../../shared/config/env"
import { useAppSelector } from "../../shared/store"

// Re-export types for backward compatibility
export * from "./api-keys/types"

const STORAGE_KEY = "pave360_vas_api_keys"

export function ApiKeysView() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)
  const { data: apiKeysData, isLoading } = useApiKeys()
  const createApiKeyMutation = useCreateApiKey()
  const revokeApiKeyMutation = useRevokeApiKey()

  // Load keys from localStorage or fallback to INITIAL_API_KEYS
  const [localKeys, setLocalKeys] = React.useState<ApiKeyRecord[]>(() => {
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
  const saveLocalKeys = (keys: ApiKeyRecord[]) => {
    setLocalKeys(keys)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
    } catch {
      // Ignore storage errors
    }
  }

  const apiKeys = React.useMemo<ApiKeyRecord[]>(() => {
    if (apiKeysData && Array.isArray(apiKeysData) && apiKeysData.length > 0) {
      return apiKeysData.map((k) => ({
        id: k.id,
        name: k.name,
        prefix: k.keyPrefix || "sk_live_...",
        scopes: k.scopes || ["messages.read", "messages.send"],
        mode: k.isSandbox ? "Sandbox" : "Live",
        status: k.isRevoked ? "Revoked" : "Active",
        lastUsed: k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString() : "Never",
        tenant: "Platform",
        expiresAt: k.expiresAt,
        createdAt: k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "",
      }))
    }
    if (!env.isLive || !signedIn) {
      return localKeys
    }
    return localKeys.length > 0 ? localKeys : INITIAL_API_KEYS
  }, [apiKeysData, localKeys, signedIn])

  // Handle Create API Key
  const handleCreateKey = async (newKey: ApiKeyRecord, secretKey: string) => {
    let finalSecret = secretKey
    if (env.isLive && signedIn) {
      try {
        const res = await createApiKeyMutation.mutateAsync({
          name: newKey.name,
          scopes: newKey.scopes,
          isSandbox: newKey.mode === "Sandbox",
          expiresAt: newKey.expiresAt,
          notes: newKey.notes,
        })
        if (res?.apiKey) {
          finalSecret = res.apiKey
        }
      } catch {
        // fallback to client-generated secret
      }
    }

    const updated = [newKey, ...apiKeys]
    saveLocalKeys(updated)
    setIsCreateOpen(false)
    setRevealedSecret({
      secret: finalSecret,
      name: newKey.name,
    })
    recordVasActivity({
      action: "apikey.create",
      entity: "API Key",
      summary: `API Key '${newKey.name}' generated (${newKey.prefix}...)`,
    })
  }

  // Handle Revoke API Key confirmation
  const handleRevokeConfirm = async (keyId: string) => {
    if (env.isLive && signedIn) {
      try {
        await revokeApiKeyMutation.mutateAsync(keyId)
      } catch {
        // fallback
      }
    }

    const targetKey = apiKeys.find((k) => k.id === keyId)
    const updated = apiKeys.map((k) =>
      k.id === keyId ? { ...k, status: "Revoked" as const } : k
    )
    saveLocalKeys(updated)
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
      {Boolean(isLoading && env.isLive && (!apiKeysData || (apiKeysData as any[])?.length === 0)) ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-12 text-center">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-3" />
          <p className="text-xs text-slate-500 font-medium">Retrieving active API authentication tokens...</p>
        </div>
      ) : (
        <ApiKeysTable
          apiKeys={apiKeys}
          onRevokeClick={(key) => setKeyToRevoke(key)}
        />
      )}

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
