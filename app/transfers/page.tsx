"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { mockTransfers } from "@/lib/mock-data"
import { Plus, MapPin, TrendingUp, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function TransfersPage() {
  const { user } = useAuth()
  const [isRequesting, setIsRequesting] = useState(false)
  const [newTransfer, setNewTransfer] = useState({
    fromLocation: "",
    toLocation: "",
    reason: "",
  })

  const userTransfers = mockTransfers.filter((t) => t.employeeId === user?.employeeId)

  const handleRequestTransfer = () => {
    console.log("[v0] Requesting transfer:", newTransfer)
    setIsRequesting(false)
    setNewTransfer({ fromLocation: "", toLocation: "", reason: "" })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transfer Requests</h1>
          <p className="text-muted-foreground mt-1">Request location transfers and track approvals</p>
        </div>
        <Dialog open={isRequesting} onOpenChange={setIsRequesting}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Transfer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Transfer</DialogTitle>
              <DialogDescription>Submit a new location transfer request</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fromLocation">Current Location</Label>
                <Input
                  id="fromLocation"
                  placeholder="e.g., Zone A - Karol Bagh"
                  value={newTransfer.fromLocation}
                  onChange={(e) => setNewTransfer({ ...newTransfer, fromLocation: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toLocation">Requested Location</Label>
                <Input
                  id="toLocation"
                  placeholder="e.g., Zone B - Rohini"
                  value={newTransfer.toLocation}
                  onChange={(e) => setNewTransfer({ ...newTransfer, toLocation: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Transfer</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why you need this transfer..."
                  value={newTransfer.reason}
                  onChange={(e) => setNewTransfer({ ...newTransfer, reason: e.target.value })}
                />
              </div>

              <div className="p-3 rounded-lg bg-muted">
                <h4 className="text-sm font-medium mb-2">Transfer Scoring Criteria</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Performance appraisal score</li>
                  <li>• Attendance and geo-hazri compliance</li>
                  <li>• Years of service at current location</li>
                  <li>• Departmental requirements</li>
                </ul>
              </div>

              <Button onClick={handleRequestTransfer} className="w-full">
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userTransfers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Transfer applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {userTransfers.filter((t) => t.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Successful transfers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {userTransfers.filter((t) => t.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Under review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>All your transfer requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userTransfers.map((transfer) => (
              <div key={transfer.id} className="p-4 rounded-lg border space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">Location Transfer Request</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {transfer.fromLocation} → {transfer.toLocation}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(transfer.status)} className="gap-1">
                    {getStatusIcon(transfer.status)}
                    {transfer.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium mb-1">Reason</h5>
                    <p className="text-sm text-muted-foreground">{transfer.reason}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-1">Request Date</h5>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transfer.requestDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {transfer.approvalDate && (
                    <div>
                      <h5 className="text-sm font-medium mb-1">Approval Date</h5>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transfer.approvalDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-muted space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium">Transfer Score</h5>
                      <span className={`text-lg font-bold ${getScoreColor(transfer.score)}`}>{transfer.score}/100</span>
                    </div>
                    <Progress value={transfer.score} />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mt-0.5" />
                      <span>
                        Score calculated based on performance, attendance, compliance, and organizational needs
                      </span>
                    </div>
                  </div>

                  {transfer.score < 70 && transfer.status === "pending" && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Lower Priority</p>
                        <p className="text-xs text-muted-foreground">
                          Transfer score below 70 may result in longer processing time. Improve performance metrics for
                          better priority.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {userTransfers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No transfer requests</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  You haven't requested any location transfers yet
                </p>
                <Button onClick={() => setIsRequesting(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Request Your First Transfer
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
