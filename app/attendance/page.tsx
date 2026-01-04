"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockAttendance } from "@/lib/mock-data"
import { CalendarIcon, MapPin, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { AttendanceCalendar } from "@/components/attendance-calendar"
import { GeoHazriMap } from "@/components/geo-hazri-map"
import { GeoCheckIn } from "@/components/geo-checkin"

export default function AttendancePage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const userAttendance = mockAttendance.filter((a) => a.employeeId === user?.employeeId)

  const selectedDateAttendance = userAttendance.find((a) => a.date === selectedDate?.toISOString().split("T")[0])

  const totalDays = userAttendance.length
  const presentDays = userAttendance.filter((a) => a.status === "present").length
  const geoCompliantDays = userAttendance.filter((a) => a.geoHazriCompliant).length
  const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0
  const geoHazriRate = totalDays > 0 ? (geoCompliantDays / totalDays) * 100 : 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance & Geo-Hazri</h1>
        <p className="text-muted-foreground mt-1">Track your attendance and location compliance</p>
      </div>

      <GeoCheckIn />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDays}</div>
            <p className="text-xs text-muted-foreground mt-1">Recorded this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentDays}</div>
            <p className="text-xs text-muted-foreground mt-1">{attendanceRate.toFixed(1)}% attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Geo-Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{geoCompliantDays}</div>
            <p className="text-xs text-muted-foreground mt-1">{geoHazriRate.toFixed(1)}% compliance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{totalDays - geoCompliantDays}</div>
            <p className="text-xs text-muted-foreground mt-1">Location violations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceCalendar attendance={userAttendance} onDateSelect={setSelectedDate} />

        <Card>
          <CardHeader>
            <CardTitle>Attendance Details</CardTitle>
            <CardDescription>
              {selectedDate
                ? selectedDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Select a date"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateAttendance ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    {selectedDateAttendance.status === "present" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className="font-medium">
                      {selectedDateAttendance.status.charAt(0).toUpperCase() + selectedDateAttendance.status.slice(1)}
                    </span>
                  </div>
                  <Badge variant={selectedDateAttendance.geoHazriCompliant ? "default" : "destructive"}>
                    {selectedDateAttendance.geoHazriCompliant ? "Geo-Compliant" : "Non-Compliant"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Check-in Time</p>
                      <p className="text-sm text-muted-foreground">{selectedDateAttendance.checkIn}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Check-out Time</p>
                      <p className="text-sm text-muted-foreground">{selectedDateAttendance.checkOut}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDateAttendance.location.lat.toFixed(4)},{" "}
                        {selectedDateAttendance.location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                {!selectedDateAttendance.geoHazriCompliant && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Geo-Hazri Violation</p>
                      <p className="text-xs text-muted-foreground">
                        Check-in location was outside the assigned geo-fenced area
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground text-center">
                  {selectedDate ? "No attendance record for this date" : "Select a date to view details"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <GeoHazriMap attendance={userAttendance} />
    </div>
  )
}
