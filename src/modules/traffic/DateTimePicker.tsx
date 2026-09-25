import * as React from "react"
import { Calendar, ArrowUp, ArrowDown } from "lucide-react"

export interface DateTimePickerProps {
  value: string // e.g. "08/26/2026 03:52 PM"
  onChange: (value: string) => void
  label: string
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

const HOURS_LIST = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
]

// Generate minutes list 00-59
const MINUTES_LIST = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
)

export function DateTimePicker({ value, onChange, label }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Parse value string: "MM/DD/YYYY hh:mm A"
  const parsed = React.useMemo(() => {
    const parts = value.match(
      /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})\s+(AM|PM)$/i
    )
    if (parts) {
      return {
        month: parseInt(parts[1], 10) - 1, // 0-indexed
        day: parseInt(parts[2], 10),
        year: parseInt(parts[3], 10),
        hour: parts[4],
        minute: parts[5],
        period: parts[6].toUpperCase() as "AM" | "PM",
      }
    }
    const now = new Date()
    return {
      month: now.getMonth(),
      day: now.getDate(),
      year: now.getFullYear(),
      hour: "03",
      minute: "52",
      period: "PM" as const,
    }
  }, [value])

  // Viewing month and year in calendar
  const [viewYear, setViewYear] = React.useState(parsed.year)
  const [viewMonth, setViewMonth] = React.useState(parsed.month)

  // Sync viewing month/year when value changes from outside
  React.useEffect(() => {
    setViewYear(parsed.year)
    setViewMonth(parsed.month)
  }, [parsed.year, parsed.month])

  // Close popup when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Format and fire onChange
  const emitChange = (
    y: number,
    m: number,
    d: number,
    h: string,
    min: string,
    p: "AM" | "PM"
  ) => {
    const mm = (m + 1).toString().padStart(2, "0")
    const dd = d.toString().padStart(2, "0")
    const formatted = `${mm}/${dd}/${y} ${h}:${min} ${p}`
    onChange(formatted)
  }

  // Previous month
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((prev) => prev - 1)
    } else {
      setViewMonth((prev) => prev - 1)
    }
  }

  // Next month
  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((prev) => prev + 1)
    } else {
      setViewMonth((prev) => prev + 1)
    }
  }

  // Compute calendar days
  const calendarDays = React.useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const days: Array<{
      day: number
      month: number
      year: number
      isCurrentMonth: boolean
    }> = []

    // Previous month padding days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear
      days.push({
        day: daysInPrevMonth - i,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({
        day: i,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
      })
    }

    // Next month padding days to complete full 6 weeks (42 cells) or 5 weeks
    const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear
      days.push({
        day: i,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
      })
    }

    return days
  }, [viewYear, viewMonth])

  // Select day
  const handleSelectDay = (cell: {
    day: number
    month: number
    year: number
  }) => {
    emitChange(
      cell.year,
      cell.month,
      cell.day,
      parsed.hour,
      parsed.minute,
      parsed.period
    )
  }

  // Select hour
  const handleSelectHour = (h: string) => {
    emitChange(
      parsed.year,
      parsed.month,
      parsed.day,
      h,
      parsed.minute,
      parsed.period
    )
  }

  // Select minute
  const handleSelectMinute = (min: string) => {
    emitChange(
      parsed.year,
      parsed.month,
      parsed.day,
      parsed.hour,
      min,
      parsed.period
    )
  }

  // Select period
  const handleSelectPeriod = (p: "AM" | "PM") => {
    emitChange(
      parsed.year,
      parsed.month,
      parsed.day,
      parsed.hour,
      parsed.minute,
      p
    )
  }

  // Handle Clear
  const handleClear = () => {
    const now = new Date()
    emitChange(
      now.getFullYear(),
      now.getMonth(),
      1,
      "12",
      "00",
      "AM"
    )
  }

  // Handle Today
  const handleToday = () => {
    const now = new Date()
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
    emitChange(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parsed.hour,
      parsed.minute,
      parsed.period
    )
  }

  return (
    <div className="space-y-1.5 font-sans" ref={containerRef}>
      <label className="block text-xs font-semibold text-slate-700">
        {label}
      </label>

      {/* Input Trigger with perfectly centered calendar icon matching screenshot */}
      <div className="relative">
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className={`h-9.5 px-3 pr-10 flex items-center justify-between text-xs font-mono rounded-lg border bg-white text-slate-800 cursor-pointer select-none transition-colors ${
            isOpen
              ? "border-[#005944] ring-1 ring-[#005944]"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="font-mono text-xs">{value}</span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-700 pointer-events-none">
            <Calendar className="h-4 w-4 stroke-[1.8]" />
          </span>
        </div>

        {/* Popover Calendar & Time Picker Dropdown matching media_1790351962673.png */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-md shadow-2xl flex flex-row overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100 select-none">
          {/* ================= LEFT PANEL: Month Calendar ================= */}
          <div className="p-3 w-60 flex flex-col justify-between">
            {/* Calendar Header: Month + Year & Nav Arrows */}
            <div className="flex items-center justify-between pb-2 mb-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <span className="text-[10px] text-slate-700">▼</span>
              </div>

              {/* Navigation Arrows matching media_1790351962677.png: Up and Down arrows */}
              <div className="flex items-center gap-1.5 text-slate-700">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 cursor-pointer"
                  title="Previous month"
                >
                  <ArrowUp className="h-3.5 w-3.5 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 cursor-pointer"
                  title="Next month"
                >
                  <ArrowDown className="h-3.5 w-3.5 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* Days of Week Row */}
            <div className="grid grid-cols-7 text-center mb-1.5">
              {DAYS_OF_WEEK.map((d) => (
                <span
                  key={d}
                  className="text-[11px] font-semibold text-slate-800"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 text-center gap-y-1">
              {calendarDays.map((cell, idx) => {
                const isSelected =
                  cell.isCurrentMonth &&
                  cell.year === parsed.year &&
                  cell.month === parsed.month &&
                  cell.day === parsed.day

                return (
                  <button
                    key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
                    type="button"
                    onClick={() => handleSelectDay(cell)}
                    className={`h-7 w-7 mx-auto flex items-center justify-center text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#0070f3] text-white font-bold border-2 border-black rounded-xs"
                        : cell.isCurrentMonth
                        ? "text-slate-900 hover:bg-slate-100 rounded-sm"
                        : "text-slate-400 hover:bg-slate-50 rounded-sm"
                    }`}
                  >
                    {cell.day}
                  </button>
                )
              })}
            </div>

            {/* Footer Buttons matching screenshot: Clear and Today */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={handleClear}
                className="text-[#0070f3] hover:underline cursor-pointer font-normal"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="text-[#0070f3] hover:underline cursor-pointer font-normal"
              >
                Today
              </button>
            </div>
          </div>

          {/* ================= RIGHT PANEL: Time Picker ================= */}
          <div className="border-l border-slate-200 p-2.5 flex flex-col w-42.5">
            {/* Top Blue Indicator Bar matching screenshot */}
            <div className="h-0.75 bg-[#0070f3] w-12 mb-2" />

            <div className="flex gap-1.5 text-xs flex-1 max-h-60">
              {/* Hours Column */}
              <div className="flex-1 overflow-y-auto max-h-58.75 pr-1 space-y-1 scrollbar-thin">
                {HOURS_LIST.map((h) => {
                  const isHourSelected = parsed.hour === h
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleSelectHour(h)}
                      className={`w-full py-1 text-center font-medium rounded-sm cursor-pointer transition-colors block ${
                        isHourSelected
                          ? "bg-[#0070f3] text-white font-bold"
                          : "text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {h}
                    </button>
                  )
                })}
              </div>

              {/* Minutes Column */}
              <div className="flex-1 overflow-y-auto max-h-58.75 pr-1 space-y-1 scrollbar-thin">
                {MINUTES_LIST.map((min) => {
                  const isMinSelected = parsed.minute === min
                  return (
                    <button
                      key={min}
                      type="button"
                      onClick={() => handleSelectMinute(min)}
                      className={`w-full py-1 text-center font-medium rounded-sm cursor-pointer transition-colors block ${
                        isMinSelected
                          ? "bg-[#0070f3] text-white font-bold"
                          : "text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {min}
                    </button>
                  )
                })}
              </div>

              {/* AM / PM Column */}
              <div className="w-10.5 space-y-1">
                <button
                  type="button"
                  onClick={() => handleSelectPeriod("PM")}
                  className={`w-full py-1.5 text-center font-bold rounded-sm cursor-pointer transition-colors block ${
                    parsed.period === "PM"
                      ? "bg-[#0070f3] text-white"
                      : "text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  PM
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPeriod("AM")}
                  className={`w-full py-1.5 text-center font-bold rounded-sm cursor-pointer transition-colors block ${
                    parsed.period === "AM"
                      ? "bg-[#0070f3] text-white"
                      : "text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  AM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default DateTimePicker
