import { ArrowRight } from "lucide-react"

/**
 * Hero Section Component
 * 
 * The main landing section featuring:
 * - Funding acknowledgment with link to Youth Climate Action Fund
 * - Main grassroots.kw branding and title
 * - Value proposition messaging about local initiatives and community building
 */
export function HeroSection() {
  return (
    <div className="container mx-auto px-8 py-16 text-center flex flex-col items-center">
      {/* Funding acknowledgment */}
      <div className="mb-4 flex items-center justify-center gap-2 text-sm text-custom-green/70">
        <ArrowRight className="h-4 w-4" />
        Funded by the{" "}
        <a
          href="https://www.kitchener.ca/en/taxes-utilities-and-finance/bloomberg-youth-climate-action-fund.aspx#Hope:~:text=eco%2Dfriendly%20practices.-,Hope%20to%20Action%3A%20Strategic%20Research%20Foundations,-%2D%20Despite%20a%20vibrant"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Youth Climate Action Fund (YCAF)
        </a>
      </div>
      
      {/* Main title */}
      <h1 className="mb-6 text-6xl font-instrument-serif text-custom-green md:text-7xl">grassroots.kw</h1>
      
      {/* Value proposition */}
      <div className="mb-8 space-y-2">
        <p className="text-lg text-custom-green/80">Discover real local initiatives you can support.</p>
        <p className="text-lg text-custom-green/80">Build community while doing good.</p>
      </div>
    </div>
  )
}
