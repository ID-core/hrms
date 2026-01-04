"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockAppraisals, mockAttendance, mockTransfers, mockLeaves } from "@/lib/mock-data"
import { Calendar, TrendingUp, MapPin, FileText, CheckCircle2, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  const userAppraisal = mockAppraisals.find((a) => a.employeeId === user?.employeeId)
  const userAttendance = mockAttendance.filter((a) => a.employeeId === user?.employeeId)
  const userTransfers = mockTransfers.filter((t) => t.employeeId === user?.employeeId)
  const userLeaves = mockLeaves.filter((l) => l.employeeId === user?.employeeId)

  const attendanceRate =
    userAttendance.length > 0
      ? (userAttendance.filter((a) => a.status === "present").length / userAttendance.length) * 100
      : 0

  const geoHazriCompliance = userAppraisal?.geoHazriCompliance || 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">Here's your performance overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAppraisal?.finalScore || 0}/100</div>
            <p className="text-xs text-muted-foreground mt-1">
              {userAppraisal?.status === "completed" ? "Completed for 2024" : "In progress"}
            </p>
            <Progress value={userAppraisal?.finalScore || 0} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">{userAttendance.length} days recorded</p>
            <Progress value={attendanceRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Geo-Hazri Compliance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{geoHazriCompliance}%</div>
            <p className="text-xs text-muted-foreground mt-1">Location verification rate</p>
            <Progress value={geoHazriCompliance} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userTransfers.filter((t) => t.status === "pending").length +
                userLeaves.filter((l) => l.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requests awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userLeaves.slice(0, 3).map((leave) => (
              <div key={leave.id} className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Leave Application</p>
                  <p className="text-xs text-muted-foreground">
                    {leave.type} leave from {leave.fromDate} to {leave.toDate}
                  </p>
                  <Badge
                    variant={
                      leave.status === "approved"
                        ? "default"
                        : leave.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                    className="mt-1"
                  >
                    {leave.status}
                  </Badge>
                </div>
              </div>
            ))}

            {userTransfers.slice(0, 2).map((transfer) => (
              <div key={transfer.id} className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Transfer Request</p>
                  <p className="text-xs text-muted-foreground">
                    {transfer.fromLocation} → {transfer.toLocation}
                  </p>
                  <Badge
                    variant={
                      transfer.status === "approved"
                        ? "default"
                        : transfer.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                    className="mt-1"
                  >
                    {transfer.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Goals</CardTitle>
            <CardDescription>Your current objectives for 2024</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userAppraisal?.goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-relaxed">{goal.description}</p>
                  <Badge
                    variant={
                      goal.status === "completed" ? "default" : goal.status === "in-progress" ? "secondary" : "outline"
                    }
                  >
                    {goal.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Target: {goal.targetDate}</p>
                {goal.selfRating && (
                  <div className="flex items-center gap-2">
                    <Progress value={goal.selfRating * 10} className="flex-1" />
                    <span className="text-xs text-muted-foreground">{goal.selfRating}/10</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
