import Image from 'next/image'

type Member = {
  name: string
  title?: string
  image: string
  bio?: string
}

export default function MemberCard({ member }: { member: Member }) {
  return (
    <article className="flex flex-col items-center rounded-lg bg-white/60 dark:bg-slate-900/60 p-4 shadow-sm border border-gray-100 dark:border-slate-800">
      <div className="w-32 h-32 relative mb-3">
        <Image
          src={member.image}
          alt={member.name}
          className="rounded-full object-cover"
          fill
          sizes="(max-width: 640px) 128px, 192px"
          unoptimized
        />
      </div>
      <h3 className="text-sm font-medium text-custom-green">{member.name}</h3>
      {member.title ? (
        <p className="text-xs text-custom-green">{member.title}</p>
      ) : null}
      {member.bio ? (
        <p className="mt-2 text-xs text-center text-custom-green">{member.bio}</p>
      ) : null}
    </article>
  )
}
