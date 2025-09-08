# 🚀 Optimistic Updates con React Query

## ¿Qué son las Optimistic Updates?

Las **Optimistic Updates** son una técnica de UX que actualiza la interfaz de usuario
**inmediatamente** cuando el usuario realiza una acción, antes de que la respuesta del servidor
confirme que la operación fue exitosa. Esto crea una experiencia más fluida y responsiva.

## 🎯 Beneficios

- ⚡ **UX más rápida** - El usuario ve cambios inmediatos
- 🔄 **Feedback instantáneo** - No hay espera para ver resultados
- 🛡️ **Rollback automático** - Si falla, se revierte automáticamente
- 📱 **Mejor percepción de rendimiento** - La app se siente más rápida

## 🏗️ Arquitectura Implementada

### 1. Hook Genérico (`use-optimistic-mutation.ts`)

```typescript
import { useOptimisticMutation } from '@/lib/hooks/use-optimistic-mutation';

// Configuración personalizada
const config = {
  queryKeys: [['sessions']],
  getPreviousData: queryClient => ({
    /* snapshot */
  }),
  applyOptimisticUpdate: (queryClient, variables, context) => {
    /* update UI */
  },
  revertOnError: (queryClient, context) => {
    /* rollback */
  },
  updateWithServerData: (queryClient, data, variables, context) => {
    /* sync with server */
  },
};

const mutation = useOptimisticMutation(mutationFn, config);
```

### 2. Hooks de Conveniencia

```typescript
// Para operaciones CRUD estándar
const createMutation = useOptimisticCreate(api.createSession, sessionsKeys);
const updateMutation = useOptimisticUpdate(api.updateSession, sessionsKeys);
const deleteMutation = useOptimisticDelete(api.deleteSession, sessionsKeys);
```

## 📋 Implementación por Entidad

### Sesiones (`use-sessions-query.ts`)

```typescript
// ✅ CREATE con optimistic update
export function useCreateSessionMutation() {
  return useMutation({
    mutationFn: api.createSession,
    onMutate: async newSession => {
      // 1. Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: sessionsKeys.all });

      // 2. Snapshot del estado anterior
      const previousSessions = queryClient.getQueriesData({ queryKey: sessionsKeys.all });

      // 3. Crear sesión optimista temporal
      const optimisticSession = {
        ...newSession,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current-user',
      };

      // 4. Actualizar cache optimistamente
      queryClient.setQueriesData({ queryKey: sessionsKeys.lists() }, old =>
        old ? [optimisticSession, ...old] : [optimisticSession]
      );

      return { previousSessions, optimisticSession };
    },
    onError: (error, variables, context) => {
      // 5. Rollback en caso de error
      if (context?.previousSessions) {
        context.previousSessions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (data, variables, context) => {
      // 6. Actualizar con datos reales del servidor
      queryClient.setQueriesData({ queryKey: sessionsKeys.lists() }, old =>
        old?.map(session => (session.id === context?.optimisticSession.id ? data : session))
      );
    },
  });
}
```

### Competencias (`use-competitions-query.ts`)

```typescript
// ✅ Todas las operaciones CRUD con optimistic updates
export function useCreateCompetitionMutation() {
  // Implementación similar con lógica específica para competencias
  // - Actualización de competencia principal
  // - Actualización de competencias próximas
  // - Actualización por prioridad
}
```

## 🔄 Flujo de Optimistic Update

### 1. **onMutate** - Actualización Optimista

```typescript
onMutate: async variables => {
  // 1. Cancelar queries en progreso
  await queryClient.cancelQueries({ queryKey: entityKeys.all });

  // 2. Crear snapshot del estado anterior
  const previousData = queryClient.getQueriesData({ queryKey: entityKeys.all });

  // 3. Aplicar cambios optimistamente
  queryClient.setQueriesData(/* actualizar UI inmediatamente */);

  // 4. Retornar contexto para rollback
  return { previousData, optimisticItem };
};
```

### 2. **onError** - Rollback Automático

```typescript
onError: (error, variables, context) => {
  // Revertir a estado anterior
  if (context?.previousData) {
    context.previousData.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data);
    });
  }

  // Mostrar error al usuario
  console.error('Operation failed:', error);
};
```

### 3. **onSuccess** - Sincronización con Servidor

```typescript
onSuccess: (data, variables, context) => {
  // Reemplazar datos optimistas con datos reales
  queryClient.setQueriesData(/* actualizar con datos del servidor */);

  // Invalidar para sincronizar
  queryClient.invalidateQueries({ queryKey: entityKeys.all });
};
```

### 4. **onSettled** - Limpieza Final

```typescript
onSettled: () => {
  // Siempre invalidar al final para asegurar consistencia
  queryClient.invalidateQueries({ queryKey: entityKeys.all });
};
```

## 🛠️ Uso en Componentes

### Ejemplo Básico

```tsx
import { useCreateSessionMutation } from '@/lib/hooks/queries/use-sessions-query';

function CreateSessionForm() {
  const createSession = useCreateSessionMutation();

  const handleSubmit = async formData => {
    try {
      // La UI se actualiza inmediatamente (optimistic)
      await createSession.mutateAsync(formData);
      // Si llega aquí, la operación fue exitosa
    } catch (error) {
      // El rollback ya se hizo automáticamente
      // Solo necesitamos mostrar el error al usuario
      toast.error('Error al crear la sesión');
    }
  };

  return <form onSubmit={handleSubmit}>{/* Formulario */}</form>;
}
```

### Ejemplo con Estados de Carga

```tsx
function SessionCard({ session }) {
  const updateSession = useUpdateSessionMutation();
  const deleteSession = useDeleteSessionMutation();

  const handleUpdate = updates => {
    updateSession.mutate(
      { id: session.id, updates },
      {
        onSuccess: () => toast.success('Sesión actualizada'),
        onError: () => toast.error('Error al actualizar'),
      }
    );
  };

  const handleDelete = () => {
    deleteSession.mutate(session.id, {
      onSuccess: () => toast.success('Sesión eliminada'),
      onError: () => toast.error('Error al eliminar'),
    });
  };

  return (
    <div>
      <h3>{session.name}</h3>
      <button onClick={() => handleUpdate({ name: 'Nuevo nombre' })}>Actualizar</button>
      <button onClick={handleDelete}>Eliminar</button>
    </div>
  );
}
```

## 🎨 Patrones de UI para Optimistic Updates

### 1. **Indicadores Visuales**

```tsx
function OptimisticButton({ mutation, children, ...props }) {
  return (
    <button
      {...props}
      disabled={mutation.isPending}
      className={cn('transition-opacity', mutation.isPending && 'opacity-50')}
    >
      {mutation.isPending ? (
        <>
          <Loader2 className='w-4 h-4 animate-spin mr-2' />
          Procesando...
        </>
      ) : (
        children
      )}
    </button>
  );
}
```

### 2. **Estados Temporales**

```tsx
function SessionItem({ session }) {
  const updateSession = useUpdateSessionMutation();

  return (
    <div
      className={cn(
        'p-4 border rounded-lg',
        updateSession.isPending && 'bg-blue-50 border-blue-200',
        updateSession.isError && 'bg-red-50 border-red-200'
      )}
    >
      <h3>{session.name}</h3>
      {updateSession.isPending && <div className='text-sm text-blue-600'>Actualizando...</div>}
    </div>
  );
}
```

### 3. **Animaciones de Transición**

```tsx
function SessionList({ sessions }) {
  return (
    <AnimatePresence>
      {sessions.map(session => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <SessionItem session={session} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

## 🧪 Testing de Optimistic Updates

### Test de Actualización Optimista

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCreateSessionMutation } from '@/lib/hooks/queries/use-sessions-query'

test('should apply optimistic update immediately', async () => {
  const queryClient = new QueryClient()

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  const { result } = renderHook(() => useCreateSessionMutation(), { wrapper })

  // Verificar que no hay sesiones inicialmente
  expect(queryClient.getQueryData(['sessions', 'list'])).toBeUndefined()

  // Ejecutar mutación
  result.current.mutate({
    name: 'Test Session',
    date: '2024-01-01'
  })

  // Verificar que se aplicó la actualización optimista
  await waitFor(() => {
    const sessions = queryClient.getQueryData(['sessions', 'list'])
    expect(sessions).toHaveLength(1)
    expect(sessions[0].name).toBe('Test Session')
    expect(sessions[0].id).toMatch(/^temp-/)
  })
})
```

### Test de Rollback en Error

```typescript
test('should rollback on error', async () => {
  // Mock API para que falle
  jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'))

  const queryClient = new QueryClient()
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  const { result } = renderHook(() => useCreateSessionMutation(), { wrapper })

  // Ejecutar mutación que fallará
  result.current.mutate({
    name: 'Test Session',
    date: '2024-01-01'
  })

  // Esperar a que falle y se haga rollback
  await waitFor(() => {
    expect(result.current.isError).toBe(true)
    // Verificar que se revirtió el estado
    const sessions = queryClient.getQueryData(['sessions', 'list'])
    expect(sessions).toBeUndefined()
  })
})
```

## 🚨 Consideraciones Importantes

### 1. **Conflictos de Concurrencia**

- Siempre cancelar queries en progreso antes de aplicar updates optimistas
- Usar `queryClient.cancelQueries()` en `onMutate`

### 2. **IDs Temporales**

- Usar IDs únicos para elementos optimistas (ej: `temp-${Date.now()}`)
- Reemplazar con IDs reales del servidor en `onSuccess`

### 3. **Validación de Datos**

- Validar datos antes de aplicar updates optimistas
- Manejar casos edge donde los datos del servidor difieren

### 4. **Estados de Error**

- Proporcionar feedback claro cuando fallan las operaciones
- Permitir al usuario reintentar la operación

### 5. **Performance**

- No aplicar optimistic updates para operaciones muy pesadas
- Considerar el impacto en el bundle size

## 📊 Métricas y Monitoreo

### 1. **Success Rate**

```typescript
// Trackear éxito de optimistic updates
const trackOptimisticUpdate = (operation: string, success: boolean) => {
  analytics.track('optimistic_update', {
    operation,
    success,
    timestamp: new Date().toISOString(),
  });
};
```

### 2. **Rollback Rate**

```typescript
// Trackear rollbacks
const trackRollback = (operation: string, error: Error) => {
  analytics.track('optimistic_rollback', {
    operation,
    error: error.message,
    timestamp: new Date().toISOString(),
  });
};
```

## 🎯 Mejores Prácticas

### ✅ Hacer

- Usar optimistic updates para operaciones rápidas y frecuentes
- Proporcionar feedback visual claro durante el proceso
- Implementar rollback robusto en caso de error
- Testear tanto el flujo exitoso como el de error

### ❌ Evitar

- Usar optimistic updates para operaciones críticas sin confirmación
- Aplicar updates optimistas sin validación de datos
- Olvidar manejar estados de error
- No testear el rollback automático

## 🔗 Referencias

- [React Query - Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [Optimistic UI Patterns](https://uxdesign.cc/optimistic-ui-patterns-7b5e1c5b1e2c)
- [Building Optimistic UIs](https://blog.logrocket.com/building-optimistic-uis-react-query/)

---

<div align="center">
  <p>🚀 <strong>Optimistic Updates</strong> - Haciendo que tu app se sienta instantánea</p>
</div>
