# 🚨 Configuración de Variables de Entorno para Sentry

## Variables de Entorno Requeridas

Agrega las siguientes variables a tu archivo `.env.local`:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org_here
SENTRY_PROJECT=your_sentry_project_here
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
```

## Configuración por Entorno

### **Desarrollo (.env.local)**

```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=swim-app-dev
SENTRY_AUTH_TOKEN=your-auth-token
```

### **Producción (Vercel)**

```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-production-dsn@sentry.io/project-id
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=swim-app-prod
SENTRY_AUTH_TOKEN=your-production-auth-token
```

## Pasos de Configuración

1. **Crear cuenta en Sentry**: Ve a [sentry.io](https://sentry.io) y crea una cuenta
2. **Crear organización**: Crea una nueva organización
3. **Crear proyecto**: Crea un nuevo proyecto para Next.js
4. **Obtener DSN**: Copia el DSN del proyecto
5. **Generar Auth Token**: Ve a Settings > Auth Tokens y genera un token
6. **Configurar variables**: Agrega las variables de entorno

## Verificación de Configuración

```bash
# Verificar que las variables están configuradas
npm run validate:sentry

# Verificar conectividad con Sentry
npm run sentry:test
```

## Scripts Disponibles

```json
{
  "sentry:sourcemaps": "sentry-cli sourcemaps upload --release-commit HEAD~1..HEAD",
  "sentry:test": "sentry-cli info",
  "validate:sentry": "node scripts/validate-sentry.js"
}
```

## Troubleshooting

### Error: DSN not configured

- Verificar que `NEXT_PUBLIC_SENTRY_DSN` está configurado
- Verificar que el DSN es válido

### Error: Auth token invalid

- Verificar que `SENTRY_AUTH_TOKEN` está configurado
- Verificar que el token tiene permisos correctos

### Error: Organization not found

- Verificar que `SENTRY_ORG` coincide con el slug de la organización
- Verificar que el token tiene acceso a la organización
