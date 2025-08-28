<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- **Landing & Preview Dashboard** - Página pública con vista previa del dashboard
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Landing & Preview Dashboard

### Acceso Público
- **Landing Page**: `/` - Página principal con CTA al dashboard de vista previa
- **Preview Dashboard**: `/preview-dashboard` - Dashboard público sin login, con datos de ejemplo
- **Dashboard Demo**: `/dashboard-demo` - Layout profesional con sidebar, navbar y **nueva pestaña Log**

### Características del Preview Dashboard
- **KPIs en tiempo real**: Distancia total, promedio, sesiones, % técnica vs aeróbico
- **Gráficos interactivos**: Reutiliza componentes existentes (VolumeBarchart, ChartComponent)
- **Tabla de sesiones**: Datos de ejemplo con estilos, tipos y métricas
- **Sin autenticación**: Accesible públicamente para demostración
- **Responsive**: Adaptado a todos los dispositivos

### Características del Dashboard Demo
- **Layout profesional**: Sidebar + Navbar estilo dashboard-01
- **Tabs del Dashboard**: 
  - **Overview**: KPIs, gráficos existentes y widget "Este Mes"
  - **Log**: Nueva funcionalidad completa de gestión de entrenamientos
- **KPIs en Cards**: Métricas clave en grid responsive
- **Gráficos embebidos**: Tus componentes existentes en Cards elegantes
- **Tabla avanzada**: Búsqueda y paginación en cliente
- **Navegación completa**: Enlaces a todas las secciones

### Nueva Pestaña "Log" 🆕
- **Formulario rápido**: Añadir entrenamientos en segundos (fecha, distancia, estilo, tipo)
- **Formulario avanzado**: Modal completo con todos los campos (duración, RPE, series, notas)
- **Calendario anual**: Vista de 12 meses con heatmap por distancia, click para ver sesiones del día
- **Totales y filtros**: Métricas por período, filtros por estilo/tipo, exportación CSV
- **Tabla de sesiones**: Historial completo con edición, eliminación y paginación avanzada
- **Persistencia**: Datos guardados en localStorage (preparado para backend futuro)

> **Nota**: `/preview-dashboard` y `/dashboard-demo` son rutas públicas que no requieren login ni registro.

## Persistencia y Estructura de Datos

### Store de Sesiones (Zustand)
- **Persistencia**: Datos guardados automáticamente en localStorage
- **Acciones**: `addSession`, `updateSession`, `deleteSession`, `clearSessions`
- **Computed**: `getSessionsByDate`, `getSessionsByRange`
- **Nombre del storage**: `swim-sessions-storage`

### Modelo de Datos
```typescript
type Session = {
  id: string;
  date: string;            // ISO format
  swimmer: string;         // Por defecto "Yo"
  distance: number;        // metros
  durationMin: number;     // minutos
  stroke: "freestyle" | "backstroke" | "breaststroke" | "butterfly" | "mixed";
  sessionType: "aerobic" | "threshold" | "speed" | "technique" | "recovery";
  mainSet: string;         // Serie principal
  RPE: 1|2|3|4|5|6|7|8|9|10; // Rate of Perceived Exertion
  notes?: string;          // Notas opcionales
}
```

### Helpers y Utilidades
- **`/lib/aggregations.ts`**: Cálculos de métricas y totales
- **`/lib/date.ts`**: Utilidades de fecha con date-fns
- **`/lib/store/sessions.ts`**: Store Zustand con persistencia
- **Datos de ejemplo**: 100 sesiones distribuidas a lo largo del año 2025

### Exportación e Importación
- **Export CSV**: Botón en la pestaña Log para descargar sesiones filtradas
- **Formato**: Fecha, nadador, distancia, duración, estilo, tipo, serie, RPE, notas
- **Filtros**: Aplicados antes de la exportación

### Preparado para Backend
- **Adaptador**: Store diseñado para conectar fácilmente a Supabase/Express
- **Mismas firmas**: Acciones compatibles con API REST
- **Migración**: Solo cambiar la implementación del store, no los componentes

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
#   s u p a b a s e c u r s o r o l d  
 