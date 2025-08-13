import { TIME_SLOTS } from "./constants"

/**
 * Parses action time and finds matching time slots
 */
export const parseActionTimeToSlots = (actionTime: string): string[] => {
  if (!actionTime || actionTime === 'TBD' || actionTime === 'To be determined') {
    return []
  }
  
  // Convert action time to our TIME_SLOTS format
  // Handle various time formats like "9:00 AM - 12:00 PM", "9 AM - 12 PM", etc.
  const timeRange = actionTime.trim()
  
  // Extract start and end times
  const timeRangeMatch = timeRange.match(/(\d{1,2}):?(\d{0,2})\s*(AM|PM)?\s*-\s*(\d{1,2}):?(\d{0,2})\s*(AM|PM)/i)
  
  if (timeRangeMatch) {
    const [, startHour, , startAMPM = '', endHour, , endAMPM] = timeRangeMatch
    
    // Convert to 24-hour format for easier calculation
    let start24 = parseInt(startHour)
    let end24 = parseInt(endHour)
    
    if (startAMPM.toUpperCase() === 'PM' && start24 !== 12) start24 += 12
    if (startAMPM.toUpperCase() === 'AM' && start24 === 12) start24 = 0
    if (endAMPM.toUpperCase() === 'PM' && end24 !== 12) end24 += 12
    if (endAMPM.toUpperCase() === 'AM' && end24 === 12) end24 = 0
    
    // Find matching slots
    const matchingSlots: string[] = []
    
    TIME_SLOTS.forEach(slot => {
      const slotMatch = slot.match(/(\d{1,2})-(\d{1,2})\s*(AM|PM)/)
      if (slotMatch) {
        const [, slotStart, slotEnd, slotAMPM] = slotMatch
        let slot24Start = parseInt(slotStart)
        let slot24End = parseInt(slotEnd)
        
        if (slotAMPM === 'PM' && slot24Start !== 12) slot24Start += 12
        if (slotAMPM === 'AM' && slot24Start === 12) slot24Start = 0
        if (slotAMPM === 'PM' && slot24End !== 12) slot24End += 12
        if (slotAMPM === 'AM' && slot24End === 12) slot24End = 0
        
        // Check if slot overlaps with action time
        if (slot24Start >= start24 && slot24End <= end24) {
          matchingSlots.push(slot)
        }
      }
    })
    
    return matchingSlots
  }
  
  // If no range match, try to match individual time slots
  for (const slot of TIME_SLOTS) {
    if (timeRange.toLowerCase().includes(slot.toLowerCase().replace('-', ' to ').replace(/[^\w\s]/g, ''))) {
      return [slot]
    }
  }
  
  return []
}

/**
 * Generates a Google Calendar invite URL
 */
export const generateCalendarInvite = (
  actionTitle: string,
  actionDate: string,
  actionTime: string,
  actionLocation: string,
  formData: { name: string; email: string; motivation: string }
) => {
  // Parse the action date and time to create a proper calendar event
  const eventTitle = encodeURIComponent(actionTitle || 'Climate Action Event')
  const eventDescription = encodeURIComponent(
    `You've signed up for this climate action event!\n\n` +
    `Motivation: ${formData.motivation}\n\n` +
    `Contact: ${formData.name} (${formData.email})`
  )
  const eventLocation = encodeURIComponent(actionLocation || '')
  
  // Parse date - assuming format like "January 15, 2025" or similar
  let startDate = new Date()
  if (actionDate) {
    try {
      // Try to parse the date string
      const parsedDate = new Date(actionDate)
      if (!isNaN(parsedDate.getTime())) {
        startDate = parsedDate
      }
    } catch {
      console.warn('Could not parse date:', actionDate)
    }
  }

  // Parse time - extract start time from actionTime
  let startTime = '09:00'
  let endTime = '10:00'
  
  if (actionTime) {
    const timeMatch = actionTime.match(/(\d{1,2}):?(\d{0,2})\s*(AM|PM)?/i)
    if (timeMatch) {
      const [, hour, minute = '00', ampm = ''] = timeMatch
      let hour24 = parseInt(hour)
      
      if (ampm.toUpperCase() === 'PM' && hour24 !== 12) {
        hour24 += 12
      } else if (ampm.toUpperCase() === 'AM' && hour24 === 12) {
        hour24 = 0
      }
      
      startTime = `${hour24.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`
      
      // For end time, add 1 hour by default
      const endHour = hour24 + 1
      endTime = `${endHour.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`
    }
  }

  // Format dates for Google Calendar (YYYYMMDDTHHMMSS)
  const formatDateForCalendar = (date: Date, time: string) => {
    const [hours, minutes] = time.split(':')
    const calendarDate = new Date(date)
    calendarDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    
    return calendarDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  }

  const startDateTime = formatDateForCalendar(startDate, startTime)
  const endDateTime = formatDateForCalendar(startDate, endTime)

  // Create Google Calendar URL
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDateTime}/${endDateTime}&details=${eventDescription}&location=${eventLocation}&add=${encodeURIComponent(formData.email)}`
  
  return calendarUrl
}
