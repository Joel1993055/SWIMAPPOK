import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          // Separate chunk for large libraries
          recharts: {
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            name: 'recharts',
            priority: 10,
            chunks: 'all',
          },
          dndkit: {
            test: /[\\/]node_modules[\\/]@dnd-kit[\\/]/,
            name: 'dndkit',
            priority: 10,
            chunks: 'all',
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            priority: 10,
            chunks: 'all',
          },
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
            name: 'charts',
            priority: 10,
            chunks: 'all',
          },
          utils: {
            test: /[\\/]node_modules[\\/](date-fns|clsx|tailwind-merge)[\\/]/,
            name: 'utils',
            priority: 10,
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Compression
  compress: true,

  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,
};

export default nextConfig;
