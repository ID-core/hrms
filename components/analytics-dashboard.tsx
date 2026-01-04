"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockUsers, mockAppraisals, mockAttendance } from "@/lib/mock-data"
import { TrendingUp, Users, Calendar, MapPin } from "lucide-react"

export function AnalyticsDashboard() {
  const employees = mockUsers.filter((u) => u.role === "employee")

  const departmentStats = employees.reduce(
    (acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const avgPerformanceScore = mockAppraisals.reduce((acc, a) => acc + a.finalScore, 0) / (mockAppraisals.length || 1)

  const performanceDistribution = {
    excellent: mockAppraisals.filter((a) => a.finalScore >= 85).length,
    good: mockAppraisals.filter((a) => a.finalScore >= 70 && a.finalScore < 85).length,
    average: mockAppraisals.filter((a) => a.finalScore >= 50 && a.finalScore < 70).length,
    poor: mockAppraisals.filter((a) => a.finalScore < 50).length,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>Organization-wide performance metrics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Avg Performance</span>
              </div>
              <p className="text-2xl font-bold">{avgPerformanceScore.toFixed(1)}%</p>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Top Performers</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{performanceDistribution.excellent}</p>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Attendance Rate</span>
              </div>
              <p className="text-2xl font-bold">
                {(
                  (mockAttendance.filter((a) => a.status === "present").length / (mockAttendance.length || 1)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Geo Compliance</span>
              </div>
              <p className="text-2xl font-bold">
                {(
                  (mockAttendance.filter((a) => a.geoHazriCompliant).length / (mockAttendance.length || 1)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
            <CardDescription>Employee performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Excellent (85-100)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{
                        width: `${(performanceDistribution.excellent / mockAppraisals.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{performanceDistribution.excellent}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Good (70-84)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(performanceDistribution.good / mockAppraisals.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{performanceDistribution.good}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Average (50-69)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-600"
                      style={{
                        width: `${(performanceDistribution.average / mockAppraisals.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{performanceDistribution.average}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Needs Improvement (&lt;50)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600"
                      style={{
                        width: `${(performanceDistribution.poor / mockAppraisals.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{performanceDistribution.poor}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Employee distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(departmentStats).map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-sm">{dept}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(count / employees.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
