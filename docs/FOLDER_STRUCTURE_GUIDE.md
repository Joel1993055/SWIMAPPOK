# 📁 Guía de Estructura de Carpetas - Swim APP

## 🏗️ Estructura Actual vs Recomendada

### **Estructura Actual**

```
swimappcursor/
├── app/                          # App Router de Next.js
├── components/                   # Componentes reutilizables
├── lib/                         # Utilidades y lógica de negocio
├── hooks/                       # Custom hooks de React
├── styles/                      # Estilos globales
└── public/                      # Assets estáticos
```

### **Estructura Recomendada (Escalable)**

```
swimappcursor/
├── app/                         # App Router de Next.js
│   ├── (auth-pages)/            # Páginas de autenticación
│   ├── dashboard/               # Dashboard principal
│   ├── admin/                   # Panel de administración
│   ├── api/                     # API routes
│   └── globals.css              # Estilos globales
├── src/                         # Código fuente principal
│   ├── components/              # Componentes reutilizables
│   │   ├── ui/                  # Componentes base (shadcn/ui)
│   │   ├── features/            # Componentes por funcionalidad
│   │   ├── layout/              # Componentes de layout
│   │   └── common/              # Componentes comunes
│   ├── lib/                     # Utilidades y lógica de negocio
│   │   ├── actions/             # Server actions
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # Servicios externos
│   │   ├── store/               # Estado global (Zustand)
│   │   ├── types/               # Tipos TypeScript
│   │   └── utils/               # Funciones utilitarias
│   ├── styles/                  # Estilos específicos
│   └── constants/               # Constantes de la aplicación
├── docs/                        # Documentación
├── scripts/                     # Scripts de utilidad
├── tests/                       # Tests organizados
│   ├── __tests__/              # Tests unitarios
│   ├── e2e/                    # Tests end-to-end
│   └── fixtures/               # Datos de prueba
└── public/                     # Assets estáticos
```

## 📋 Plan de Migración

### **Fase 1: Crear nueva estructura**

1. Crear carpeta `src/`
2. Mover `components/` a `src/components/`
3. Mover `lib/` a `src/lib/`
4. Crear carpetas faltantes

### **Fase 2: Reorganizar componentes**

1. Separar componentes por funcionalidad
2. Crear subcarpetas dentro de `features/`
3. Mover componentes comunes a `common/`

### **Fase 3: Actualizar imports**

1. Actualizar todos los imports relativos
2. Configurar path mapping en `tsconfig.json`
3. Actualizar archivos de configuración

### **Fase 4: Limpiar estructura antigua**

1. Eliminar carpetas vacías
2. Actualizar documentación
3. Verificar que todo funciona

## 🎯 Beneficios de la Nueva Estructura

### **Escalabilidad**

- Fácil agregar nuevas funcionalidades
- Separación clara de responsabilidades
- Estructura predecible

### **Mantenibilidad**

- Fácil encontrar archivos
- Código más organizado
- Menos conflictos en Git

### **Performance**

- Mejor tree shaking
- Imports más eficientes
- Lazy loading optimizado

## 📝 Convenciones de Nomenclatura

### **Carpetas**

- `kebab-case` para carpetas
- Nombres descriptivos y claros
- Agrupación por funcionalidad

### **Archivos**

- `kebab-case` para archivos de componentes
- `camelCase` para archivos de utilidades
- `PascalCase` para archivos de tipos

### **Componentes**

- `PascalCase` para nombres de componentes
- Sufijos descriptivos (`Button`, `Card`, `Modal`)
- Agrupación por funcionalidad

## 🔧 Configuración de Paths

### **tsconfig.json**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/lib/hooks/*"],
      "@/types/*": ["./src/lib/types/*"],
      "@/utils/*": ["./src/lib/utils/*"],
      "@/store/*": ["./src/lib/store/*"]
    }
  }
}
```

### **next.config.ts**

```typescript
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // ... otras configuraciones
};
```

## 📊 Métricas de Mejora

### **Antes de la Reorganización**

- ❌ Imports relativos confusos
- ❌ Componentes mezclados
- ❌ Difícil escalabilidad
- ❌ Estructura inconsistente

### **Después de la Reorganización**

- ✅ Imports absolutos claros
- ✅ Componentes organizados por funcionalidad
- ✅ Fácil escalabilidad
- ✅ Estructura consistente y predecible

## 🚀 Próximos Pasos

1. **Implementar nueva estructura** (1-2 días)
2. **Migrar componentes gradualmente** (3-5 días)
3. **Actualizar imports y configuraciones** (1-2 días)
4. **Verificar y limpiar** (1 día)
5. **Documentar cambios** (1 día)

## 📚 Referencias

- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [React Component Organization](https://react.dev/learn/thinking-in-react)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
