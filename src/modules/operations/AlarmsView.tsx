import { useState, useMemo } from "react"
import type { AlertFilter } from "./alarms/types"
import {
  AlertFilterTabs,
  RulesTable,
  EventsTable,
  INITIAL_ALERT_RULES,
  INITIAL_ALERT_EVENTS,
} from "./alarms"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"

const STORAGE_KEY = "pave360_vas_alarms_events_data"

export function AlarmsView() {
  const [currentFilter, setCurrentFilter] = useState<AlertFilter>("all")
  const [rules] = useState(INITIAL_ALERT_RULES)
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      /* ignore */
    }
    return INITIAL_ALERT_EVENTS
  })

  const saveEvents = (updated: typeof INITIAL_ALERT_EVENTS) => {
    setEvents(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      /* ignore */
    }
  }

  const filteredEvents = useMemo(() => {
    if (currentFilter === "all") return events
    return events.filter(
      (evt) => evt.status.toLowerCase() === currentFilter.toLowerCase()
    )
  }, [events, currentFilter])

  const handleAcknowledge = (id: string) => {
    const target = events.find((e) => e.id === id)
    const updated = events.map((e) =>
      e.id === id ? { ...e, status: "Acknowledged" as const } : e
    )
    saveEvents(updated)
    recordVasActivity({
      action: "alarm.acknowledge",
      entity: "Alarm",
      summary: `Alert '${target?.title || id}' acknowledged by operator`,
    })
  }

  const handleResolve = (id: string) => {
    const target = events.find((e) => e.id === id)
    const updated = events.map((e) =>
      e.id === id ? { ...e, status: "Resolved" as const } : e
    )
    saveEvents(updated)
    recordVasActivity({
      action: "alarm.resolve",
      entity: "Alarm",
      summary: `Alert '${target?.title || id}' marked as resolved`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs: All, Open, Acknowledged, Resolved */}
      <AlertFilterTabs
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />

      {/* Rules Table */}
      <RulesTable rules={rules} />

      {/* Events Table */}
      <EventsTable
        events={filteredEvents}
        onAcknowledge={handleAcknowledge}
        onResolve={handleResolve}
      />
    </div>
  )
}

export const VasAlarmsView = AlarmsView
export default AlarmsView
