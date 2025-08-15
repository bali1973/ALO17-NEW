/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages deployment için (static export)
  output: 'export',
  poweredByHeader: false,
  
  // Image optimization
  images: {
    domains: ['localhost', 'alo17-new-27-06.onrender.com'],
    unoptimized: true,
  },

  // Webpack configuration - minimal
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },

  // Experimental features - minimal
  experimental: {
    optimizeCss: true,
  },

  // TypeScript ve ESLint
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 