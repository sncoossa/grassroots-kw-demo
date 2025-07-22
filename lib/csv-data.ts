export interface ActionItem {
  title: string
  date: string // Original raw date string from CSV
  displayDate: string // Formatted date string (e.g., "January 1, 2024") or original non-date text
  parsedDate?: Date // Optional Date object for internal filtering
  time: string
  effortSlider: string
  timeSlider: string
  location: string
  link: string
  interestsSlider: string
}

// A more robust CSV line parser to handle commas within quoted fields
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let inQuote = false
  let currentField = ""

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuote && nextChar === '"') {
        // Handle escaped double quote (e.g., "He said ""Hello""")
        currentField += '"'
        i++ // Skip the next quote
      } else {
        inQuote = !inQuote
      }
    } else if (char === "," && !inQuote) {
      values.push(currentField.trim())
      currentField = ""
    } else {
      currentField += char
    }
  }
  values.push(currentField.trim()) // Add the last field

  return values
}

export async function fetchCSVData(): Promise<ActionItem[]> {
  try {
    const response = await fetch(
      "https://ro5hnccyvszzcdzv.public.blob.vercel-storage.com/Website-Content%20-%20Focus%20Group%20Inventory.csv",
    )
    const csvText = await response.text()

    const lines = csvText.split("\n")
    const data: ActionItem[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize today's date to start of day

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = parseCSVLine(line)

      // Ensure we have enough columns for the core data (at least 7 for title to link)
      if (values.length >= 7) {
        const rawDate = (values[1] || "").replace(/^"|"$/g, "") // Remove quotes from raw date
        let displayDate = rawDate
        let parsedDate: Date | undefined
        let isPastEvent = false

        // Attempt to parse date in DD/MM/YYYY format
        const dateParts = rawDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
        if (dateParts) {
          const day = Number.parseInt(dateParts[1], 10)
          const month = Number.parseInt(dateParts[2], 10)
          const year = Number.parseInt(dateParts[3], 10)

          // Create a date object (month is 0-indexed in JS Date)
          const eventDate = new Date(year, month - 1, day)
          eventDate.setHours(0, 0, 0, 0) // Normalize event date to start of day

          if (!isNaN(eventDate.getTime())) {
            // Check if it's a valid date
            parsedDate = eventDate
            // Check if the event date is in the past
            isPastEvent = eventDate < today

            // Convert to text form if it's a valid date
            displayDate = eventDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }
        }

        // Only add the action if it's not a past event (if it was a parsable date)
        // Or if it's not a parsable date (like "Any" or "Signups are closed.")
        if (!isPastEvent || !parsedDate) {
          const action: ActionItem = {
            title: (values[0] || "").replace(/^"|"$/g, ""), // Remove quotes from title
            date: rawDate, // Keep original raw date for consistency if needed elsewhere
            displayDate: displayDate, // Formatted date or original non-date text
            parsedDate: parsedDate, // The actual Date object for filtering
            time: values[2] || "",
            effortSlider: values[3] || "",
            timeSlider: values[4] || "",
            location: values[5] || "",
            link: values[6] || "",
            // Collect interests from index 7 onward (there can be up to 3 columns)
            interestsSlider: values
              .slice(7) // grab cols 7, 8, 9 …
              .filter(Boolean) // drop empty cells
              .join(", ") // "Interest1, Interest2, Interest3"
              .trim(),
          }
          data.push(action)
        }
      }
    }
    return data
  } catch (error) {
    console.error("Error fetching CSV data:", error)
    return []
  }
}

export function filterActions(
  actions: ActionItem[],
  timeFilter: string,
  effortFilter: string,
  interestsFilter: string[],
): ActionItem[] {
  return actions.filter((action) => {
    // Time filter
    const timeMatch = timeFilter === "Any" || action.timeSlider === timeFilter

    // Effort filter
    const effortMatch = effortFilter === "Any" || action.effortSlider === effortFilter

    // Interests filter: Check if any of the selected interests are present in the action's interests
    const actionInterests = action.interestsSlider.split(",").map((i) => i.trim())
    const interestsMatch =
      interestsFilter.length === 0 || interestsFilter.some((interest) => actionInterests.includes(interest))

    // Date filtering is now handled during data fetching, so no need to re-filter here.
    return timeMatch && effortMatch && interestsMatch
  })
}
