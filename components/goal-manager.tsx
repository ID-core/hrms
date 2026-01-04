"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import type { Goal } from "@/types"
import { Plus, Target } from "lucide-react"

interface GoalManagerProps {
  goals: Goal[]
}

export function GoalManager({ goals }: GoalManagerProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    description: "",
    targetDate: "",
    status: "not-started" as const,
  })

  const handleAddGoal = () => {
    console.log("[v0] Adding new goal:", newGoal)
    setIsAddingGoal(false)
    setNewGoal({ description: "", targetDate: "", status: "not-started" })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Your Goals for 2024</h3>
          <p className="text-sm text-muted-foreground">Track and manage your performance objectives</p>
        </div>
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
              <DialogDescription>Create a new performance objective for this appraisal cycle</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Goal Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>
              <Button onClick={handleAddGoal} className="w-full">
                Add Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1">
                  <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <CardTitle className="text-base leading-relaxed">{goal.description}</CardTitle>
                    <CardDescription className="mt-1">Target: {goal.targetDate}</CardDescription>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(goal.status)}>{goal.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {goal.selfRating && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">Self Rating</Label>
                    <span className="text-sm font-medium">{goal.selfRating}/10</span>
                  </div>
                  <Progress value={goal.selfRating * 10} />
                </div>
              )}
              {goal.managerRating && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">Manager Rating</Label>
                    <span className="text-sm font-medium">{goal.managerRating}/10</span>
                  </div>
                  <Progress value={goal.managerRating * 10} />
                </div>
              )}
              {!goal.selfRating && (
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Rate This Goal
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {goals.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No goals yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Start by adding your first performance objective
              </p>
              <Button onClick={() => setIsAddingGoal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
