"use client"

import { memo } from "react"
import { usePathname } from "next/navigation"
import { ProfileButton } from "@/components/profile-page/profile-button"

function NavigationBarComponent() {
  const pathname = usePathname()

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-custom-green/80 shadow-lg">
      <div className="flex justify-end items-center h-16 px-6 gap-6">
        {/* Navigation buttons - right aligned */}
        <a 
          href="/" 
          onClick={handleHomeClick}
          className="px-6 py-2.5 text-sm font-semibold bg-custom-highlight text-custom-green rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Home
        </a>
        <a 
          href="/events" 
          className="px-6 py-2.5 text-sm font-semibold bg-custom-highlight text-custom-green rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Events
        </a>
        <a 
          href="/our-team" 
          className="px-6 py-2.5 text-sm font-semibold bg-custom-highlight text-custom-green rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Our Team
        </a>

        {/* Profile button at the far right */}
        <ProfileButton />
      </div>
    </nav>
  )
}

export const NavigationBar = memo(NavigationBarComponent)
