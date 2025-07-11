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
  // Image optimization için remote patterns ayarları
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Webpack optimizasyonu
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 