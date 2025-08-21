/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXTAUTH_URL: process.env.NODE_ENV === 'production' ? 'https://grassrootskw.org' : process.env.NEXTAUTH_URL,
  },
}

export default nextConfig
