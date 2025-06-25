/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      }
    ],
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: '/ilanlar',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 