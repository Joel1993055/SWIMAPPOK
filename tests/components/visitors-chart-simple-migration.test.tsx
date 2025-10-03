// =====================================================
// VISITORS CHART SIMPLE MIGRATION TEST
// =====================================================

import { VisitorsChartSimple } from '@/components/features/dashboard/visitors-chart-simple';
import { useSessions, useSessionsLoading } from '@/core/stores/entities/session';
import { render, screen } from '@testing-library/react';

// Mock the new store hooks
jest.mock('@/core/stores/entities/session', () => ({
  useSessions: jest.fn(() => [
    {
      id: '1',
      date: '2024-01-01',
      distance: 1000,
      swimmer: 'Test Swimmer',
      stroke: 'freestyle',
      sessionType: 'aerobic',
      mainSet: 'Test Set',
      zoneVolumes: {
        z1: 500,
        z2: 300,
        z3: 200,
        z4: 0,
        z5: 0,
      },
    },
    {
      id: '2',
      date: '2024-01-02',
      distance: 2000,
      swimmer: 'Test Swimmer',
      stroke: 'backstroke',
      sessionType: 'threshold',
      mainSet: 'Test Set 2',
      zoneVolumes: {
        z1: 200,
        z2: 800,
        z3: 600,
        z4: 400,
        z5: 0,
      },
    },
  ]),
  useSessionsLoading: jest.fn(() => false),
}));

describe('VisitorsChartSimple Migration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<VisitorsChartSimple />);
    
    // Check that the component renders the main elements
    expect(screen.getByText('Weekly Progress')).toBeInTheDocument();
    expect(screen.getByText('Distance by training zones')).toBeInTheDocument();
  });

  it('should display chart controls', () => {
    render(<VisitorsChartSimple />);
    
    // Check that chart type selector is present
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should calculate zone data correctly', () => {
    render(<VisitorsChartSimple />);
    
    // Check that stats are displayed (total distance, daily average, sessions)
    expect(screen.getByText(/km/)).toBeInTheDocument();
    expect(screen.getByText('Total Distance')).toBeInTheDocument();
    expect(screen.getByText('Daily Average')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    (useSessionsLoading as jest.Mock).mockReturnValue(true);
    
    render(<VisitorsChartSimple />);
    
    // Should show loading state
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should handle empty sessions gracefully', () => {
    (useSessions as jest.Mock).mockReturnValue([]);
    
    render(<VisitorsChartSimple />);
    
    // Should still render without crashing
    expect(screen.getByText('Weekly Progress')).toBeInTheDocument();
  });

  it('should use new store hooks correctly', () => {
    render(<VisitorsChartSimple />);
    
    // Verify that the new hooks are called
    expect(useSessions).toHaveBeenCalled();
    expect(useSessionsLoading).toHaveBeenCalled();
  });

  it('should access zoneVolumes correctly', () => {
    const mockSessions = [
      {
        id: '1',
        date: '2024-01-01',
        zoneVolumes: { z1: 100, z2: 200, z3: 300, z4: 400, z5: 500 },
      },
    ];
    
    (useSessions as jest.Mock).mockReturnValue(mockSessions);
    
    render(<VisitorsChartSimple />);
    
    // Should render without errors when accessing zoneVolumes
    expect(screen.getByText('Weekly Progress')).toBeInTheDocument();
  });

  it('should maintain chart functionality', () => {
    render(<VisitorsChartSimple />);
    
    // Check that chart container is present
    const chartContainer = screen.getByRole('img', { hidden: true });
    expect(chartContainer).toBeInTheDocument();
  });
});
