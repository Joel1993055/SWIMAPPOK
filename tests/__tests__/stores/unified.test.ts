import {
  useAICoachStore,
  useAuthStore,
  useCompetitionsStore,
  useReportsStore,
  useSessionsStore,
  useTrainingStore,
  useUIStore,
} from '@/lib/store/unified';
import { act, renderHook } from '@testing-library/react';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Zustand Stores', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('AuthStore', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should set user and update authentication status', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should sign out user', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      act(() => {
        result.current.setUser(mockUser);
        result.current.signOut();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('SessionsStore', () => {
    it('should initialize with empty sessions', () => {
      const { result } = renderHook(() => useSessionsStore());

      expect(result.current.sessions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should add a new session', () => {
      const { result } = renderHook(() => useSessionsStore());
      const newSession = {
        date: '2024-01-01',
        swimmer: 'Test Swimmer',
        distance: 1000,
        durationMin: 30,
        stroke: 'freestyle' as const,
        sessionType: 'aerobic' as const,
        mainSet: 'Test Set',
        RPE: 6,
      };

      act(() => {
        result.current.addSession(newSession);
      });

      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0]).toMatchObject(newSession);
      expect(result.current.sessions[0].id).toBeDefined();
    });

    it('should update a session', () => {
      const { result } = renderHook(() => useSessionsStore());
      const newSession = {
        date: '2024-01-01',
        swimmer: 'Test Swimmer',
        distance: 1000,
        durationMin: 30,
        stroke: 'freestyle' as const,
        sessionType: 'aerobic' as const,
        mainSet: 'Test Set',
        RPE: 6,
      };

      act(() => {
        result.current.addSession(newSession);
        const sessionId = result.current.sessions[0].id;
        result.current.updateSession(sessionId, { distance: 2000 });
      });

      expect(result.current.sessions[0].distance).toBe(2000);
    });

    it('should delete a session', () => {
      const { result } = renderHook(() => useSessionsStore());
      const newSession = {
        date: '2024-01-01',
        swimmer: 'Test Swimmer',
        distance: 1000,
        durationMin: 30,
        stroke: 'freestyle' as const,
        sessionType: 'aerobic' as const,
        mainSet: 'Test Set',
        RPE: 6,
      };

      // Clear any existing sessions first
      act(() => {
        result.current.setSessions([]);
      });

      act(() => {
        result.current.addSession(newSession);
      });

      expect(result.current.sessions).toHaveLength(1);

      act(() => {
        const sessionId = result.current.sessions[0].id;
        result.current.deleteSession(sessionId);
      });

      expect(result.current.sessions).toHaveLength(0);
    });

    it('should calculate total distance', () => {
      const { result } = renderHook(() => useSessionsStore());

      // Clear any existing sessions first
      act(() => {
        result.current.setSessions([]);
      });

      act(() => {
        result.current.addSession({
          date: '2024-01-01',
          swimmer: 'Test Swimmer',
          distance: 1000,
          durationMin: 30,
          stroke: 'freestyle' as const,
          sessionType: 'aerobic' as const,
          mainSet: 'Test Set',
          RPE: 6,
        });
        result.current.addSession({
          date: '2024-01-02',
          swimmer: 'Test Swimmer',
          distance: 1500,
          durationMin: 45,
          stroke: 'freestyle' as const,
          sessionType: 'aerobic' as const,
          mainSet: 'Test Set 2',
          RPE: 7,
        });
      });

      expect(result.current.getTotalDistance()).toBe(2500);
    });
  });

  describe('CompetitionsStore', () => {
    it('should initialize with empty competitions', () => {
      const { result } = renderHook(() => useCompetitionsStore());

      expect(result.current.competitions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should add a new competition', () => {
      const { result } = renderHook(() => useCompetitionsStore());
      const newCompetition = {
        id: 'comp-1',
        name: 'Test Competition',
        date: '2024-06-15',
        location: 'Test Location',
        type: 'nacional' as const,
        events: ['100m Libre'],
        objectives: 'Test objectives',
        status: 'upcoming' as const,
        priority: 'high' as const,
      };

      act(() => {
        result.current.addCompetition(newCompetition);
      });

      expect(result.current.competitions).toHaveLength(1);
      expect(result.current.competitions[0]).toEqual(newCompetition);
    });

    it('should get main competition', () => {
      const { result } = renderHook(() => useCompetitionsStore());

      // Clear any existing competitions first
      act(() => {
        result.current.setCompetitions([]);
      });

      act(() => {
        result.current.addCompetition({
          id: 'comp-1',
          name: 'Main Competition',
          date: '2024-06-15',
          location: 'Test Location',
          type: 'nacional' as const,
          events: ['100m Libre'],
          objectives: 'Test objectives',
          status: 'upcoming' as const,
          priority: 'high' as const,
        });
        result.current.addCompetition({
          id: 'comp-2',
          name: 'Secondary Competition',
          date: '2024-07-15',
          location: 'Test Location 2',
          type: 'regional' as const,
          events: ['50m Libre'],
          objectives: 'Test objectives 2',
          status: 'upcoming' as const,
          priority: 'medium' as const,
        });
      });

      const mainCompetition = result.current.getMainCompetition();
      expect(mainCompetition?.name).toBe('Main Competition');
    });
  });

  describe('TrainingStore', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useTrainingStore());

      expect(result.current.phases).toEqual([]);
      expect(result.current.selectedMethodology).toBe('standard');
      expect(result.current.methodologies).toBeDefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should add a new phase', () => {
      const { result } = renderHook(() => useTrainingStore());
      const newPhase = {
        id: 'phase-1',
        name: 'Test Phase',
        duration: 4,
        description: 'Test description',
        focus: ['Aeróbico'],
        intensity: 6,
        volume: 20000,
        color: 'bg-blue-500',
        order: 1,
      };

      act(() => {
        result.current.addPhase(newPhase);
      });

      expect(result.current.phases).toHaveLength(1);
      expect(result.current.phases[0]).toEqual(newPhase);
    });

    it('should set methodology', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.setMethodology('british-swimming');
      });

      expect(result.current.selectedMethodology).toBe('british-swimming');
    });

    it('should update zones', () => {
      const { result } = renderHook(() => useTrainingStore());
      const customZones = {
        Z1: 'Custom Recovery',
        Z2: 'Custom Base',
        Z3: 'Custom Threshold',
        Z4: 'Custom VO2',
        Z5: 'Custom Speed',
      };

      act(() => {
        result.current.updateZones(customZones);
      });

      expect(result.current.selectedMethodology).toBe('custom');
      expect(result.current.zones.z1.name).toBe('Custom Recovery');
      expect(result.current.zones.z2.name).toBe('Custom Base');
    });
  });

  describe('AICoachStore', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useAICoachStore());

      expect(result.current.isEnabled).toBe(true);
      expect(result.current.advice).toEqual([]);
      expect(result.current.analysis).toBeNull();
      expect(result.current.adviceHistory).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should toggle AI coach', () => {
      const { result } = renderHook(() => useAICoachStore());

      act(() => {
        result.current.toggleAICoach();
      });

      expect(result.current.isEnabled).toBe(false);
    });

    it('should add advice', () => {
      const { result } = renderHook(() => useAICoachStore());
      const newAdvice = {
        type: 'performance' as const,
        title: 'Test Advice',
        message: 'Test message',
        priority: 'high' as const,
        actionable: true,
        actionText: 'Test action',
      };

      act(() => {
        result.current.addAdvice(newAdvice);
      });

      expect(result.current.advice).toHaveLength(1);
      expect(result.current.advice[0]).toMatchObject(newAdvice);
      expect(result.current.advice[0].id).toBeDefined();
      expect(result.current.advice[0].createdAt).toBeInstanceOf(Date);
    });

    it('should analyze training', () => {
      const { result } = renderHook(() => useAICoachStore());
      const trainingData = {
        title: 'Test Training',
        content: 'Test content',
        type: 'aerobic',
        date: new Date(),
        totalDistance: 2000,
        detectedZones: ['Z1', 'Z2'],
      };

      act(() => {
        result.current.analyzeTraining(trainingData);
      });

      expect(result.current.analysis).toBeDefined();
      if (result.current.analysis) {
        expect(result.current.analysis.overallScore).toBeGreaterThanOrEqual(60);
        expect(result.current.analysis.overallScore).toBeLessThanOrEqual(100);
      }
    });

    it('should get personalized advice', () => {
      const { result } = renderHook(() => useAICoachStore());

      const advice = result.current.getPersonalizedAdvice('Me siento fatigado');

      expect(advice).toHaveLength(1);
      expect(advice[0].type).toBe('recovery');
      expect(advice[0].title).toContain('recuperación');
    });
  });

  describe('ReportsStore', () => {
    it('should initialize with empty reports', () => {
      const { result } = renderHook(() => useReportsStore());

      expect(result.current.reports).toEqual([]);
      expect(result.current.selectedReport).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should add a new report', () => {
      const { result } = renderHook(() => useReportsStore());
      const newReport = {
        type: 'monthly' as const,
        title: 'Test Report',
        description: 'Test description',
        data: { sessions: 10, distance: 20000 },
        filters: { dateRange: '2024-01' },
      };

      act(() => {
        result.current.addReport(newReport);
      });

      expect(result.current.reports).toHaveLength(1);
      expect(result.current.reports[0]).toMatchObject(newReport);
      expect(result.current.reports[0].id).toBeDefined();
      expect(result.current.reports[0].generatedAt).toBeInstanceOf(Date);
    });
  });

  describe('UIStore', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.theme).toBe('system');
      expect(result.current.sidebarOpen).toBe(true);
      expect(result.current.notifications).toEqual([]);
    });

    it('should set theme', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should add notification', () => {
      const { result } = renderHook(() => useUIStore());
      const notification = {
        type: 'success' as const,
        title: 'Test Notification',
        message: 'Test message',
        duration: 5000,
      };

      act(() => {
        result.current.addNotification(notification);
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0]).toMatchObject(notification);
      expect(result.current.notifications[0].id).toBeDefined();
    });
  });
});
