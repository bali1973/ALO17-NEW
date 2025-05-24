/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  images: {
    domains: ['localhost', 'alo17-new.netlify.app', 'alo17-socket.onrender.com', 'alo17-api.onrender.com'],
  },
}

module.exports = nextConfig 