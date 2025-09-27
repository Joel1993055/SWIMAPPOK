# 🧠 Core - Lógica de Negocio

Esta carpeta contiene toda la lógica de negocio central de la aplicación.

## 📁 Estructura

### `hooks/`
Custom hooks de React para lógica reutilizable:
- `use-auth.ts` - Gestión de autenticación
- `use-sessions.ts` - Gestión de sesiones de entrenamiento
- `use-dashboard.ts` - Lógica del dashboard
- `use-local-storage.ts` - Persistencia local
- `use-theme.ts` - Gestión de temas

### `stores/`
Stores de Zustand para estado global:
- `auth-store.ts` - Estado de autenticación
- `sessions-store.ts` - Estado de sesiones
- `ui-store.ts` - Estado de UI (tema, sidebar, etc.)
- `competitions-store.ts` - Estado de competiciones
- `training-store.ts` - Estado de entrenamientos

### `types/`
Definiciones de tipos TypeScript:
- `auth.ts` - Tipos de autenticación
- `sessions.ts` - Tipos de sesiones
- `dashboard.ts` - Tipos del dashboard
- `api.ts` - Tipos de API
- `common.ts` - Tipos comunes

### `validations/`
Esquemas de validación con Zod:
- `auth-schemas.ts` - Validación de autenticación
- `session-schemas.ts` - Validación de sesiones
- `form-schemas.ts` - Validación de formularios

### `services/`
Servicios de API y lógica de negocio:
- `supabase-client.ts` - Cliente de Supabase
- `api-client.ts` - Cliente de API personalizado

### `utils/`
Utilidades específicas del dominio:
- `date-utils.ts` - Utilidades de fecha
- `format-utils.ts` - Utilidades de formato
- `calculation-utils.ts` - Cálculos de métricas
- `validation-utils.ts` - Utilidades de validación

## 🎯 Principios

- **Separación de responsabilidades** - Cada archivo tiene un propósito específico
- **Reutilización** - Lógica compartida entre componentes
- **Tipado fuerte** - TypeScript para mejor DX y menos errores
- **Validación** - Zod para validación de datos
- **Estado centralizado** - Zustand para gestión de estado
