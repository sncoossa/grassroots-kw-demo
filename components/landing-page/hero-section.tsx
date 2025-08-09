import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <div className="container mx-auto px-8 py-16 text-center flex flex-col items-center bg-custom-bg rounded">
      <div className="flex flex-col items-center mb-5">
        <img
          src="/gkw-logo-vector.png"
          alt="Grassroots KW Logo"
          className="mb-5 w-12 h-11 mx-auto"
        />
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="flex items-center gap-2 bg-custom-highlight px-2 py-1 rounded text-custom-green/70">
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
          </span>
        </div>
      </div>
            <h1 className="mb-6 text-9xl font-instrument-serif tracking-tighter text-custom-green">grassroots.kw</h1>
      <div className="mb-8 space-y-1">
        <p className="text-lg leading-5 tracking-tighter text-custom-green/80">Discover real local initiatives you can support.</p>
        <p className="text-lg leading-5 tracking-tighter text-custom-green/80">Build community while doing good.</p>
      </div>
      <img
          src="/homepage-image.png"
          alt="Homepage"
          className="mx-auto my-4 max-w-xs"
        />
    </div>
  )
}
