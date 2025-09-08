import { ErrorBoundary } from '@/components/error-boundary';
import { Skeleton } from '@/components/ui/skeleton';
import { useErrorHandler } from '@/lib/hooks/use-error-handler';
import { ComponentType, lazy, Suspense } from 'react';

// =====================================================
// TIPOS
// =====================================================

interface LazyComponentOptions {
  retries?: number;
  retryDelay?: number;
  chunkName?: string;
  preload?: boolean;
  fallback?: React.ComponentType;
}

interface LazyRouteWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

// =====================================================
// COMPONENTES DE FALLBACK MEJORADOS
// =====================================================

const RouteFallback = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='space-y-4 w-full max-w-md'>
      <Skeleton className='h-8 w-3/4 mx-auto' />
      <Skeleton className='h-4 w-1/2 mx-auto' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
        <Skeleton className='h-4 w-4/6' />
      </div>
      <div className='flex gap-2 justify-center'>
        <Skeleton className='h-10 w-24' />
        <Skeleton className='h-10 w-24' />
      </div>
    </div>
  </div>
);

const ComponentFallback = () => (
  <div className='flex items-center justify-center p-8'>
    <div className='space-y-3 w-full max-w-sm'>
      <Skeleton className='h-6 w-3/4 mx-auto' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
      </div>
    </div>
  </div>
);

const ChartFallback = () => (
  <div className='p-6'>
    <Skeleton className='h-6 w-1/3 mb-4' />
    <div className='space-y-2'>
      <Skeleton className='h-32 w-full' />
      <div className='flex gap-2'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-4 w-14' />
      </div>
    </div>
  </div>
);

const FormFallback = () => (
  <div className='p-6 space-y-4'>
    <Skeleton className='h-8 w-1/2' />
    <div className='space-y-3'>
      <div>
        <Skeleton className='h-4 w-20 mb-2' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div>
        <Skeleton className='h-4 w-24 mb-2' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div>
        <Skeleton className='h-4 w-28 mb-2' />
        <Skeleton className='h-20 w-full' />
      </div>
    </div>
    <div className='flex gap-2 pt-4'>
      <Skeleton className='h-10 w-20' />
      <Skeleton className='h-10 w-24' />
    </div>
  </div>
);

// =====================================================
// FUNCIÓN DE LAZY LOADING AVANZADA
// =====================================================

function createLazyComponent<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): T {
  const {
    retries = 3,
    retryDelay = 1000,
    chunkName,
    preload = false,
  } = options;

  let attemptCount = 0;

  const retryImport = async (): Promise<{ default: T }> => {
    try {
      return await importFn();
    } catch (error) {
      if (attemptCount < retries) {
        attemptCount++;
        console.warn(
          `Failed to load component ${chunkName || 'unknown'}, retrying... (attempt ${attemptCount}/${retries})`
        );

        // Backoff exponencial
        const delay = retryDelay * Math.pow(2, attemptCount - 1);
        await new Promise(resolve => setTimeout(resolve, delay));

        return retryImport();
      }

      console.error(
        `Failed to load component ${chunkName || 'unknown'} after ${retries} attempts`
      );
      throw error;
    }
  };

  const LazyComponent = lazy(retryImport);

  // Preload si está habilitado
  if (preload && typeof window !== 'undefined') {
    // Preload después de que la página se haya cargado
    const preloadTimer = setTimeout(() => {
      importFn().catch(() => {
        // Silently fail preloading
      });
    }, 100);

    // Cleanup en caso de que el componente se desmonte antes
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        clearTimeout(preloadTimer);
      });
    }
  }

  return LazyComponent;
}

// =====================================================
// RUTAS PRINCIPALES
// =====================================================

// Dashboard
export const DashboardPage = createLazyComponent(
  () => import('@/app/dashboard/page'),
  { chunkName: 'dashboard', preload: true, fallback: RouteFallback }
);

// Marketing
export const MarketingPage = createLazyComponent(
  () => import('@/app/marketing/page'),
  { chunkName: 'marketing', preload: true, fallback: RouteFallback }
);

// Auth Pages
export const SignInPage = createLazyComponent(
  () => import('@/app/(auth-pages)/sign-in/page'),
  { chunkName: 'sign-in', preload: true, fallback: RouteFallback }
);

export const SignUpPage = createLazyComponent(
  () => import('@/app/(auth-pages)/sign-up/page'),
  { chunkName: 'sign-up', fallback: RouteFallback }
);

export const ForgotPasswordPage = createLazyComponent(
  () => import('@/app/(auth-pages)/forgot-password/page'),
  { chunkName: 'forgot-password', fallback: RouteFallback }
);

// Protected Pages
export const ProtectedPage = createLazyComponent(
  () => import('@/app/protected/page'),
  { chunkName: 'protected', fallback: RouteFallback }
);

export const ResetPasswordPage = createLazyComponent(
  () => import('@/app/protected/reset-password/page'),
  { chunkName: 'reset-password', fallback: RouteFallback }
);

// Feature Pages
export const SessionsPage = createLazyComponent(
  () => import('@/app/entrenamientos/page'),
  { chunkName: 'sessions', fallback: RouteFallback }
);

export const CalendarPage = createLazyComponent(
  () => import('@/app/calendario/page'),
  { chunkName: 'calendar', fallback: RouteFallback }
);

export const TeamPage = createLazyComponent(() => import('@/app/equipo/page'), {
  chunkName: 'team',
  fallback: RouteFallback,
});

export const ToolsPage = createLazyComponent(
  () => import('@/app/herramientas/page'),
  { chunkName: 'tools', fallback: RouteFallback }
);

export const LogPage = createLazyComponent(() => import('@/app/log/page'), {
  chunkName: 'log',
  fallback: RouteFallback,
});

export const PlanningPage = createLazyComponent(
  () => import('@/app/planificacion/page'),
  { chunkName: 'planning', fallback: RouteFallback }
);

export const ReportsPage = createLazyComponent(
  () => import('@/app/reports/page'),
  { chunkName: 'reports', fallback: RouteFallback }
);

export const SettingsPage = createLazyComponent(
  () => import('@/app/settings/page'),
  { chunkName: 'settings', fallback: RouteFallback }
);

export const AICoachPage = createLazyComponent(
  () => import('@/app/ai-coach/page'),
  { chunkName: 'ai-coach', fallback: RouteFallback }
);

export const AnalysisPage = createLazyComponent(
  () => import('@/app/analisis/page'),
  { chunkName: 'analysis', fallback: RouteFallback }
);

export const PreviewDashboardPage = createLazyComponent(
  () => import('@/app/preview-dashboard/page'),
  { chunkName: 'preview-dashboard', fallback: RouteFallback }
);

// =====================================================
// COMPONENTES DE FEATURES
// =====================================================

// Dashboard Components
export const DashboardStats = createLazyComponent(
  () => import('@/components/features/dashboard/dashboard-stats'),
  { chunkName: 'dashboard-stats', fallback: ComponentFallback }
);

export const DashboardCharts = createLazyComponent(
  () => import('@/components/features/dashboard/dashboard-charts'),
  { chunkName: 'dashboard-charts', fallback: ChartFallback }
);

export const DashboardRecentSessions = createLazyComponent(
  () => import('@/components/features/dashboard/dashboard-recent-sessions'),
  { chunkName: 'dashboard-recent-sessions', fallback: ComponentFallback }
);

// Session Components
export const SessionsList = createLazyComponent(
  () => import('@/components/features/sessions/sessions-list'),
  { chunkName: 'sessions-list', fallback: ComponentFallback }
);

export const SessionForm = createLazyComponent(
  () => import('@/components/features/sessions/session-form'),
  { chunkName: 'session-form', fallback: FormFallback }
);

export const SessionDetails = createLazyComponent(
  () => import('@/components/features/sessions/session-details'),
  { chunkName: 'session-details', fallback: ComponentFallback }
);

// Training Components
export const TrainingPhasesList = createLazyComponent(
  () => import('@/components/features/training/training-phases-list'),
  { chunkName: 'training-phases-list', fallback: ComponentFallback }
);

export const TrainingPhaseForm = createLazyComponent(
  () => import('@/components/features/training/training-phase-form'),
  { chunkName: 'training-phase-form', fallback: FormFallback }
);

// Competition Components
export const CompetitionsList = createLazyComponent(
  () => import('@/components/features/competitions/competitions-list'),
  { chunkName: 'competitions-list', fallback: ComponentFallback }
);

export const CompetitionForm = createLazyComponent(
  () => import('@/components/features/competitions/competition-form'),
  { chunkName: 'competition-form', fallback: FormFallback }
);

// AI Coach Components
export const AICoachChat = createLazyComponent(
  () => import('@/components/features/ai-coach/ai-coach-chat'),
  { chunkName: 'ai-coach-chat', fallback: ComponentFallback }
);

export const AICoachAnalysis = createLazyComponent(
  () => import('@/components/features/ai-coach/ai-coach-analysis'),
  { chunkName: 'ai-coach-analysis', fallback: ComponentFallback }
);

// Reports Components
export const ReportsList = createLazyComponent(
  () => import('@/components/features/reports/reports-list'),
  { chunkName: 'reports-list', fallback: ComponentFallback }
);

export const ReportGenerator = createLazyComponent(
  () => import('@/components/features/reports/report-generator'),
  { chunkName: 'report-generator', fallback: FormFallback }
);

// Examples Components
export const SessionFormExample = createLazyComponent(
  () => import('@/components/examples/session-form-example'),
  { chunkName: 'session-form-example', fallback: ComponentFallback }
);

export const ApiValidationExample = createLazyComponent(
  () => import('@/components/examples/api-validation-example'),
  { chunkName: 'api-validation-example', fallback: ComponentFallback }
);

export const OptimizedImagesExample = createLazyComponent(
  () => import('@/components/examples/optimized-images-example'),
  { chunkName: 'optimized-images-example', fallback: ComponentFallback }
);

// =====================================================
// WRAPPER COMPONENTS
// =====================================================

export function LazyRouteWrapper({
  children,
  fallback,
  errorFallback,
}: LazyRouteWrapperProps) {
  const { captureError } = useErrorHandler();

  const defaultErrorFallback = (
    <div className='flex items-center justify-center min-h-[400px]'>
      <div className='text-center max-w-md p-6'>
        <div className='text-4xl mb-4'>⚠️</div>
        <h2 className='text-xl font-semibold mb-2'>Failed to load page</h2>
        <p className='text-muted-foreground mb-4'>
          There was an error loading this page. Please try refreshing.
        </p>
        <button
          onClick={() => window.location.reload()}
          className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      fallback={errorFallback || defaultErrorFallback}
      onError={(error, errorInfo) => {
        captureError(error, {
          component: 'LazyRouteWrapper',
          action: 'render',
          metadata: errorInfo,
        });
      }}
    >
      <Suspense fallback={fallback || <RouteFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export function LazyComponentWrapper({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback || <ComponentFallback />}>{children}</Suspense>
  );
}

// =====================================================
// HOOKS
// =====================================================

export function useLazyRoute<T extends ComponentType<unknown>>(
  LazyComponent: T,
  fallback?: React.ComponentType
) {
  return {
    Component: LazyComponent,
    Fallback: fallback || RouteFallback,
  };
}

export function usePreloadRoute(
  importFn: () => Promise<{ default: ComponentType<unknown> }>
) {
  const preload = () => {
    importFn().catch(() => {
      // Silently fail preloading
    });
  };

  return preload;
}

// =====================================================
// UTILIDADES DE PRECARGA
// =====================================================

export const preloadRoute = (
  importFn: () => Promise<{ default: ComponentType<unknown> }>
) => {
  // Precargar el componente en el background
  importFn().catch(() => {
    // Ignorar errores de precarga
  });
};

// Mapeo de rutas para precarga
export const routePreloaders = {
  dashboard: () => import('@/app/dashboard/page'),
  marketing: () => import('@/app/marketing/page'),
  sessions: () => import('@/app/entrenamientos/page'),
  calendar: () => import('@/app/calendario/page'),
  team: () => import('@/app/equipo/page'),
  tools: () => import('@/app/herramientas/page'),
  planning: () => import('@/app/planificacion/page'),
  reports: () => import('@/app/reports/page'),
  settings: () => import('@/app/settings/page'),
  aiCoach: () => import('@/app/ai-coach/page'),
  analysis: () => import('@/app/analisis/page'),
  signIn: () => import('@/app/(auth-pages)/sign-in/page'),
  signUp: () => import('@/app/(auth-pages)/sign-up/page'),
};

// Preload de rutas críticas
export const preloadCriticalRoutes = () => {
  // Preload después de 2 segundos para no interferir con la carga inicial
  setTimeout(() => {
    preloadRoute(routePreloaders.dashboard);
    preloadRoute(routePreloaders.sessions);
    preloadRoute(routePreloaders.signIn);
  }, 2000);
};

// Preload on hover para navegación
export const createHoverPreloader = (
  routeName: keyof typeof routePreloaders
) => ({
  onMouseEnter: () => preloadRoute(routePreloaders[routeName]),
  onFocus: () => preloadRoute(routePreloaders[routeName]),
});

// Preload específico para componentes pesados
export const preloadHeavyComponents = () => {
  setTimeout(() => {
    // Preload componentes que usan librerías pesadas como charts
    preloadRoute(
      () => import('@/components/features/dashboard/dashboard-charts')
    );
    preloadRoute(
      () => import('@/components/features/reports/report-generator')
    );
  }, 5000);
};

// Inicializar precarga automática
if (typeof window !== 'undefined') {
  // Preload crítico cuando la página esté cargada
  window.addEventListener('load', preloadCriticalRoutes);

  // Preload componentes pesados después de interacción
  let hasInteracted = false;
  const enableHeavyPreload = () => {
    if (!hasInteracted) {
      hasInteracted = true;
      preloadHeavyComponents();
    }
  };

  window.addEventListener('click', enableHeavyPreload, { once: true });
  window.addEventListener('scroll', enableHeavyPreload, { once: true });
  window.addEventListener('keydown', enableHeavyPreload, { once: true });
}
