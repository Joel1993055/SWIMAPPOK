/**
 * Onboarding Hook
 * Manages onboarding state and flow for new users
 */

import { useErrorHandler } from '@/core/hooks/use-error-handler';
import { checkIfUserHasData } from '@/utils/demo-data-seeder';
import { useCallback, useEffect, useState } from 'react';

interface OnboardingState {
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
  shouldShowWelcomeTour: boolean;
  isLoading: boolean;
}

interface OnboardingActions {
  markOnboardingComplete: () => void;
  checkUserStatus: () => Promise<void>;
}

export function useOnboarding(userId: string | null): OnboardingState & OnboardingActions {
  const [state, setState] = useState<OnboardingState>({
    isNewUser: false,
    hasCompletedOnboarding: false,
    shouldShowWelcomeTour: false,
    isLoading: true,
  });

  const { captureError } = useErrorHandler();

  const checkUserStatus = useCallback(async () => {
    if (!userId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Check if user has any data
      const hasData = await checkIfUserHasData(userId);
      
      // Check if user has completed onboarding (stored in localStorage)
      const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${userId}`) === 'true';

      setState({
        isNewUser: !hasData,
        hasCompletedOnboarding,
        shouldShowWelcomeTour: !hasData && !hasCompletedOnboarding,
        isLoading: false,
      });
    } catch (error) {
      captureError(error as Error, { 
        component: 'useOnboarding', 
        action: 'checkUserStatus',
        userId 
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [userId, captureError]);

  const markOnboardingComplete = useCallback(() => {
    if (!userId) return;

    localStorage.setItem(`onboarding_completed_${userId}`, 'true');
    setState(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      shouldShowWelcomeTour: false,
    }));
  }, [userId]);

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  return {
    ...state,
    markOnboardingComplete,
    checkUserStatus,
  };
}
