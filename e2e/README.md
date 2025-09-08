# E2E Tests with Playwright

Este directorio contiene los tests end-to-end (E2E) para la aplicación, utilizando Playwright como framework de testing.

## Estructura

```
e2e/
├── README.md                 # Este archivo
├── test.config.ts           # Configuración y constantes de testing
├── utils/
│   └── test-helpers.ts      # Funciones auxiliares para tests
├── homepage.spec.ts         # Tests para la página principal
├── auth.spec.ts            # Tests de autenticación
├── database.spec.ts        # Tests de operaciones de base de datos
└── integration.spec.ts     # Tests de integración completos
```

## Comandos disponibles

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar tests con interfaz gráfica
npm run test:e2e:ui

# Ejecutar tests en modo headed (con navegador visible)
npm run test:e2e:headed

# Ejecutar tests en modo debug
npm run test:e2e:debug

# Ver reporte de tests
npm run test:e2e:report
```

## Configuración

Los tests están configurados para ejecutarse en diferentes navegadores:
- Chromium
- Firefox
- WebKit (Safari)
- Mobile Chrome
- Mobile Safari

## Variables de entorno

Los tests utilizan las siguientes variables de entorno:
- `PLAYWRIGHT_BASE_URL`: URL base para los tests (por defecto: http://localhost:3000)

## Escribiendo tests

### Estructura básica de un test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome');
  });
});
```

### Usando helpers

```typescript
import { waitForPageLoad, fillForm } from './utils/test-helpers';

test('should fill form', async ({ page }) => {
  await page.goto('/');
  await fillForm(page, {
    email: 'test@example.com',
    password: 'password123'
  });
});
```

### Mocking API responses

```typescript
import { mockApiResponse } from './utils/test-helpers';

test('should handle API response', async ({ page }) => {
  await mockApiResponse(page, '**/api/data', { data: [] });
  await page.goto('/');
  // ... rest of test
});
```

## Mejores prácticas

1. **Usa data-testid**: Agrega atributos `data-testid` a elementos importantes para facilitar la selección en tests.

2. **Espera a que la página cargue**: Usa `waitForPageLoad()` para asegurar que la página esté completamente cargada.

3. **Mockea APIs**: Usa `mockApiResponse()` para simular respuestas de API y hacer tests más rápidos y confiables.

4. **Tests independientes**: Cada test debe ser independiente y no depender de otros tests.

5. **Limpia el estado**: Usa `clearAuthentication()` si es necesario para limpiar el estado entre tests.

## Debugging

Para debuggear tests:

1. Usa `npm run test:e2e:debug` para ejecutar en modo debug
2. Usa `page.pause()` en el código del test para pausar la ejecución
3. Usa `page.screenshot()` para tomar capturas de pantalla
4. Usa `page.locator().hover()` para inspeccionar elementos
