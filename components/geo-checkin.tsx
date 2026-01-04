"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface CheckInResult {
  status: "success" | "violation" | "error"
  message: string
  distance?: number
  location?: {
    lat: number
    lng: number
  }
  timestamp?: string
}

// Calculate distance between two coordinates using Haversine formula (in meters)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

export function GeoCheckIn() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckInResult | null>(null)

  const handleCheckIn = async () => {
    if (!user?.assignedLocation) {
      setResult({
        status: "error",
        message: "No assigned location found for your account",
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // Request location permission
      if (!navigator.geolocation) {
        setResult({
          status: "error",
          message: "Geolocation is not supported by your browser",
        })
        setLoading(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude
          const userLng = position.coords.longitude
          const assignedLat = user.assignedLocation!.lat
          const assignedLng = user.assignedLocation!.lng

          // Calculate distance in meters
          const distance = calculateDistance(userLat, userLng, assignedLat, assignedLng)

          const timestamp = new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })

          // Check if within 1km radius (1000 meters)
          if (distance <= 1000) {
            setResult({
              status: "success",
              message: "Check-in successful! You are within the valid location radius.",
              distance: Math.round(distance),
              location: { lat: userLat, lng: userLng },
              timestamp,
            })
          } else {
            setResult({
              status: "violation",
              message: "Location violation! You are outside the 1km radius of your assigned location.",
              distance: Math.round(distance),
              location: { lat: userLat, lng: userLng },
              timestamp,
            })
          }

          setLoading(false)
        },
        (error) => {
          let errorMessage = "Failed to get your location. "
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please allow location access to check-in."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable."
              break
            case error.TIMEOUT:
              errorMessage += "Location request timed out."
              break
            default:
              errorMessage += "An unknown error occurred."
              break
          }

          setResult({
            status: "error",
            message: errorMessage,
          })
          setLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } catch (error) {
      setResult({
        status: "error",
        message: "An unexpected error occurred while checking your location.",
      })
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geo-Hajiri Check-In</CardTitle>
        <CardDescription>
          {user?.assignedLocation ? `Your assigned location: ${user.assignedLocation.name}` : "No assigned location"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Valid check-in radius: Within 1 kilometer</span>
        </div>

        <Button onClick={handleCheckIn} disabled={loading || !user?.assignedLocation} className="w-full" size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Getting your location...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-5 w-5" />
              Check-In Now
            </>
          )}
        </Button>

        {result && (
          <div
            className={`p-4 rounded-lg border ${
              result.status === "success"
                ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                : result.status === "violation"
                  ? "bg-destructive/10 border-destructive/20"
                  : "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.status === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              ) : result.status === "violation" ? (
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 space-y-2">
                <p className="font-medium text-sm">{result.message}</p>
                {result.distance !== undefined && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>Distance: {result.distance}m</span>
                    </div>
                    {result.timestamp && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Time: {result.timestamp}</span>
                      </div>
                    )}
                  </div>
                )}
                {result.location && (
                  <div className="text-xs text-muted-foreground">
                    Location: {result.location.lat.toFixed(6)}, {result.location.lng.toFixed(6)}
                  </div>
                )}
                {result.status === "success" && (
                  <Badge variant="default" className="mt-2">
                    Geo-Compliant
                  </Badge>
                )}
                {result.status === "violation" && (
                  <Badge variant="destructive" className="mt-2">
                    Non-Compliant
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
