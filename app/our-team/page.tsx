import Image from 'next/image'
import { AnimatedCard } from '@/components/about/animated-card'
import team from './team.json'

// This page introduces the team members of GrassrootsKW
export const metadata = {
  title: 'The GrassrootsKW Team!',
}

type TeamMember = {
  name: string
  introName: string | null
  headshot: string
  intro: string
  fun: string
}

const teamMembers = team as TeamMember[]

// This function lets us bold the team member's name if it is in the intro.
function renderIntro(intro: string, introName: string | null) {
  if (!introName) return <>{intro}</>
  const idx = intro.indexOf(introName)
  if (idx === -1) return <>{intro}</>
  return (
    <>
      {intro.slice(0, idx)}
      <strong className="font-semibold text-custom-green">{introName}</strong>
      {intro.slice(idx + introName.length)}
    </>
  )
}

// Rendering the page
export default function MeetTheTeamPage() {
  return (
    <div className="min-h-screen bg-custom-bg">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="mt-12 text-9xl sm:text-9xl font-instrument-serif tracking-tighter text-custom-green">
            Meet the Team
          </h1>
          <p className="mt-3 font-switzer text-base text-custom-green/70 leading-5 tracking-tighter">
            The people behind GrassrootsKW
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((person, i) => (
            <AnimatedCard key={person.name} index={i}>
            <div
              className="h-full bg-custom-highlight border border-custom-green/10 rounded-2xl overflow-hidden flex flex-col"
            >
              {/* photo */}
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={person.headshot}
                  alt={person.name}
                  fill
                  className="object-cover object-top"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-xl font-instrument-serif text-custom-green mb-1">
                  {person.name}
                </h2>
                <p className="font-switzer text-sm text-custom-green/75 leading-relaxed tracking-tight mb-4">
                  {renderIntro(person.intro, person.introName)}
                </p>
                {person.fun && (() => {
                  const colonIdx = person.fun.indexOf(': ')
                  const label = colonIdx !== -1 ? person.fun.slice(0, colonIdx) : null
                  const text = colonIdx !== -1 ? person.fun.slice(colonIdx + 2) : person.fun
                  return (
                    <div className="mt-auto space-y-1">
                      {label && (
                        <span className="inline-block font-switzer text-xs text-custom-green bg-custom-green/10 rounded-full px-3 py-1">
                          {label}
                        </span>
                      )}
                      <p className="font-switzer text-xs text-custom-green/70 italic">{text}</p>
                    </div>
                  )
                })()}
              </div>
            </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  )
}
