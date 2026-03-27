import { ArrowRight } from "lucide-react"
import Image from "next/image"

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

    <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 md:pt-12 lg:pt-14 pb-6 sm:pb-8 md:pb-10 lg:pb-12 text-center flex flex-col items-center justify-center bg-custom-bg rounded min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh]">
        {/* Main title */}
      <h1 className="pt-10 text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[12rem] font-instrument-serif tracking-tighter text-custom-green leading-none px-2">GrassrootsKW</h1>
      
      <Image
          src="/homepage-image.png"
          alt="Homepage"
          width={300}
          height={200}
          className="mx-auto mb-2 sm:mb-3 md:mb-4 max-w-[14rem] sm:max-w-[16rem] md:max-w-[18rem] w-full h-auto"
        />
        
        {/* Value proposition */}
      <div className="mb-6 sm:mb-8 space-y-1 px-4 sm:px-0 mb-8 sm:mb-12 md:mb-16">
        <p className="font-switzer text-base sm:text-lg leading-5 tracking-tighter text-custom-green/80">You care about our planet but don&apos;t know where to start.</p>
        <p className="font-switzer text-base sm:text-lg leading-5 tracking-tighter text-custom-green/80">Let&apos;s change that.</p>
      </div>

      <div className="flex flex-col items-center mb-2 sm:mb-4 md:mb-6">
        <Image
          src="/gkw-logo-vector.png"
          alt="Grassroots KW Logo"
          width={48}
          height={44}
          className="sm:mb-2 mx-auto w-10 h-9 sm:w-12 sm:h-11 md:w-14 md:h-12"
        />
      </div>

      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
        <span className="flex items-center gap-1 sm:gap-2 bg-custom-highlight px-2 py-1 rounded text-custom-green/70 text-center">
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="hidden sm:inline">Funded by the{" "}</span>
          <span className="sm:hidden">YCAF funded{" "}</span>
          <a
            href="https://www.kitchener.ca/en/taxes-utilities-and-finance/bloomberg-youth-climate-action-fund.aspx#Hope:~:text=eco%2Dfriendly%20practices.-,Hope%20to%20Action%3A%20Strategic%20Research%20Foundations,-%2D%20Despite%20a%20vibrant"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Youth Climate Action Fund (YCAF)
          </a>
        </span>
      </div>
    </div>
  )
}
