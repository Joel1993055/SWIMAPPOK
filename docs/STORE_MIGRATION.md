# 🚀 Guía de Migración a Store Unificado

## 📋 Resumen

Hemos creado un sistema de estado unificado usando Zustand que reemplaza gradualmente los múltiples React Contexts existentes.

## 🎯 Beneficios

- **✅ Estado centralizado** - Un solo lugar para toda la gestión de estado
- **✅ Mejor performance** - Menos re-renders innecesarios
- **✅ Persistencia automática** - Datos guardados en localStorage
- **✅ Type safety** - Tipos TypeScript completos
- **✅ Fácil testing** - Stores independientes y testeable

## 🏗️ Estructura del Store

```typescript
lib/store/unified.ts
├── useAuthStore          # Autenticación
├── useSessionsStore      # Sesiones de entrenamiento
├── useCompetitionsStore  # Competiciones
├── useTrainingStore      # Fases y zonas de entrenamiento
├── useAICoachStore       # AI Coach y consejos
├── useReportsStore       # Reportes y análisis
└── useUIStore           # Estado de UI (tema, sidebar, etc.)
```

## 🔄 Migración Gradual

### Paso 1: Usar el nuevo store (SIN tocar contexts existentes)

```typescript
// ❌ ANTES (Context)
import { useSessionsContext } from '@/lib/contexts/sessions-context';

// ✅ AHORA (Zustand)
import { useSessionsStore } from '@/lib/store/unified';

function MyComponent() {
  const { sessions, addSession, isLoading } = useSessionsStore();
  // ... resto del código
}
```

### Paso 2: Migrar datos existentes

```typescript
// Usar el hook de migración
import { useSessionsMigration } from '@/lib/hooks/use-migration';

function App() {
  useSessionsMigration(); // Migra datos automáticamente
  // ... resto del código
}
```

### Paso 3: Reemplazar context providers

```typescript
// ❌ ANTES
<CompetitionsProvider>
  <TrainingPhasesProvider>
    <AICoachProvider>
      {children}
    </AICoachProvider>
  </TrainingPhasesProvider>
</CompetitionsProvider>

// ✅ AHORA
<MigrationProvider>
  {children}
</MigrationProvider>
```

## 📚 Ejemplos de Uso

### Auth Store

```typescript
import { useAuthStore } from '@/lib/store/unified';

function LoginButton() {
  const { user, isAuthenticated, signOut } = useAuthStore();
  
  if (isAuthenticated) {
    return <Button onClick={signOut}>Cerrar Sesión</Button>;
  }
  
  return <Button>Iniciar Sesión</Button>;
}
```

### Sessions Store

```typescript
import { useSessionsStore } from '@/lib/store/unified';

function SessionsList() {
  const { 
    sessions, 
    addSession, 
    updateSession, 
    deleteSession,
    getTotalDistance 
  } = useSessionsStore();
  
  return (
    <div>
      <p>Total distancia: {getTotalDistance()}m</p>
      {sessions.map(session => (
        <div key={session.id}>
          {session.swimmer} - {session.distance}m
        </div>
      ))}
    </div>
  );
}
```

### UI Store

```typescript
import { useUIStore } from '@/lib/store/unified';

function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  
  return (
    <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
}
```

## 🔧 Hooks de Utilidad

### Migración Automática

```typescript
import { useCompleteMigration } from '@/lib/hooks/use-migration';

// Migra todos los datos automáticamente
useCompleteMigration();
```

### Compatibilidad

```typescript
import { useStoreCompatibility } from '@/lib/hooks/use-migration';

// Acceso a todos los stores en un solo hook
const {
  user,
  sessions,
  competitions,
  phases,
  advice,
  reports
} = useStoreCompatibility();
```

## ⚠️ Consideraciones Importantes

### 1. Migración Gradual
- **NO eliminar contexts existentes** hasta migrar todos los componentes
- **Usar ambos sistemas** durante la transición
- **Verificar funcionalidad** después de cada migración

### 2. Persistencia
- Los datos se guardan automáticamente en localStorage
- Cada store tiene su propia clave de almacenamiento
- La migración preserva datos existentes

### 3. Performance
- Zustand es más eficiente que Context para estado complejo
- Menos re-renders innecesarios
- Mejor para aplicaciones grandes

## 🧪 Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useSessionsStore } from '@/lib/store/unified';

test('should add session', () => {
  const { result } = renderHook(() => useSessionsStore());
  
  act(() => {
    result.current.addSession({
      date: '2024-01-01',
      swimmer: 'Test',
      distance: 1000,
      durationMin: 30,
      stroke: 'freestyle',
      sessionType: 'aerobic',
      mainSet: 'Test',
      RPE: 6
    });
  });
  
  expect(result.current.sessions).toHaveLength(1);
});
```

## 📈 Próximos Pasos

1. **Migrar componentes uno por uno** - Empezar por los más simples
2. **Eliminar contexts vacíos** - Después de migrar todos los usos
3. **Optimizar stores** - Añadir selectors específicos si es necesario
4. **Añadir middleware** - Para logging, devtools, etc.

## 🆘 Troubleshooting

### Error: "Cannot find module"
```bash
# Verificar que el archivo existe
ls lib/store/unified.ts
```

### Error: "Store not updating"
```typescript
// Verificar que estás usando el hook correctamente
const { sessions } = useSessionsStore(); // ✅ Correcto
const sessions = useSessionsStore().sessions; // ❌ Incorrecto
```

### Error: "Data not persisting"
```typescript
// Verificar que el store tiene persist middleware
export const useSessionsStore = create<SessionsStore>()(
  persist(
    (set, get) => ({ /* ... */ }),
    { name: 'sessions-storage' } // ✅ Clave de persistencia
  )
);
```

## 🎉 Conclusión

El nuevo sistema de stores unificado proporciona:
- **Mejor organización** del código
- **Mejor performance** de la aplicación
- **Mejor experiencia de desarrollo**
- **Fácil migración** gradual

¡La migración es segura y reversible en cualquier momento!
