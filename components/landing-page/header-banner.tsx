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
    <div className="relative bg-custom-highlight py-4 px-4 text-center text-sm text-custom-green border-b border-custom-green/20 flex items-center justify-center min-h-[3rem]">
      {/* Main banner content */}
      <div>
        Are you a climate non-profit in the KW region? We think we can help.{" "}
        <a href="mailto:info@grassrootskw.org" className="underline hover:no-underline">
          Contact us
        </a>{" "}
        to learn more
      </div>
      
      {/* Profile button positioned in top right, within the banner */}
      <div className="absolute right-4 flex items-center h-full">
        <ProfileButton />
      </div>
    </div>
  )
}
