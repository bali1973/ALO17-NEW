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
  // Render için output ayarı
  output: 'standalone',
  // Experimental özellikleri kapat
  experimental: {
    serverComponentsExternalPackages: [],
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