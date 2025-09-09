// next.config.ts - Configuración simplificada
const nextConfig = {
  // Ignorar errores de lint y TS en el build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuración básica de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuración básica
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;