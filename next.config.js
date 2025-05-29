/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'placehold.co'],
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