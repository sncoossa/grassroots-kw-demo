import Link from 'next/link'
import ExecGrid from '../../components/executives'

export const metadata = {
  title: 'About — Exec Team',
}

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 bg-custom-bg">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-custom-green hover:underline"
          aria-label="Back to home"
        >
          ← Back to home
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-custom-green font-instrument-serif">Our Executive Team</h1>
      </div>

      <ExecGrid />
    </div>
  )
}
