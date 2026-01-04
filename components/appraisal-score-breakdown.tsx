"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Appraisal } from "@/types"
import { AlertCircle, CheckCircle2, MapPin } from "lucide-react"

interface AppraisalScoreBreakdownProps {
  appraisal?: Appraisal
}

export function AppraisalScoreBreakdown({ appraisal }: AppraisalScoreBreakdownProps) {
  if (!appraisal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
          <CardDescription>No appraisal data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Your appraisal has not been initiated yet.</p>
        </CardContent>
      </Card>
    )
  }

  const baseScore = (appraisal.selfScore + appraisal.managerScore + appraisal.hrScore) / 3
  const adjustedScore = baseScore + appraisal.attendanceImpact

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
        <CardDescription>How your final score is calculated</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Base Score (Average)</span>
            <span className="text-sm font-medium">{baseScore.toFixed(1)}</span>
          </div>
          <Progress value={baseScore} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-chart-1" />
            <span className="text-muted-foreground flex-1">Self Score</span>
            <span className="font-medium">{appraisal.selfScore}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-chart-2" />
            <span className="text-muted-foreground flex-1">Manager Score</span>
            <span className="font-medium">{appraisal.managerScore}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-chart-3" />
            <span className="text-muted-foreground flex-1">HR Score</span>
            <span className="font-medium">{appraisal.hrScore}</span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <h4 className="text-sm font-medium">Governance Adjustments</h4>

          <div
            className={`flex items-start gap-2 text-sm ${appraisal.attendanceImpact < 0 ? "text-destructive" : "text-green-600"}`}
          >
            {appraisal.attendanceImpact < 0 ? (
              <AlertCircle className="h-4 w-4 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mt-0.5" />
            )}
            <span className="flex-1">Attendance Impact</span>
            <span className="font-medium">
              {appraisal.attendanceImpact > 0 ? "+" : ""}
              {appraisal.attendanceImpact}
            </span>
          </div>

          <div
            className={`flex items-start gap-2 text-sm ${appraisal.geoHazriCompliance < 95 ? "text-yellow-600" : "text-green-600"}`}
          >
            <MapPin className="h-4 w-4 mt-0.5" />
            <span className="flex-1">Geo-Hazri Compliance</span>
            <span className="font-medium">{appraisal.geoHazriCompliance}%</span>
          </div>

          {appraisal.beatCoverage && (
            <div
              className={`flex items-start gap-2 text-sm ${appraisal.beatCoverage < 90 ? "text-yellow-600" : "text-green-600"}`}
            >
              <CheckCircle2 className="h-4 w-4 mt-0.5" />
              <span className="flex-1">Beat Coverage</span>
              <span className="font-medium">{appraisal.beatCoverage}%</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Final Score</span>
            <span className="text-lg font-bold">{appraisal.finalScore}</span>
          </div>
          <Progress value={appraisal.finalScore} className="h-3" />
        </div>
      </CardContent>
    </Card>
  )
}
