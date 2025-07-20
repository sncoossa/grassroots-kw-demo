export interface ActionItem {
  title: string
  date: string
  time: string
  effortSlider: string
  timeSlider: string
  location: string
  link: string
  interestsSlider: string // This will now contain comma-separated values
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

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = parseCSVLine(line) // Use the new parser

      // Ensure we have enough columns for the core data
      if (values.length >= 7) {
        const action: ActionItem = {
          // Remove leading/trailing quotes from Title and Date
          title: (values[0] || "").replace(/^"|"$/g, ""),
          date: (values[1] || "").replace(/^"|"$/g, ""),
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

    return timeMatch && effortMatch && interestsMatch
  })
}
