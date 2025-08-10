/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true,
    domains: ['localhost', 'alo17-new-27-06.onrender.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
  },
  webpack: (config, { isServer }) => {
    // Fix exports error - minimal configuration
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
  // Fix for Render deployment
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig; 