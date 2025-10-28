import MemberCard from './member-card'

export type ExecMember = {
  name: string
  title?: string
  image: string
  bio?: string
}

export const execMembers: ExecMember[] = [
  {
    name: 'Sol Qiu',
    image: '/placeholder-user.jpg',
  },
  {
    name: 'Saskia Coosa',
    image: '/placeholder-user.jpg',
  },
  {
    name: 'Abinaya Balaji',
    image: '/placeholder-user.jpg',
  },
  {
    name: 'Jason Deng',
    image: '/placeholder-user.jpg',
  },
  {
    name: 'Katie Yu',
    image: '/placeholder-user.jpg',
  },
  {
    name: 'Isha Shenoy',
    image: '/placeholder-user.jpg',
  },
]

export default function ExecGrid({ members = execMembers }: { members?: ExecMember[] }) {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((m) => (
          <MemberCard key={m.name} member={m} />
        ))}
      </div>
    </section>
  )
}
