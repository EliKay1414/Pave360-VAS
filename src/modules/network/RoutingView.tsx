import * as React from "react"
import { toast } from "sonner"
import { RoutingHeader } from "./routing/components/RoutingHeader"
import { RoutingTable } from "./routing/components/RoutingTable"
import { RouteFormModal } from "./routing/components/RouteFormModal"
import { DeleteRouteModal } from "./routing/components/DeleteRouteModal"
import {
  useRoutes,
  useCreateRoute,
  useUpdateRoute,
  useDeleteRoute,
} from "../../shared/hooks/useNetworkRouting"
import { useCarriers } from "../../shared/hooks/useNetworkCarriers"
import { useConnections } from "../../shared/hooks/useNetworkConnections"
import type { RouteListItemViewModel } from "../../shared/services/vas/types"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"
import { env } from "../../shared/config/env"
import type { RouteRule, RouteFormData } from "./routing/types"

export type { RouteRule } from "./routing/types"

const STORAGE_KEY = "pave360_vas_routes_data"

const DEFAULT_ROUTES: RouteRule[] = [
  {
    id: "1",
    name: "Ghana Local MTN Priority",
    description: "Routes all Ghana MTN prefixes to MTN SMPP direct bind",
    priority: 10,
    enabled: true,
    criteriaType: "Prefix",
    criteriaValue: "23324, 23354, 23355, 23359",
    primaryCarrier: "MTN Ghana SMSC",
    primaryConnection: "MTN Ghana SMSC",
    secondaryCarrier: "AT Ghana SMSC",
    secondaryConnection: "AT Ghana SMSC",
    matchCount: 142080,
  },
]

function mapApiRoute(item: RouteListItemViewModel): RouteRule {
  return {
    id: item.id,
    name: item.name,
    description: "",
    priority: item.priority ?? 10,
    enabled: item.isEnabled ?? true,
    criteriaType: "Prefix",
    criteriaValue: "",
    primaryCarrier: item.primaryCarrierName || "Primary Carrier",
    primaryConnection: item.primaryCarrierName || "Primary Bind",
    secondaryCarrier: item.secondaryCarrierName,
    secondaryConnection: item.secondaryCarrierName,
    matchCount: item.ruleCount ?? 0,
  }
}

export function RoutingView() {
  const { data: liveRoutes, isLoading, isFetching, refetch } = useRoutes()
  const { data: liveCarriers } = useCarriers()
  const { data: liveConnections } = useConnections()
  const createRouteMutation = useCreateRoute()
  const updateRouteMutation = useUpdateRoute()
  const deleteRouteMutation = useDeleteRoute()

  const [routes, setRoutes] = React.useState<RouteRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return DEFAULT_ROUTES
  })

  const displayedRoutes = React.useMemo(() => {
    if (env.isLive && liveRoutes) {
      return liveRoutes.map(mapApiRoute)
    }
    return env.isLive ? [] : routes
  }, [liveRoutes, routes])

  const carrierOptions = React.useMemo(() => {
    if (liveCarriers && liveCarriers.length > 0) {
      return liveCarriers.map((c) => c.name || c.code)
    }
    return ["AT Ghana SMSC", "MTN Ghana SMSC", "Telecel Ghana Core", "Hubtel Aggregator"]
  }, [liveCarriers])

  const connectionOptions = React.useMemo(() => {
    if (liveConnections && liveConnections.length > 0) {
      return liveConnections.map((c) => c.name)
    }
    return ["AT Ghana SMSC", "MTN Primary SMPP", "Telecel GH Bind"]
  }, [liveConnections])

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create")
  const [currentRoute, setCurrentRoute] = React.useState<RouteRule | null>(null)
  const [deleteConfirmTarget, setDeleteConfirmTarget] = React.useState<RouteRule | null>(null)

  const saveRoutes = (updated: RouteRule[]) => {
    setRoutes(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {}
  }

  const handleOpenCreate = () => {
    setModalMode("create")
    setCurrentRoute(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (route: RouteRule) => {
    setModalMode("edit")
    setCurrentRoute(route)
    setIsModalOpen(true)
  }

  // Check URL query param for direct route linking
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get("id") || params.get("routeId")
    if (idParam && !currentRoute && displayedRoutes.length > 0) {
      const found = displayedRoutes.find((r) => r.id === idParam)
      if (found) {
        handleOpenEdit(found)
      }
    }
  }, [displayedRoutes, currentRoute])

  const handleFormSubmit = async (formData: RouteFormData) => {
    try {
      if (modalMode === "create") {
        if (env.isLive) {
          await createRouteMutation.mutateAsync({
            name: formData.name.trim(),
            description: formData.description.trim(),
            priority: formData.priority,
            isEnabled: formData.enabled,
            primaryCarrierId: formData.primaryCarrier || "1",
            primaryConnectionId: formData.primaryConnection || "1",
            secondaryCarrierId: formData.secondaryCarrier || undefined,
            secondaryConnectionId: formData.secondaryConnection || undefined,
          })
        }
        const newRoute: RouteRule = {
          id: `route_${Date.now()}`,
          ...formData,
          matchCount: 0,
        }
        saveRoutes([...routes, newRoute])
        recordVasActivity({
          action: "routing.create",
          entity: "RoutingRule",
          summary: `Routing rule '${formData.name.trim()}' created (Priority: ${formData.priority})`,
        })
        toast.success(`Route rule '${formData.name.trim()}' created`)
      } else if (modalMode === "edit" && currentRoute) {
        if (env.isLive) {
          await updateRouteMutation.mutateAsync({
            id: currentRoute.id,
            payload: {
              name: formData.name.trim(),
              description: formData.description.trim(),
              priority: formData.priority,
              isEnabled: formData.enabled,
              primaryCarrierId: formData.primaryCarrier || "1",
              primaryConnectionId: formData.primaryConnection || "1",
              secondaryCarrierId: formData.secondaryCarrier || undefined,
              secondaryConnectionId: formData.secondaryConnection || undefined,
            },
          })
        }
        const updated = routes.map((r) =>
          r.id === currentRoute.id ? { ...r, ...formData } : r
        )
        saveRoutes(updated)
        recordVasActivity({
          action: "routing.update",
          entity: "RoutingRule",
          summary: `Routing rule '${formData.name.trim()}' updated`,
        })
        toast.success(`Route rule '${formData.name.trim()}' updated`)
      }
      setIsModalOpen(false)
    } catch (err: any) {
      toast.error(err?.message || "Failed to save route rule")
    }
  }

  const handleDeleteConfirm = async (target: RouteRule) => {
    try {
      if (env.isLive) {
        await deleteRouteMutation.mutateAsync(target.id)
      }
      saveRoutes(routes.filter((r) => r.id !== target.id))
      recordVasActivity({
        action: "routing.delete",
        entity: "RoutingRule",
        summary: `Routing rule '${target.name}' removed`,
      })
      toast.success(`Route rule '${target.name}' deleted`)
      setDeleteConfirmTarget(null)
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete route rule")
    }
  }

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      <RoutingHeader
        onOpenCreate={handleOpenCreate}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      <RoutingTable
        routes={displayedRoutes}
        isLoading={env.isLive && isLoading}
        onEdit={handleOpenEdit}
        onDelete={(r) => setDeleteConfirmTarget(r)}
      />

      <RouteFormModal
        isOpen={isModalOpen}
        modalMode={modalMode}
        currentRoute={currentRoute}
        carrierOptions={carrierOptions}
        connectionOptions={connectionOptions}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createRouteMutation.isPending || updateRouteMutation.isPending}
      />

      <DeleteRouteModal
        target={deleteConfirmTarget}
        onClose={() => setDeleteConfirmTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteRouteMutation.isPending}
      />
    </div>
  )
}
