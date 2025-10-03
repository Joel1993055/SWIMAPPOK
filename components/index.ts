// Barrel exports for common UI components
// This improves import performance and reduces bundle size

// Layout components
export { AppSidebar } from './layout/app-sidebar';
export { LandingHeader } from './layout/landing-header';
export { SiteHeader } from './layout/site-header';

// Navigation components
export { NavDocuments } from './navigation/nav-documents';
export { NavMain } from './navigation/nav-main';
export { NavSecondary } from './navigation/nav-secondary';

// Common components
export {
    AnalysisCard, ComparisonAnalysisCard, KPIAnalysisCard, ZoneAnalysisCard
} from './common/analysis-card';
export { DataTable } from './common/data-table';
export { LandingSwitch } from './common/landing-switch';
export { SectionCards } from './common/section-cards';
export { ThemeSwitcher } from './common/theme-switcher';
export { ThemeToggle } from './common/theme-toggle';
export { UserMenu } from './common/user-menu';
export { WeekInput } from './common/weekinput';

// Error boundary
export { ErrorBoundary } from './error-boundary';

// Lazy route component
export { LazyRoute } from './lazy-route';

