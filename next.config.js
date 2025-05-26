/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
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