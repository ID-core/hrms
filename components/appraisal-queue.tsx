"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Appraisal, User } from "@/types"
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react"

interface AppraisalQueueProps {
  appraisals: Appraisal[]
  employees: User[]
}

export function AppraisalQueue({ appraisals, employees }: AppraisalQueueProps) {
  const getEmployee = (employeeId: string) => employees.find((e) => e.employeeId === employeeId)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "reviewed":
        return <Badge variant="secondary">Under Review</Badge>
      case "submitted":
        return <Badge variant="outline">Submitted</Badge>
      default:
        return <Badge variant="outline">Draft</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appraisal Queue</CardTitle>
        <CardDescription>Review and manage employee performance appraisals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appraisals.map((appraisal) => {
            const employee = getEmployee(appraisal.employeeId)
            return (
              <div key={appraisal.id} className="p-4 rounded-lg border space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium">{employee?.name}</h4>
                    <p className="text-sm text-muted-foreground">{employee?.designation}</p>
                    <p className="text-xs text-muted-foreground mt-1">ID: {appraisal.employeeId}</p>
                  </div>
                  {getStatusBadge(appraisal.status)}
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Self Score</p>
                    <p className="text-lg font-bold">{appraisal.selfScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Manager Score</p>
                    <p className="text-lg font-bold">{appraisal.managerScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">HR Score</p>
                    <p className="text-lg font-bold">{appraisal.hrScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Final Score</p>
                    <p className="text-lg font-bold">{appraisal.finalScore}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Performance</span>
                    <span className="text-sm">{appraisal.finalScore}%</span>
                  </div>
                  <Progress value={appraisal.finalScore} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {appraisal.attendanceImpact < 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/10 text-xs">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      <span>Low Attendance</span>
                    </div>
                  )}
                  {appraisal.geoHazriCompliance < 95 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/10 text-xs">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      <span>Geo-Hazri Below Target</span>
                    </div>
                  )}
                  {appraisal.attendanceImpact >= 0 && appraisal.geoHazriCompliance >= 95 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>All Metrics Good</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Review Details
                  </Button>
                  {appraisal.status !== "completed" && (
                    <Button size="sm" className="flex-1">
                      Complete Review
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
