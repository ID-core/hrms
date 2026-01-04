"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockUsers, mockAppraisals, mockTransfers, mockLeaves, mockAttendance } from "@/lib/mock-data"
import { Users, TrendingUp, MapPin, FileText, AlertTriangle, CheckCircle2 } from "lucide-react"
import { EmployeeList } from "@/components/employee-list"
import { AppraisalQueue } from "@/components/appraisal-queue"
import { TransferQueue } from "@/components/transfer-queue"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function HRPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const totalEmployees = mockUsers.filter((u) => u.role === "employee" || u.role === "manager").length
  const pendingAppraisals = mockAppraisals.filter((a) => a.status !== "completed").length
  const pendingTransfers = mockTransfers.filter((t) => t.status === "pending").length
  const pendingLeaves = mockLeaves.filter((l) => l.status === "pending").length

  const avgAttendanceRate =
    mockUsers
      .filter((u) => u.role === "employee")
      .reduce((acc, user) => {
        const userAttendance = mockAttendance.filter((a) => a.employeeId === user.employeeId)
        const rate =
          userAttendance.length > 0
            ? (userAttendance.filter((a) => a.status === "present").length / userAttendance.length) * 100
            : 0
        return acc + rate
      }, 0) / mockUsers.filter((u) => u.role === "employee").length

  const avgGeoCompliance =
    mockUsers
      .filter((u) => u.role === "employee")
      .reduce((acc, user) => {
        const userAttendance = mockAttendance.filter((a) => a.employeeId === user.employeeId)
        const rate =
          userAttendance.length > 0
            ? (userAttendance.filter((a) => a.geoHazriCompliant).length / userAttendance.length) * 100
            : 0
        return acc + rate
      }, 0) / mockUsers.filter((u) => u.role === "employee").length

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">HR Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage employees, appraisals, and organizational workflows</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">Active workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Appraisals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingAppraisals}</div>
            <p className="text-xs text-muted-foreground mt-1">Require review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Transfer Requests</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTransfers}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingLeaves}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organizational Health</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Average Attendance Rate</span>
                <span className="text-sm font-medium">{avgAttendanceRate.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${avgAttendanceRate}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Geo-Hazri Compliance</span>
                <span className="text-sm font-medium">{avgGeoCompliance.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${avgGeoCompliance >= 95 ? "bg-green-600" : "bg-yellow-600"}`}
                  style={{ width: `${avgGeoCompliance}%` }}
                />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              {avgGeoCompliance < 95 && (
                <div className="flex items-start gap-2 text-sm text-yellow-600">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <span>Geo-hazri compliance below target (95%)</span>
                </div>
              )}
              {avgGeoCompliance >= 95 && (
                <div className="flex items-start gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4 mt-0.5" />
                  <span>All metrics within acceptable range</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Performance flags and governance issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAppraisals
              .filter((a) => a.attendanceImpact < 0 || a.geoHazriCompliance < 95)
              .slice(0, 3)
              .map((appraisal, index) => {
                const employee = mockUsers.find((u) => u.employeeId === appraisal.employeeId)
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                  >
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{employee?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {appraisal.attendanceImpact < 0 && "Low attendance"}
                        {appraisal.attendanceImpact < 0 && appraisal.geoHazriCompliance < 95 && " & "}
                        {appraisal.geoHazriCompliance < 95 && "Poor geo-hazri compliance"}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {appraisal.employeeId}
                    </Badge>
                  </div>
                )
              })}

            {mockAppraisals.filter((a) => a.attendanceImpact < 0 || a.geoHazriCompliance < 95).length === 0 && (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle2 className="h-10 w-10 text-green-600 mb-3" />
                <p className="text-sm text-muted-foreground text-center">No performance alerts at this time</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="appraisals">Appraisals</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common HR administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Start Appraisal Cycle
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  Review Transfers
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <EmployeeList employees={mockUsers.filter((u) => u.role === "employee" || u.role === "manager")} />
        </TabsContent>

        <TabsContent value="appraisals">
          <AppraisalQueue appraisals={mockAppraisals} employees={mockUsers} />
        </TabsContent>

        <TabsContent value="transfers">
          <TransferQueue transfers={mockTransfers} employees={mockUsers} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
