# 🚨 Configuración de Sentry para Error Tracking

## Variables de Entorno Requeridas

Agrega las siguientes variables a tu archivo `.env.local`:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org_here
SENTRY_PROJECT=your_sentry_project_here
```

## Configuración de Sentry

1. **Crear cuenta en Sentry**: Ve a [sentry.io](https://sentry.io) y crea una cuenta
2. **Crear proyecto**: Crea un nuevo proyecto para Next.js
3. **Obtener DSN**: Copia el DSN del proyecto
4. **Configurar variables**: Agrega las variables de entorno

## Características Implementadas

### ✅ Error Boundary

- Captura errores de React automáticamente
- UI de error personalizada
- Botón de "Intentar de nuevo"

### ✅ Hook de Error Handling

- `useErrorHandler()` para manejo manual de errores
- Contexto personalizado para cada error
- Filtrado de errores en desarrollo

### ✅ Performance Monitoring

- Trazado de rendimiento automático
- Sample rate configurable por entorno
- Session Replay para debugging

### ✅ Configuración por Entorno

- **Desarrollo**: Debug habilitado, sample rate 100%
- **Producción**: Debug deshabilitado, sample rate 10%

## Uso

### Error Boundary Automático

```tsx
// Ya está configurado en app/layout.tsx
// Captura automáticamente todos los errores de React
```

### Manejo Manual de Errores

```tsx
import { useErrorHandler } from '@/lib/hooks/use-error-handler';

function MyComponent() {
  const { captureError, captureMessage } = useErrorHandler();

  const handleError = () => {
    try {
      // Código que puede fallar
    } catch (error) {
      captureError(error, {
        component: 'MyComponent',
        action: 'handleError',
        userId: 'user123',
      });
    }
  };

  return <button onClick={handleError}>Click me</button>;
}
```

## Monitoreo en Producción

1. **Dashboard de Sentry**: Ve a tu proyecto en Sentry
2. **Alertas**: Configura alertas por email/Slack
3. **Métricas**: Monitorea performance y errores
4. **Releases**: Rastrea errores por versión

## Beneficios

- 🚨 **Detección temprana** de errores en producción
- 📊 **Métricas de rendimiento** en tiempo real
- 🔍 **Debugging avanzado** con contexto completo
- 📈 **Mejora continua** basada en datos reales
