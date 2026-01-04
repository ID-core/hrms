"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Attendance } from "@/types"
import { MapPin } from "lucide-react"

interface GeoHazriMapProps {
  attendance: Attendance[]
}

export function GeoHazriMap({ attendance }: GeoHazriMapProps) {
  const checkIns = attendance.filter((record) => record.status === "present")
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [status, setStatus] = useState<"idle" | "fetching" | "ready" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setStatus("error")
      return
    }

    setStatus("fetching")

    let cancelled = false
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus("ready")
      },
      (err) => {
        if (cancelled) return
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied"
            : err.code === err.POSITION_UNAVAILABLE
              ? "Location unavailable"
              : err.code === err.TIMEOUT
                ? "Location request timed out"
                : "Unable to get your location",
        )
        setStatus("error")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Map</CardTitle>
        <CardDescription>Check-in locations for the current period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-2">
          <h4 className="text-sm font-medium">Recent Check-ins</h4>
          {checkIns.slice(0, 5).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-2 rounded-lg bg-muted text-sm">
              <div className="flex items-center gap-2">
                <MapPin className={`h-4 w-4 ${record.geoHazriCompliant ? "text-green-600" : "text-red-600"}`} />
                <span className="text-muted-foreground">
                  {new Date(record.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {record.location.lat.toFixed(4)}, {record.location.lng.toFixed(4)}
              </span>
            </div>
          ))}
        </div>

        <div className="aspect-video rounded-lg bg-muted relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="absolute inset-4 rounded-lg border border-dashed border-primary/20" />
          <div className="absolute inset-0 pointer-events-none opacity-40" style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08), transparent 35%)," +
              "radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.08), transparent 35%)," +
              "radial-gradient(circle at 40% 80%, rgba(14, 165, 233, 0.08), transparent 35%)",
          }} />

          <div className="absolute top-3 left-3 z-10 rounded-md bg-background/80 backdrop-blur px-3 py-2 shadow-sm border text-xs font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Live location</span>
            </div>
            <div className="mt-1 text-muted-foreground">
              {status === "ready" && position && (
                <span>
                  {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
                </span>
              )}
              {status === "fetching" && <span>Getting your position…</span>}
              {status === "error" && error && <span>{error}</span>}
            </div>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-3 px-4">
            <div className="relative">
              <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/30" />
              <span className="absolute inset-1 -z-10 animate-ping rounded-full bg-primary/20" />
              <div className="h-12 w-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shadow-md">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Your location is on the map</h3>
              <p className="text-sm text-muted-foreground">
                Showing the latest coordinates from your browser. Geo-fenced areas render in production.
              </p>
              <p className="text-xs text-muted-foreground mt-2">{checkIns.length} check-in locations recorded</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
