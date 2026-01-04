"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { mockAppraisals } from "@/lib/mock-data"
import { ClipboardCheck, TrendingUp, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { GoalManager } from "@/components/goal-manager"
import { AppraisalScoreBreakdown } from "@/components/appraisal-score-breakdown"

export default function AppraisalPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const userAppraisal = mockAppraisals.find((a) => a.employeeId === user?.employeeId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "reviewed":
        return "secondary"
      case "submitted":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "reviewed":
        return <Clock className="h-4 w-4" />
      case "submitted":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <ClipboardCheck className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Appraisal</h1>
          <p className="text-muted-foreground mt-1">Track your goals and performance ratings</p>
        </div>
        {userAppraisal && (
          <Badge variant={getStatusColor(userAppraisal.status)} className="gap-1">
            {getStatusIcon(userAppraisal.status)}
            {userAppraisal.status}
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Final Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAppraisal?.finalScore || 0}/100</div>
            <Progress value={userAppraisal?.finalScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Self Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAppraisal?.selfScore || 0}/100</div>
            <Progress value={userAppraisal?.selfScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Manager Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAppraisal?.managerScore || 0}/100</div>
            <Progress value={userAppraisal?.managerScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">HR Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAppraisal?.hrScore || 0}/100</div>
            <Progress value={userAppraisal?.hrScore || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals & Objectives</TabsTrigger>
          <TabsTrigger value="feedback">360° Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AppraisalScoreBreakdown appraisal={userAppraisal} />

            <Card>
              <CardHeader>
                <CardTitle>Performance Flags</CardTitle>
                <CardDescription>AI-detected patterns and governance alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {userAppraisal && userAppraisal.attendanceImpact < 0 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Low Attendance Impact</p>
                      <p className="text-xs text-muted-foreground">
                        Score reduced by {Math.abs(userAppraisal.attendanceImpact)} points due to attendance issues
                      </p>
                    </div>
                  </div>
                )}

                {userAppraisal && userAppraisal.geoHazriCompliance < 95 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Geo-Hazri Below Target</p>
                      <p className="text-xs text-muted-foreground">
                        Current compliance at {userAppraisal.geoHazriCompliance}%, target is 95%
                      </p>
                    </div>
                  </div>
                )}

                {userAppraisal && userAppraisal.beatCoverage && userAppraisal.beatCoverage < 90 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Beat Coverage Below Target</p>
                      <p className="text-xs text-muted-foreground">
                        Current coverage at {userAppraisal.beatCoverage}%, target is 90%
                      </p>
                    </div>
                  </div>
                )}

                {userAppraisal &&
                  userAppraisal.attendanceImpact >= 0 &&
                  userAppraisal.geoHazriCompliance >= 95 &&
                  (!userAppraisal.beatCoverage || userAppraisal.beatCoverage >= 90) && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">All Metrics on Track</p>
                        <p className="text-xs text-muted-foreground">No performance flags detected</p>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <GoalManager goals={userAppraisal?.goals || []} />
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manager Feedback</CardTitle>
              <CardDescription>Comments from your reporting manager</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Strengths</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Demonstrates excellent commitment to field duties. Consistently maintains good geo-hazri compliance
                    and beat coverage. Shows initiative in reporting issues promptly.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Areas for Improvement</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Need to improve attendance regularity. Should focus on achieving 95%+ geo-hazri compliance
                    consistently throughout the year.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HR Feedback</CardTitle>
              <CardDescription>Final assessment from HR department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Overall Assessment</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Good performance overall with strong field presence. Attendance patterns need attention. Recommended
                    for standard increment.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommendation</h4>
                  <Badge>Approved for Standard Increment</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
