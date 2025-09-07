# 🚦 Configuración de Rate Limiting

## Variables de Entorno Requeridas

Agrega las siguientes variables a tu archivo `.env.local`:

```bash
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=your_upstash_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token_here
```

## Configuración de Upstash Redis

1. **Crear cuenta en Upstash**: Ve a [upstash.com](https://upstash.com) y crea una cuenta
2. **Crear base de datos Redis**: Crea una nueva base de datos Redis
3. **Obtener credenciales**: Copia la URL y el token de la base de datos
4. **Configurar variables**: Agrega las variables de entorno

## Configuraciones de Rate Limiting

### ✅ Límites Implementados

| Tipo | Límite | Ventana | Descripción |
|------|--------|---------|-------------|
| **API General** | 100 req/min | 1 minuto | Endpoints generales de API |
| **Autenticación** | 10 req/min | 1 minuto | Login, registro, recuperación |
| **Público** | 200 req/min | 1 minuto | Endpoints públicos |
| **Upload** | 5 req/min | 1 minuto | Subida de archivos |

### ✅ Características

- **Sliding Window**: Ventana deslizante para límites más precisos
- **Headers HTTP**: Información de límites en cada respuesta
- **Auto-detección**: Tipo de límite basado en la ruta
- **Fallback**: Si Redis falla, no bloquea las peticiones
- **Analytics**: Métricas de uso en Upstash

## Uso en el Cliente

### Hook de Rate Limiting
```tsx
import { useRateLimit } from '@/lib/hooks/use-rate-limit'

function MyComponent() {
  const { checkRateLimit, isRateLimited, getRetryAfter } = useRateLimit()
  
  const handleApiCall = async () => {
    try {
      const response = await checkRateLimit('/api/data')
      const data = await response.json()
      // Procesar datos
    } catch (error) {
      if (error.message.includes('Rate limit exceeded')) {
        // Mostrar mensaje de error
        console.log(`Try again in ${getRetryAfter()} seconds`)
      }
    }
  }
  
  return (
    <div>
      {isRateLimited && (
        <p>Rate limit exceeded. Try again in {getRetryAfter()} seconds.</p>
      )}
      <button onClick={handleApiCall}>Make API Call</button>
    </div>
  )
}
```

### Indicador Visual
```tsx
import { RateLimitIndicator } from '@/components/rate-limit-indicator'

function MyPage() {
  return (
    <div>
      <RateLimitIndicator />
      {/* Resto del contenido */}
    </div>
  )
}
```

## Headers HTTP

Cada respuesta incluye headers de rate limiting:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Respuesta de Error (429)

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

## Monitoreo

### Upstash Console
1. Ve a tu dashboard de Upstash
2. Selecciona tu base de datos Redis
3. Ve a "Analytics" para ver métricas de uso
4. Monitorea picos de tráfico y límites

### Logs de Aplicación
- Errores de rate limiting se registran en Sentry
- Headers de límites en cada respuesta
- Métricas de uso en tiempo real

## Beneficios

- 🛡️ **Protección contra abuso** - Previene ataques DDoS
- 📊 **Métricas de uso** - Monitoreo de tráfico en tiempo real
- ⚡ **Rendimiento** - Evita sobrecarga del servidor
- 🔧 **Configuración flexible** - Diferentes límites por tipo de endpoint
- 📈 **Escalabilidad** - Fácil ajuste de límites según necesidades

## Configuración Avanzada

### Ajustar Límites
Edita `lib/rate-limit.ts` para modificar los límites:

```typescript
export const rateLimits = {
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(150, '1 m'), // 150 req/min
    analytics: true,
    prefix: 'ratelimit:api',
  }),
  // ... otros límites
}
```

### Agregar Nuevos Tipos
```typescript
// Nuevo tipo de límite
premium: new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(500, '1 m'), // 500 req/min
  analytics: true,
  prefix: 'ratelimit:premium',
}),
```

### Configuración por Usuario
```typescript
// Límite basado en user ID
const { success } = await ratelimit.limit(`user:${userId}`)
```
