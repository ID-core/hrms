"use client"

import { useRef, useEffect } from "react"
import { DayButton } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Attendance } from "@/types"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface AttendanceCalendarProps {
  attendance: Attendance[]
  onDateSelect?: (date: Date | undefined) => void
}

export function AttendanceCalendar({ attendance, onDateSelect }: AttendanceCalendarProps) {
  const getAttendanceForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return attendance.find((a) => a.date === dateStr)
  }

  const modifiers = {
    present: (date: Date) => {
      const record = getAttendanceForDate(date)
      return record?.status === "present" && record.geoHazriCompliant
    },
    presentNonCompliant: (date: Date) => {
      const record = getAttendanceForDate(date)
      return record?.status === "present" && !record.geoHazriCompliant
    },
    absent: (date: Date) => {
      const record = getAttendanceForDate(date)
      return record?.status === "absent"
    },
  }

  const modifiersClassNames = {
    present: "bg-transparent",
    presentNonCompliant: "bg-transparent",
    absent: "bg-transparent",
  }

  const StatusDayButton = ({ className, day, modifiers, children, ...props }: React.ComponentProps<typeof DayButton>) => {
    const ref = useRef<HTMLButtonElement>(null)

    useEffect(() => {
      if (modifiers.focused) ref.current?.focus()
    }, [modifiers.focused])

    const statusIcon = modifiers.present ? (
      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
    ) : modifiers.presentNonCompliant ? (
      <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />
    ) : modifiers.absent ? (
      <XCircle className="h-3.5 w-3.5 text-red-600" />
    ) : null

    const dayLabel = statusIcon ? <span className="sr-only">{children}</span> : children

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        data-day={day.date.toLocaleDateString()}
        data-selected-single={
          modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
        }
        data-range-start={modifiers.range_start}
        data-range-end={modifiers.range_end}
        data-range-middle={modifiers.range_middle}
        className={cn(
          "relative data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal [&>span]:text-xs [&>span]:opacity-70",
          className,
        )}
        {...props}
      >
        {statusIcon ?? dayLabel}
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Calendar</CardTitle>
        <CardDescription>View your attendance history</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          onSelect={onDateSelect}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          components={{ DayButton: StatusDayButton }}
          className="rounded-md border"
        />
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-muted-foreground">Present & Geo-Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-muted-foreground">Present but Non-Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-muted-foreground">Absent</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
