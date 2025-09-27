# 🏗️ Infraestructura

Esta carpeta contiene toda la configuración de infraestructura y servicios externos.

## 📁 Estructura

### `database/`
Scripts SQL y migraciones de Supabase:
- `supabase-schema.sql` - Esquema principal
- `supabase-rls-policies.sql` - Políticas RLS
- `clubs-teams-final.sql` - Estructura de clubes y equipos
- `fix-rls-policies.sql` - Correcciones de políticas

### `middleware/`
Middleware personalizado:
- `rate-limit-middleware.ts` - Rate limiting avanzado

### `providers/`
Context providers de React:
- `app-providers.tsx` - Providers principales (Query, Theme, etc.)

### `config/`
Configuraciones específicas de la aplicación:
- `app-config.ts` - Configuración general
- `rate-limit-config.ts` - Configuración de rate limiting
- `supabase-config.ts` - Configuración de Supabase
- `actions/` - Server actions de Next.js

## 🔧 Configuración

### Variables de Entorno Requeridas
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
UPSTASH_REDIS_REST_URL=tu_url_redis
UPSTASH_REDIS_REST_TOKEN=tu_token_redis
ADMIN_API_TOKEN=tu_token_admin
```

### Rate Limiting
- Configuración automática con fallback a memoria
- Monitoreo en tiempo real
- Dashboard de administración

### Base de Datos
- PostgreSQL con Supabase
- Row Level Security (RLS)
- Real-time subscriptions
- Migraciones automáticas

## 🚀 Despliegue

Ver [docs/DEPLOYMENT_SETUP.md](../docs/DEPLOYMENT_SETUP.md) para instrucciones detalladas de despliegue.
