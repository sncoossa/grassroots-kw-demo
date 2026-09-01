"use client"

import { memo, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ProfileButton } from "@/components/profile-page/profile-button"

function NavigationBarComponent() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    setMenuOpen(false)
  }

  const linkClass =
    "px-6 py-2.5 text-sm font-semibold bg-custom-highlight text-custom-green rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-custom-green/80 shadow-lg">
      <div className="flex justify-between items-center h-16 pl-3 pr-4 md:pr-6">
        <a href="/" onClick={handleHomeClick} className="flex items-center">
          <Image
            src="/grassroots-kw-light-logo.svg"
            alt="GrassrootsKW logo"
            width={220}
            height={54}
            priority
            className="h-auto w-auto max-h-14"
          />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/" onClick={handleHomeClick} className={linkClass}>Home</a>
          <a href="/events" className={linkClass}>Events</a>
          <a href="/our-team" className={linkClass}>Our Team</a>
          <ProfileButton />
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <ProfileButton />
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-custom-highlight" aria-label="Toggle menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-2 px-4 pb-4 bg-custom-green/90">
          <a href="/" onClick={handleHomeClick} className={`${linkClass} text-center`}>Home</a>
          <a href="/events" onClick={() => setMenuOpen(false)} className={`${linkClass} text-center`}>Events</a>
          <a href="/our-team" onClick={() => setMenuOpen(false)} className={`${linkClass} text-center`}>Our Team</a>
        </div>
      )}
    </nav>
  )
}

export const NavigationBar = memo(NavigationBarComponent)
