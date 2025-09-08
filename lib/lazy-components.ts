import dynamic from 'next/dynamic';
import React from 'react';

// =====================================================
// LAZY LOADING COMPONENTS
// =====================================================

// Dashboard components
export const DashboardOverview = dynamic(
  () => import('@/components/features/dashboard/dashboard-overview'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-64 rounded-lg',
      }),
    ssr: false,
  }
);

export const KPICards = dynamic(
  () => import('@/components/features/dashboard/kpi-cards'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-32 rounded-lg',
      }),
    ssr: false,
  }
);

export const SessionsTable = dynamic(
  () => import('@/components/features/dashboard/sessions-table'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-96 rounded-lg',
      }),
    ssr: false,
  }
);

export const WeeklyTrainingSchedule = dynamic(
  () => import('@/components/features/dashboard/weekly-training-schedule'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-64 rounded-lg',
      }),
    ssr: false,
  }
);

// Chart components
export const BarChart = dynamic(() => import('@/components/charts/barchart'), {
  loading: () =>
    React.createElement('div', {
      className: 'animate-pulse bg-gray-200 h-64 rounded-lg',
    }),
  ssr: false,
});

export const AreaChart = dynamic(
  () => import('@/components/charts/chart-area-interactive'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-64 rounded-lg',
      }),
    ssr: false,
  }
);

export const PieChart = dynamic(
  () => import('@/components/tutorial/piechart'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-64 rounded-lg',
      }),
    ssr: false,
  }
);

// Form components
export const SessionForm = dynamic(
  () => import('@/components/forms/session-form'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-96 rounded-lg',
      }),
    ssr: false,
  }
);

export const QuickCreate = dynamic(
  () => import('@/components/forms/quick-create'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-64 rounded-lg',
      }),
    ssr: false,
  }
);

// Feature components
export const AICoach = dynamic(() => import('@/components/features/ai-coach'), {
  loading: () =>
    React.createElement('div', {
      className: 'animate-pulse bg-gray-200 h-64 rounded-lg',
    }),
  ssr: false,
});

export const TrainingZoneDetector = dynamic(
  () => import('@/components/features/training/training-zone-detector'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-64 rounded-lg',
      }),
    ssr: false,
  }
);

export const AdvancedZoneDetector = dynamic(
  () => import('@/components/features/training/advanced-zone-detector'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-64 rounded-lg',
      }),
    ssr: false,
  }
);

// Admin components
export const RateLimitDashboard = dynamic(
  () => import('@/components/admin/rate-limit-dashboard'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-96 rounded-lg',
      }),
    ssr: false,
  }
);

export const AdvancedMonitoringDashboard = dynamic(
  () => import('@/components/admin/advanced-monitoring-dashboard'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-96 rounded-lg',
      }),
    ssr: false,
  }
);

// Calendar components
export const Calendar = dynamic(() => import('@/components/calendar'), {
  loading: () =>
    React.createElement('div', {
      className: 'animate-pulse bg-gray-200 h-96 rounded-lg',
    }),
  ssr: false,
});

export const DashboardCalendar = dynamic(
  () => import('@/components/features/dashboard/dashboard-calendar'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-96 rounded-lg',
      }),
    ssr: false,
  }
);

// Tool components
export const FinaPointsCalculator = dynamic(
  () => import('@/components/features/tools/fina-points-calculator'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-64 rounded-lg',
      }),
    ssr: false,
  }
);

export const RelativeSpeedCalculator = dynamic(
  () => import('@/components/features/tools/relative-speed-calculator'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-64 rounded-lg',
      }),
    ssr: false,
  }
);

// Report components
export const TemplateEditor = dynamic(
  () => import('@/components/features/reports/template-editor'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-96 rounded-lg',
      }),
    ssr: false,
  }
);

export const TemplateManager = dynamic(
  () => import('@/components/features/reports/template-manager'),
  {
    loading: () =>
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-96 rounded-lg',
      }),
    ssr: false,
  }
);

// =====================================================
// LAZY LOADING UTILITIES
// =====================================================

export const createLazyComponent = (
  importFn: () => Promise<any>,
  fallback?: React.ReactNode
) => {
  return dynamic(importFn, {
    loading: () =>
      fallback ||
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-32 rounded-lg',
      }),
    ssr: false,
  });
};

export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return dynamic(() => Promise.resolve(Component), {
    loading: () =>
      fallback ||
      React.createElement('div', {
        className: 'animate-pulse bg-gray-200 h-32 rounded-lg',
      }),
    ssr: false,
  });
};
