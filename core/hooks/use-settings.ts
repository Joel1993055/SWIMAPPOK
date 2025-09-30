'use client';

import type { TrainingZones, UserSettings } from '@/infra/config/actions/user-settings';
import { applyPredefinedMethodology, getUserSettings, updateTrainingZones, updateUserSettings } from '@/infra/config/actions/user-settings';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  weekly: boolean;
  monthly: boolean;
  achievements: boolean;
  reminders: boolean;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr' | 'de';
  timezone: string;
  distanceUnit: 'meters' | 'yards';
  temperatureUnit: 'celsius' | 'fahrenheit';
}

interface PrivacySettings {
  publicProfile: boolean;
  shareActivity: boolean;
  dataAnalytics: boolean;
}

export function useSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Settings data
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: false,
    sms: true,
    weekly: true,
    monthly: false,
    achievements: true,
    reminders: true,
  });
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'system',
    language: 'en',
    timezone: 'europe-madrid',
    distanceUnit: 'meters',
    temperatureUnit: 'celsius',
  });
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    publicProfile: true,
    shareActivity: true,
    dataAnalytics: true,
  });
  const [trainingZones, setTrainingZones] = useState<TrainingZones | null>(null);

  // Load initial data
  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const settings = await getUserSettings();
      setUserSettings(settings);
      
      // Load profile data (you'll need to implement getUserProfile)
      // For now, using placeholder data
      setProfileData({
        firstName: 'Joel',
        lastName: 'Diaz',
        email: 'joel@example.com',
        phone: '+34 123 456 789',
        bio: 'Professional swimmer with over 10 years of experience. Specialized in freestyle and butterfly.',
      });
      
      // Load training zones
      if (settings.training_zones) {
        setTrainingZones(settings.training_zones);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load settings';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save profile data
  const saveProfile = useCallback(async (data: ProfileData) => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Create FormData for the update
      const formData = new FormData();
      formData.append('profile_data', JSON.stringify(data));
      
      await updateUserSettings(formData);
      setProfileData(data);
      
      toast.success('Profile updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Save notification settings
  const saveNotifications = useCallback(async (data: NotificationSettings) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('notification_settings', JSON.stringify(data));
      
      await updateUserSettings(formData);
      setNotifications(data);
      
      toast.success('Notification settings updated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update notifications';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Save appearance settings
  const saveAppearance = useCallback(async (data: AppearanceSettings) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('appearance_settings', JSON.stringify(data));
      
      await updateUserSettings(formData);
      setAppearance(data);
      
      toast.success('Appearance settings updated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update appearance';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Save privacy settings
  const savePrivacy = useCallback(async (data: PrivacySettings) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('privacy_settings', JSON.stringify(data));
      
      await updateUserSettings(formData);
      setPrivacy(data);
      
      toast.success('Privacy settings updated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update privacy settings';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Save training zones
  const saveTrainingZones = useCallback(async (zones: TrainingZones) => {
    try {
      setIsSaving(true);
      setError(null);
      
      await updateTrainingZones(zones);
      setTrainingZones(zones);
      
      toast.success('Training zones updated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update training zones';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Apply predefined methodology
  const applyMethodology = useCallback(async (methodology: string) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const result = await applyPredefinedMethodology(methodology);
      
      if (result.training_zones) {
        setTrainingZones(result.training_zones);
      }
      
      toast.success(`Applied ${methodology} methodology`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply methodology';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    // State
    isLoading,
    isSaving,
    error,
    userSettings,
    profileData,
    notifications,
    appearance,
    privacy,
    trainingZones,
    
    // Actions
    loadSettings,
    saveProfile,
    saveNotifications,
    saveAppearance,
    savePrivacy,
    saveTrainingZones,
    applyMethodology,
    
    // Setters for local state updates
    setProfileData,
    setNotifications,
    setAppearance,
    setPrivacy,
    setTrainingZones,
  };
}
