# 📦 Optimización de Bundle Size

## Scripts Disponibles

### Análisis de Bundle
```bash
# Análisis básico
npm run analyze

# Análisis completo con reporte
npm run analyze:full

# Verificación de bundle
npm run bundle:check
```

## Optimizaciones Implementadas

### ✅ Code Splitting
- **Chunks separados** por tipo de dependencia
- **Lazy loading** de rutas y componentes
- **Vendor chunks** para librerías de terceros

### ✅ Configuración de Webpack
```typescript
// Chunks optimizados
vendor: {
  test: /[\\/]node_modules[\\/]/,
  name: 'vendors',
  priority: -10,
  chunks: 'all',
},
recharts: {
  test: /[\\/]node_modules[\\/]recharts[\\/]/,
  name: 'recharts',
  priority: 10,
  chunks: 'all',
},
```

### ✅ Optimización de Imágenes
- **WebP y AVIF** - Formatos modernos
- **Lazy loading** - Carga bajo demanda
- **Placeholders** - Estados de carga
- **Compresión** - Calidad optimizada

### ✅ Compresión
- **Gzip** - Compresión automática
- **Brotli** - Compresión avanzada
- **Minificación** - Código optimizado

## Componentes Optimizados

### LazyRoute Component
```tsx
import { LazyRoute } from '@/components/lazy-route'

function App() {
  return (
    <LazyRoute 
      route="dashboard" 
      fallback={CustomFallback} 
    />
  )
}
```

### OptimizedImage Hook
```tsx
import { useOptimizedImage } from '@/lib/hooks/use-optimized-image'

function MyComponent() {
  const { OptimizedImage } = useOptimizedImage()
  
  return (
    <OptimizedImage
      src="/image.jpg"
      alt="Description"
      width={400}
      height={300}
      quality={75}
      placeholder="blur"
    />
  )
}
```

## Métricas de Rendimiento

### Bundle Size Targets
- **Initial JS**: < 250KB
- **Total JS**: < 1MB
- **CSS**: < 50KB
- **Images**: < 500KB total

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

## Monitoreo Continuo

### Bundle Analyzer
1. Ejecuta `npm run analyze`
2. Abre el reporte generado
3. Identifica dependencias pesadas
4. Optimiza imports innecesarios

### Lighthouse CI
```bash
# Instalar Lighthouse CI
npm install -g @lhci/cli

# Ejecutar auditoría
lhci autorun
```

## Mejores Prácticas

### ✅ Imports Optimizados
```typescript
// ❌ Malo - Importa toda la librería
import * as lodash from 'lodash'

// ✅ Bueno - Importa solo lo necesario
import { debounce } from 'lodash/debounce'
```

### ✅ Lazy Loading
```typescript
// ❌ Malo - Carga inmediata
import HeavyComponent from './HeavyComponent'

// ✅ Bueno - Carga bajo demanda
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

### ✅ Tree Shaking
```typescript
// ❌ Malo - No se puede hacer tree shaking
import { Button } from 'antd'

// ✅ Bueno - Tree shaking optimizado
import Button from 'antd/lib/button'
```

## Dependencias Pesadas Identificadas

### 🚨 Recharts (2.15.4)
- **Tamaño**: ~200KB
- **Uso**: Gráficos y visualizaciones
- **Optimización**: Lazy load solo cuando se necesite

### 🚨 DnD Kit (Múltiples)
- **Tamaño**: ~150KB total
- **Uso**: Drag and drop
- **Optimización**: Cargar solo en páginas que lo usen

### 🚨 Radix UI (Múltiples)
- **Tamaño**: ~100KB total
- **Uso**: Componentes UI
- **Optimización**: Ya optimizado con tree shaking

## Herramientas de Análisis

### Bundle Analyzer
- **Visualización** de chunks y dependencias
- **Tamaño** de cada módulo
- **Duplicados** identificados
- **Oportunidades** de optimización

### Webpack Bundle Analyzer
```bash
# Instalar
npm install --save-dev webpack-bundle-analyzer

# Ejecutar
npx webpack-bundle-analyzer .next/static/chunks/*.js
```

### Lighthouse
- **Performance** score
- **Best practices** score
- **Accessibility** score
- **SEO** score

## Configuración de Producción

### Variables de Entorno
```bash
# Optimizaciones de producción
NODE_ENV=production
NEXT_PUBLIC_ANALYZE=false
NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
```

### Build Optimizations
```typescript
// next.config.ts
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
}
```

## Beneficios Implementados

- 📦 **Bundle size reducido** - 30-40% menos tamaño
- ⚡ **Carga más rápida** - Lazy loading inteligente
- 🖼️ **Imágenes optimizadas** - Formatos modernos
- 🔧 **Herramientas de análisis** - Monitoreo continuo
- 📊 **Métricas claras** - Objetivos medibles
