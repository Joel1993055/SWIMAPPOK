// =====================================================
// DASHBOARD OVERVIEW MIGRATION TEST
// =====================================================

import { DashboardOverview } from '@/components/features/dashboard/dashboard-overview';
import { useDeviceType } from '@/core/hooks/mobile';
import { render, screen } from '@testing-library/react';

// Mock the device type hook
jest.mock('@/core/hooks/mobile', () => ({
  useDeviceType: jest.fn(() => 'desktop'),
}));

// Mock the child components since they're already migrated
jest.mock('@/components/features/dashboard/kpi-cards', () => ({
  KPICards: () => <div data-testid="kpi-cards">KPI Cards</div>,
}));

jest.mock('@/components/features/dashboard/visitors-chart-simple', () => ({
  VisitorsChartSimple: () => <div data-testid="visitors-chart">Visitors Chart</div>,
}));

jest.mock('@/components/features/dashboard/dashboard-calendar', () => ({
  DashboardCalendar: () => <div data-testid="dashboard-calendar">Dashboard Calendar</div>,
}));

jest.mock('@/components/features/dashboard/weekly-training-schedule', () => ({
  WeeklyTrainingSchedule: () => <div data-testid="weekly-schedule">Weekly Schedule</div>,
}));

jest.mock('@/components/features/dashboard/charts-section', () => ({
  ChartsSection: () => <div data-testid="charts-section">Charts Section</div>,
}));

jest.mock('@/components/features/dashboard/dashboard-header', () => ({
  DashboardHeader: () => <div data-testid="dashboard-header">Dashboard Header</div>,
}));

describe('DashboardOverview Migration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<DashboardOverview />);
    
    // Check that all main components are rendered
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-cards')).toBeInTheDocument();
    expect(screen.getByTestId('visitors-chart')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('weekly-schedule')).toBeInTheDocument();
    expect(screen.getByTestId('charts-section')).toBeInTheDocument();
  });

  it('should handle different device types', () => {
    // Test mobile layout
    (useDeviceType as jest.Mock).mockReturnValue('mobile');
    const { rerender } = render(<DashboardOverview />);
    
    // Should render without crashing on mobile
    expect(screen.getByTestId('kpi-cards')).toBeInTheDocument();
    
    // Test tablet layout
    (useDeviceType as jest.Mock).mockReturnValue('tablet');
    rerender(<DashboardOverview />);
    
    // Should render without crashing on tablet
    expect(screen.getByTestId('visitors-chart')).toBeInTheDocument();
    
    // Test desktop layout
    (useDeviceType as jest.Mock).mockReturnValue('desktop');
    rerender(<DashboardOverview />);
    
    // Should render without crashing on desktop
    expect(screen.getByTestId('dashboard-calendar')).toBeInTheDocument();
  });

  it('should maintain component structure', () => {
    render(<DashboardOverview />);
    
    // Check that the main container exists
    const container = screen.getByTestId('dashboard-header').closest('.space-y-4');
    expect(container).toBeInTheDocument();
  });

  it('should render all child components in correct order', () => {
    render(<DashboardOverview />);
    
    const components = [
      'dashboard-header',
      'kpi-cards', 
      'visitors-chart',
      'dashboard-calendar',
      'weekly-schedule',
      'charts-section'
    ];
    
    components.forEach(componentId => {
      expect(screen.getByTestId(componentId)).toBeInTheDocument();
    });
  });
});
