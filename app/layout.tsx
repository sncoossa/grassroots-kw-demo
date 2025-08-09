import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Instrument_Serif } from "next/font/google"
import { Providers } from "@/components/providers"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
})

export const metadata: Metadata = {
  title: "Grassroots KW",
  description: "Real action. Real community.",
  generator: "v0.dev",
  openGraph: {
    title: "Grassroots KW",
    description: "Real action. Real community.",
    url: "https://grassrootskw.org", // Replace with your actual domain if known
    siteName: "Grassroots KW",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200", // Placeholder image for social sharing
        width: 1200,
        height: 630,
        alt: "Grassroots KW Logo",
      },
    ],
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={instrumentSerif.variable} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
