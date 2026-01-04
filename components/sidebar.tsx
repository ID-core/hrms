"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, ClipboardCheck, Calendar, MapPin, FileText, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["employee", "manager", "hr", "admin"],
  },
  {
    title: "My Profile",
    href: "/profile",
    icon: Users,
    roles: ["employee", "manager", "hr", "admin"],
  },
  {
    title: "Performance",
    href: "/appraisal",
    icon: ClipboardCheck,
    roles: ["employee", "manager", "hr", "admin"],
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: Calendar,
    roles: ["employee", "manager", "hr", "admin"],
  },
  {
    title: "Leave Management",
    href: "/leaves",
    icon: FileText,
    roles: ["employee", "manager", "hr", "admin"],
  },
  {
    title: "Transfer Requests",
    href: "/transfers",
    icon: MapPin,
    roles: ["employee", "manager", "hr", "admin"],
  },
  {
    title: "HR Dashboard",
    href: "/hr",
    icon: Settings,
    roles: ["hr", "admin"],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user?.role || ""))

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="border-b p-6">
        <h1 className="text-xl font-bold text-foreground">Municipal HRMS</h1>
        <p className="text-sm text-muted-foreground mt-1">Performance Tracking</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="mb-4 rounded-lg bg-muted p-3">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.designation}</p>
          <p className="text-xs text-muted-foreground mt-1">ID: {user?.employeeId}</p>
        </div>
        <Button variant="outline" className="w-full bg-transparent" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
