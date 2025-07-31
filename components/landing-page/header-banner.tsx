import { ProfileButton } from "../profile-page/profile-button"

/**
 * Header Banner Component
 * 
 * Displays a promotional banner at the top of the page targeting climate non-profits
 * in the KW region with a call-to-action to contact the organization.
 * Also includes a profile button in the top right corner.
 */
export function HeaderBanner() {
  return (
    <div className="bg-custom-bg/80 py-3 px-4 text-center text-sm text-custom-green border-b border-custom-green/20 relative">
      {/* Profile button positioned in top right */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <ProfileButton />
      </div>
      
      {/* Main banner content */}
      Are you a climate non-profit in the KW region? We think we can help.{" "}
      <a href="mailto:info@grassrootskw.org" className="underline hover:no-underline">
        Contact us
      </a>{" "}
      to learn more
    </div>
  )
}
