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

export function AlarmsView() {
  const [currentFilter, setCurrentFilter] = useState<AlertFilter>("all")
  const [rules] = useState(INITIAL_ALERT_RULES)
  const [events, setEvents] = useState(INITIAL_ALERT_EVENTS)

  const filteredEvents = useMemo(() => {
    if (currentFilter === "all") return events
    return events.filter(
      (evt) => evt.status.toLowerCase() === currentFilter.toLowerCase()
    )
  }, [events, currentFilter])

  const handleAcknowledge = (id: string) => {
    const target = events.find((e) => e.id === id)
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Acknowledged" } : e))
    )
    recordVasActivity({
      action: "alarm.acknowledge",
      entity: "Alarm",
      summary: `Alert '${target?.title || id}' acknowledged by operator`,
    })
  }

  const handleResolve = (id: string) => {
    const target = events.find((e) => e.id === id)
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Resolved" } : e))
    )
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
