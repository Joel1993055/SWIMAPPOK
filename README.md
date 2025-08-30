# 🏊‍♂️ Swim APP - Plataforma de Análisis de Natación

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.1-black?style=for-the-badge&logo=next.js" alt="Next.js 15.2.1" />
  <img src="https://img.shields.io/badge/TypeScript-5.7.2-blue?style=for-the-badge&logo=typescript" alt="TypeScript 5.7.2" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase" alt="Supabase" />
</div>

<br/>

<div align="center">
  <h3>🚀 La plataforma de análisis de natación más avanzada para nadadores de todos los niveles</h3>
  <p>Analiza, optimiza y mejora tu entrenamiento con datos precisos, visualizaciones profesionales y insights accionables.</p>
</div>

<br/>

## ✨ Características Principales

### 🎯 **Dashboard Inteligente**
- **KPIs en tiempo real** - Métricas clave de rendimiento actualizadas al instante
- **Gráficos interactivos** - Visualizaciones profesionales con Recharts
- **Análisis detallado** - Seguimiento completo de sesiones y progreso
- **Responsive design** - Optimizado para todos los dispositivos

### 📊 **Gestión de Entrenamientos**
- **Formulario rápido** - Añadir entrenamientos en segundos
- **Formulario avanzado** - Modal completo con todos los campos
- **Calendario anual** - Vista de 12 meses con heatmap por distancia
- **Filtros avanzados** - Por estilo, tipo, fecha y búsqueda de texto
- **Exportación CSV** - Descarga de datos filtrados

### 🎨 **Interfaz Moderna**
- **Diseño profesional** - UI/UX inspirada en las mejores prácticas
- **Componentes shadcn/ui** - Sistema de componentes robusto y accesible
- **Tema oscuro/claro** - Soporte completo para ambos temas
- **Animaciones fluidas** - Transiciones suaves y feedback visual

### 🔒 **Autenticación y Seguridad**
- **Supabase Auth** - Sistema de autenticación robusto y seguro
- **Middleware protegido** - Rutas seguras y control de acceso
- **Cookies seguras** - Gestión de sesiones con SSR
- **Variables de entorno** - Configuración segura de credenciales

## 🚀 Demo y Acceso

### **Landing Page Pública**
- **URL**: `/` - Página principal con información del producto
- **Características**: Presentación completa, testimonios, CTA

### **Dashboard de Vista Previa**
- **URL**: `/preview-dashboard` - Dashboard público sin login
- **Datos**: Ejemplos reales para demostración
- **Acceso**: Libre para todos los visitantes

### **Dashboard Demo Profesional**
- **URL**: `/dashboard-demo` - Layout completo con sidebar
- **Funcionalidades**: Todas las características implementadas
- **Persistencia**: Datos guardados en localStorage

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **Next.js 15** - Framework React con App Router
- **TypeScript 5.7.2** - Tipado estático y mejor DX
- **Tailwind CSS 3.4.17** - Framework CSS utility-first
- **shadcn/ui** - Sistema de componentes profesionales

### **Backend y Base de Datos**
- **Supabase** - Backend as a Service completo
- **PostgreSQL** - Base de datos relacional robusta
- **Row Level Security** - Seguridad a nivel de fila
- **Real-time subscriptions** - Actualizaciones en tiempo real

### **Estado y Gestión de Datos**
- **Zustand** - Gestión de estado ligera y eficiente
- **React Query** - Gestión de datos del servidor
- **Zod** - Validación de esquemas TypeScript

### **Herramientas de Desarrollo**
- **ESLint** - Linting y calidad de código
- **Prettier** - Formateo automático de código
- **Husky** - Git hooks para calidad
- **TypeScript** - Verificación de tipos en build

## 📱 Estructura del Proyecto

```
swimappcursor/
├── app/                          # App Router de Next.js
│   ├── (auth-pages)/            # Páginas de autenticación
│   ├── dashboard/                # Dashboard principal
│   ├── dashboard-demo/           # Dashboard demo público
│   ├── preview-dashboard/        # Vista previa del dashboard
│   ├── protected/                # Rutas protegidas
│   └── layout.tsx               # Layout principal
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes base (shadcn/ui)
│   ├── dashboard-demo/          # Componentes específicos del dashboard
│   ├── landing/                 # Componentes de la landing page
│   └── tutorial/                # Componentes de tutorial
├── lib/                         # Utilidades y lógica de negocio
│   ├── store/                   # Stores de Zustand
│   ├── types/                   # Tipos TypeScript
│   ├── utils/                   # Funciones utilitarias
│   └── aggregations.ts          # Cálculos de métricas
├── hooks/                       # Custom hooks de React
├── styles/                      # Estilos globales
└── public/                      # Assets estáticos
```

## 🎯 Funcionalidades Implementadas

### **Sistema de Sesiones**
- ✅ Crear, editar y eliminar entrenamientos
- ✅ Filtros avanzados por múltiples criterios
- ✅ Exportación de datos a CSV
- ✅ Persistencia local con localStorage
- ✅ Validación de datos con Zod

### **Métricas y Análisis**
- ✅ KPIs en tiempo real
- ✅ Gráficos interactivos de progreso
- ✅ Calendario anual con heatmap
- ✅ Cálculos de totales y promedios
- ✅ Filtros por período y criterios

### **Interfaz de Usuario**
- ✅ Diseño responsive y moderno
- ✅ Tema oscuro/claro
- ✅ Navegación intuitiva
- ✅ Componentes accesibles
- ✅ Animaciones fluidas

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ 
- npm, yarn o pnpm
- Cuenta de Supabase

### **1. Clonar el Repositorio**
   ```bash
git clone git@github.com:Joel1993055/swimappcursor.git
cd swimappcursor
   ```

### **2. Instalar Dependencias**
   ```bash
npm install
# o
yarn install
# o
pnpm install
```

### **3. Configurar Variables de Entorno**
   ```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar .env.local con tus credenciales de Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

### **4. Ejecutar en Desarrollo**
   ```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

El proyecto estará disponible en [http://localhost:3000](http://localhost:3000)

## 📊 Scripts Disponibles

```json
{
  "dev": "next dev",                    # Servidor de desarrollo
  "build": "next build",                # Build de producción
  "start": "next start",                # Servidor de producción
  "lint": "next lint",                  # Linting del código
  "type-check": "tsc --noEmit",         # Verificación de tipos
  "build-check": "npm run type-check && npm run build",  # Build + type check
  "pre-commit": "npm run lint && npm run type-check"     # Pre-commit hooks
}
```

## 🌐 Deployment

### **Vercel (Recomendado)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJoel1993055%2Fswimappcursor)

### **Supabase Integration**
El proyecto incluye integración automática con Supabase:
- Variables de entorno configuradas automáticamente
- Base de datos y autenticación listas para usar
- Real-time subscriptions configuradas

### **Variables de Entorno Requeridas**
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

## 🔧 Desarrollo Local

### **Estructura de Datos**
```typescript
interface Session {
  id: string;
  date: string;                    // Formato ISO
  swimmer: string;                 // Nombre del nadador
  distance: number;                // Distancia en metros
  durationMin: number;             // Duración en minutos
  stroke: StrokeType;              // Estilo de natación
  sessionType: SessionType;        // Tipo de entrenamiento
  mainSet: string;                 // Serie principal
  RPE: number;                     // Rate of Perceived Exertion (1-10)
  notes?: string;                  // Notas opcionales
}
```

### **Stores de Estado**
- **`useSessionsStore`** - Gestión de sesiones de entrenamiento
- **`useAuthStore`** - Estado de autenticación del usuario
- **`useThemeStore`** - Gestión del tema (claro/oscuro)

### **Componentes Principales**
- **`DashboardLayout`** - Layout principal del dashboard
- **`KPICards`** - Tarjetas de métricas clave
- **`SessionsTable`** - Tabla de sesiones con paginación
- **`YearCalendar`** - Calendario anual con heatmap
- **`QuickAddForm`** - Formulario rápido de sesiones

## 📈 Roadmap

### **Fase 1 - Core Features** ✅
- [x] Sistema de autenticación
- [x] Dashboard básico
- [x] Gestión de sesiones
- [x] Métricas básicas

### **Fase 2 - Analytics Avanzados** 🚧
- [ ] Gráficos de progreso a largo plazo
- [ ] Análisis de tendencias
- [ ] Comparativas entre períodos
- [ ] Metas y objetivos

### **Fase 3 - Social y Colaboración** 📋
- [ ] Compartir entrenamientos
- [ ] Grupos de entrenamiento
- [ ] Rankings y competencias
- [ ] Sistema de logros

### **Fase 4 - Mobile y Offline** 📱
- [ ] PWA completa
- [ ] Sincronización offline
- [ ] Notificaciones push
- [ ] Integración con wearables

## 🤝 Contribuir

### **Cómo Contribuir**
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### **Estándares de Código**
- **TypeScript** - Tipado estricto requerido
- **ESLint** - Reglas de linting configuradas
- **Prettier** - Formateo automático
- **Conventional Commits** - Formato de commits estándar

### **Testing**
   ```bash
# Ejecutar tests
npm run test

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Next.js Team** - Framework increíble
- **Supabase** - Backend as a Service
- **shadcn/ui** - Componentes hermosos
- **Tailwind CSS** - Framework CSS utility-first
- **Comunidad open source** - Inspiración y contribuciones

## 📞 Contacto

- **Desarrollador**: Joel
- **GitHub**: [@Joel1993055](https://github.com/Joel1993055)
- **Proyecto**: [Swim APP](https://github.com/Joel1993055/swimappcursor)

---

<div align="center">
  <p>⭐ Si este proyecto te gusta, ¡dale una estrella en GitHub!</p>
  <p>🏊‍♂️ ¡Nada hacia el éxito con Swim APP!</p>
</div>