// Days of the week for availability grid
export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// Time slots for availability selection
export const TIME_SLOTS = [
  "7-8 AM",
  "8-9 AM",
  "9-10 AM",
  "10-11 AM",
  "11-12 AM",
  "12-1 PM",
  "1-2 PM",
  "2-3 PM",
  "3-4 PM",
  "4-5 PM",
  "5-6 PM",
  "6-7 PM",
  "7-8 PM",
  "8-9 PM",
  "9-10 PM",
]

export interface AvailabilitySlot {
  day: string
  timeSlot: string
  isSelected: boolean
}

export interface FormData {
  name: string
  email: string
  phone: string
  motivation: string
}
