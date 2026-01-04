"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Transfer, User } from "@/types"
import { MapPin, CheckCircle2, XCircle } from "lucide-react"

interface TransferQueueProps {
  transfers: Transfer[]
  employees: User[]
}

export function TransferQueue({ transfers, employees }: TransferQueueProps) {
  const getEmployee = (employeeId: string) => employees.find((e) => e.employeeId === employeeId)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Request Queue</CardTitle>
        <CardDescription>Review and approve employee transfer requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transfers.map((transfer) => {
            const employee = getEmployee(transfer.employeeId)
            return (
              <div key={transfer.id} className="p-4 rounded-lg border space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">{employee?.name}</h4>
                      <p className="text-sm text-muted-foreground">{employee?.designation}</p>
                      <p className="text-xs text-muted-foreground mt-1">ID: {transfer.employeeId}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      transfer.status === "approved"
                        ? "default"
                        : transfer.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {transfer.status}
                  </Badge>
                </div>

                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{transfer.fromLocation}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{transfer.toLocation}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Reason</p>
                  <p className="text-sm text-muted-foreground">{transfer.reason}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Request Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transfer.requestDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Transfer Priority Score</span>
                    <span className={`text-lg font-bold ${getScoreColor(transfer.score)}`}>{transfer.score}/100</span>
                  </div>
                  <Progress value={transfer.score} />
                  <p className="text-xs text-muted-foreground">
                    Based on performance ({employee?.employeeId}), attendance, and organizational needs
                  </p>
                </div>

                {transfer.status === "pending" && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button size="sm" className="flex-1">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            )
          })}

          {transfers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">No transfer requests to review</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
