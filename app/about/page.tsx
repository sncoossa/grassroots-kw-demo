import Link from 'next/link'
import Image from 'next/image'
import { HeaderBanner } from '@/components/landing-page/header-banner'
import { AnimatedCard } from '@/components/about/animated-card'

export const metadata = {
  title: 'Meet the Team — GrassrootsKW',
}

const team = [
  {
    name: 'Abi',
    introName: 'Abinaya Balaji',
    headshot: '/images/abi.png',
    intro: `Hello! I'm Abinaya Balaji, a third-year student in Environment, Resources and Sustainability at the University of Waterloo. Caring about climate change is about caring about people. Seeing people care about their passions inspires me to care about mine, and with our growing community, I know that we can create change!`,
    fun: `Favourite Icebreaker: If you could eat something inedible, what would you want to eat?`
  },
  {
    name: 'Deeka',
    introName: 'Deeka',
    headshot: '/images/deeka.png',
    intro: `Hey everyone, I'm Deeka. I'm currently studying Geography and Environmental Management at the University of Waterloo. What matters most to me is working toward a shared purpose that brings people together, strengthens local connections, and empowers communities. That's why GrassrootsKW stands out to me.`,
    fun: `Silliest Climate Solution: Have all the energy in the world come from cow farts.`
  },
  {
    name: 'Isha',
    introName: 'Isha Shenoy',
    headshot: '/images/isha.png',
    intro: `Hello! I'm Isha Shenoy, a Management Engineering student at the University of Waterloo. I really care about making climate action feel fun and doable for everyone. GrassrootsKW stands out to me because it does just that by making it easier for anyone to get involved in climate action!`,
    fun: `Favourite Icebreaker: If you could summarize yourself in a single sentence, what would it be?`
  },
  {
    name: 'Jason',
    introName: 'Jason Deng',
    headshot: '/images/jason.jpg',
    intro: `Hi! I'm Jason Deng, a Mechatronics Engineering student at UW. I believe that a collective attitude and community are one of the greatest driving forces behind large-scale climate action. At GrassrootsKW, we build that in one of the most impactful groups: youth.`,
    fun: `Silliest Climate Solution: Run underground and become mole people.`
  },
  {
    name: 'Katie',
    introName: 'Katie Yu',
    headshot: '/images/katie.png',
    intro: `Hi! I'm Katie Yu, a Chemical Engineering student at the University of Waterloo, and I care about the work we're doing at GrassrootsKW because youth continue to be disproportionately impacted by climate change and should feel encouraged to engage in fun and meaningful climate action opportunities!`,
    fun: `Silliest climate solution: Paint everything white!`
  },
  {
    name: 'Liam',
    introName: 'Liam Neusteter',
    headshot: '/images/liam.jpg',
    intro: `Hey! I'm Liam Neusteter, a second-year Chemical Engineering student at UW. I'm a big fan of Earth and would love to see it in its best condition possible! Future generations will shape the planet's well-being, and GrassrootsKW aims to empower youth to take an active role in the climate movement.`,
    fun: `Favourite icebreaker: If everyone in the world stopped sneezing, how long would it take for you to notice?`
  },
  {
    name: 'Salma',
    introName: 'Salma',
    headshot: '/images/salma.png',
    intro: `Hello! I'm Salma, an Environmental Engineering student at UW. For as long as I can remember, I've been passionate about climate justice. I joined GrassrootsKW to help youth who were once in my position enter this space, get involved, make a difference and learn!`,
    fun: `Silliest climate policy: Throwing seeds everywhere!`
  },
  {
    name: 'Saskia',
    introName: 'Saskia',
    headshot: '/images/saskia.png',
    intro: `Heya! I'm Saskia, a Health Sciences student here at the University of Waterloo. I love being part of GrassrootsKW because we're focused on bringing hope, joy, and silliness into climate action spaces. I am constantly inspired by how warm, inclusive, and dynamic this community is!`,
    fun: `Favourite icebreaker: If you were a scent or taste, what would you be?`
  },
  {
    name: 'Sol',
    introName: null,
    headshot: '/images/sol.png',
    intro: `Hi hi! I recently graduated from the University of Waterloo, and I am now working full time at Environment and Climate Change Canada. For as long as I could remember, I felt worried about climate change and the future of our planet, but getting involved felt daunting—so I wanted to help bridge that gap for other youth.`,
    fun: `Favourite icebreaker: Replace all the billboards in the world with solar panels.`
  },
]

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

export default function MeetTheTeamPage() {
  return (
    <div className="min-h-screen bg-custom-bg">
      <HeaderBanner />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-switzer text-custom-green hover:underline"
            aria-label="Back to home"
          >
            ← Back to home
          </Link>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-instrument-serif tracking-tighter text-custom-green">
            Meet the Team
          </h1>
          <p className="mt-3 font-switzer text-base text-custom-green/70 leading-5 tracking-tighter">
            The people behind grassroots.kw
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person, i) => (
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
