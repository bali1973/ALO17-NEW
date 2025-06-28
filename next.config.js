/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript kontrolünü devre dışı bırak
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint kontrolünü devre dışı bırak
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 