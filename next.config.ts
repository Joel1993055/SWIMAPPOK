// next.config.ts - Configuración optimizada para rendimiento
const nextConfig = {
  // Ignorar errores de lint y TS en el build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // OPTIMIZACIONES DE RENDIMIENTO
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react', '@radix-ui/react-icons'],
  },
  
  // Configuración optimizada de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 año
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compresión y optimizaciones
  poweredByHeader: false,
  compress: true,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones de chunks
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },
          recharts: {
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            name: 'recharts',
            priority: 20,
            chunks: 'all',
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            priority: 15,
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;