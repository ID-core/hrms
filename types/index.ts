export type UserRole = "employee" | "manager" | "hr" | "admin"

export interface User {
  id: string
  employeeId: string
  name: string
  email: string
  role: UserRole
  department: string
  designation: string
  joiningDate: string
  reportingManager?: string
  avatar?: string
  assignedLocation?: {
    lat: number
    lng: number
    name: string
  }
}

export interface Employee extends User {
  phone: string
  address: string
  panNumber: string
  aadharNumber: string
  bankAccount: string
  currentPostingLocation: string
  transferHistory: Transfer[]
}

export interface Transfer {
  id: string
  employeeId: string
  fromLocation: string
  toLocation: string
  requestDate: string
  approvalDate?: string
  status: "pending" | "approved" | "rejected"
  reason: string
  score: number
}

export interface Appraisal {
  id: string
  employeeId: string
  year: number
  selfScore: number
  managerScore: number
  hrScore: number
  finalScore: number
  attendanceImpact: number
  geoHazriCompliance: number
  beatCoverage?: number
  status: "draft" | "submitted" | "reviewed" | "completed"
  goals: Goal[]
}

export interface Goal {
  id: string
  description: string
  targetDate: string
  status: "not-started" | "in-progress" | "completed"
  selfRating?: number
  managerRating?: number
}

export interface Attendance {
  id: string
  employeeId: string
  date: string
  checkIn: string
  checkOut: string
  location: {
    lat: number
    lng: number
  }
  geoHazriCompliant: boolean
  status: "present" | "absent" | "half-day" | "leave"
}

export interface Leave {
  id: string
  employeeId: string
  type: "casual" | "earned" | "medical" | "maternity"
  fromDate: string
  toDate: string
  reason: string
  status: "pending" | "approved" | "rejected"
  approvedBy?: string
}
