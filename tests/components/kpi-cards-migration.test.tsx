// =====================================================
// KPI CARDS MIGRATION TEST
// =====================================================

import { KPICards } from '@/components/features/dashboard/kpi-cards';
import { useSessions, useSessionsCount, useSessionsSelectors } from '@/core/stores/entities/session';
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
    },
    {
      id: '2',
      date: '2024-01-02',
      distance: 2000,
      swimmer: 'Test Swimmer',
      stroke: 'backstroke',
      sessionType: 'threshold',
      mainSet: 'Test Set 2',
    },
  ]),
  useSessionsSelectors: jest.fn(() => ({
    getSessionsByDateRange: jest.fn(() => []),
    getSessionsByDate: jest.fn(() => []),
    getSessionsBySwimmer: jest.fn(() => []),
    getSessionsByPhase: jest.fn(() => []),
    getSessionsByType: jest.fn(() => []),
    getZoneDistribution: jest.fn(() => ({ z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 })),
  })),
  useSessionsCount: jest.fn(() => 2),
}));

// Mock the unified store hooks
jest.mock('@/core/stores/unified', () => ({
  useCompetitionsStore: jest.fn(() => ({
    competitions: [],
    getMainCompetition: jest.fn(() => null),
  })),
  useTrainingStore: jest.fn(() => ({
    getCurrentPhase: jest.fn(() => null),
  })),
}));

describe('KPICards Migration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<KPICards />);
    
    // Check that the component renders the main elements
    expect(screen.getByText('Distance')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Training Phase')).toBeInTheDocument();
    expect(screen.getByText('Next Competition')).toBeInTheDocument();
  });

  it('should display session data correctly', () => {
    render(<KPICards />);
    
    // Check that session count is displayed
    expect(screen.getByText('2')).toBeInTheDocument(); // sessionsCount from mock
    
    // Check that distance is calculated correctly (1000 + 2000 = 3000m = 3.0km)
    expect(screen.getByText('3.0 km')).toBeInTheDocument();
  });

  it('should handle empty sessions gracefully', () => {
    (useSessions as jest.Mock).mockReturnValue([]);
    (useSessionsCount as jest.Mock).mockReturnValue(0);
    
    render(<KPICards />);
    
    // Should still render without crashing
    expect(screen.getByText('Distance')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
  });

  it('should use new store hooks correctly', () => {
    render(<KPICards />);
    
    // Verify that the new hooks are called
    expect(useSessions).toHaveBeenCalled();
    expect(useSessionsSelectors).toHaveBeenCalled();
    expect(useSessionsCount).toHaveBeenCalled();
  });

  it('should maintain same visual structure', () => {
    render(<KPICards />);
    
    // Check that all 4 KPI cards are present
    const cards = screen.getAllByRole('generic').filter(el => 
      el.className.includes('bg-muted/50')
    );
    expect(cards).toHaveLength(4);
  });
});
