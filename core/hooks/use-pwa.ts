import { useCallback, useEffect, useState } from 'react';
import { useErrorHandler } from './use-error-handler';

// =====================================================
// TIPOS
// =====================================================

interface PWAState {
  isSupported: boolean;
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  installing: boolean;
}

interface PWAActions {
  install: () => Promise<boolean>;
  update: () => Promise<void>;
  skipWaiting: () => Promise<void>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  showInstallPrompt: () => void;
  dismissInstallPrompt: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// =====================================================
// HOOK PRINCIPAL
// =====================================================

export function usePWA(): PWAState & PWAActions {
  const [state, setState] = useState<PWAState>({
    isSupported: false,
    isInstalled: false,
    isInstallable: false,
    isOnline: true,
    updateAvailable: false,
    installing: false,
  });

  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const { captureError } = useErrorHandler();

  // =====================================================
  // DETECTAR SOPORTE Y ESTADO
  // =====================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    const isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    setState(prev => ({
      ...prev,
      isSupported,
      isInstalled,
      isOnline: navigator.onLine,
    }));

    // Detectar cambios en el estado de conexión
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // =====================================================
  // REGISTRAR SERVICE WORKER
  // =====================================================
  useEffect(() => {
    if (!state.isSupported) return;

    // OPTIMIZACIÓN: Registrar SW en background, no bloquear UI
    const registerSW = async () => {
      try {
        // Usar requestIdleCallback para no bloquear el hilo principal
        const registerInBackground = async () => {
          const reg = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
          });
          setRegistration(reg);

          // Verificar actualizaciones
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              setState(prev => ({ ...prev, installing: true }));

              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  setState(prev => ({
                    ...prev,
                    updateAvailable: true,
                    installing: false,
                  }));
                }
              });
            }
          });

          // Escuchar mensajes del service worker
          navigator.serviceWorker.addEventListener('message', event => {
            if (event.data.type === 'UPDATE_AVAILABLE') {
              setState(prev => ({ ...prev, updateAvailable: true }));
            }
          });

          // Service Worker registered successfully
        };

        // Ejecutar en background
        if ('requestIdleCallback' in window) {
          requestIdleCallback(registerInBackground);
        } else {
          setTimeout(registerInBackground, 100);
        }
      } catch (error) {
        captureError(
          error instanceof Error ? error : new Error('SW registration failed'),
          {
            component: 'usePWA',
            action: 'registerSW',
          }
        );
      }
    };

    registerSW();
  }, [state.isSupported, captureError]);

  // =====================================================
  // DETECTAR PROMPT DE INSTALACIÓN
  // =====================================================
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setState(prev => ({ ...prev, isInstallable: true }));
    };

    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
      }));
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // =====================================================
  // ACCIONES
  // =====================================================

  const install = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        setState(prev => ({ ...prev, installing: true }));
        return true;
      }

      return false;
    } catch (error) {
      captureError(
        error instanceof Error ? error : new Error('Installation failed'),
        {
          component: 'usePWA',
          action: 'install',
        }
      );
      return false;
    }
  }, [installPrompt, captureError]);

  const update = useCallback(async (): Promise<void> => {
    if (!registration) return;

    try {
      await registration.update();

      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    } catch (error) {
      captureError(
        error instanceof Error ? error : new Error('Update failed'),
        {
          component: 'usePWA',
          action: 'update',
        }
      );
    }
  }, [registration, captureError]);

  const skipWaiting = useCallback(async (): Promise<void> => {
    if (!registration?.waiting) return;

    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Recargar la página para aplicar la actualización
    window.location.reload();
  }, [registration]);

  const requestNotificationPermission =
    useCallback(async (): Promise<NotificationPermission> => {
      if (!('Notification' in window)) {
        return 'denied';
      }

      if (Notification.permission === 'granted') {
        return 'granted';
      }

      try {
        const permission = await Notification.requestPermission();
        return permission;
      } catch (error) {
        captureError(
          error instanceof Error
            ? error
            : new Error('Notification permission failed'),
          {
            component: 'usePWA',
            action: 'requestNotificationPermission',
          }
        );
        return 'denied';
      }
    }, [captureError]);

  const showInstallPrompt = useCallback(() => {
    if (installPrompt) {
      install();
    }
  }, [install]);

  const dismissInstallPrompt = useCallback(() => {
    setInstallPrompt(null);
    setState(prev => ({ ...prev, isInstallable: false }));
  }, []);

  return {
    ...state,
    install,
    update,
    skipWaiting,
    requestNotificationPermission,
    showInstallPrompt,
    dismissInstallPrompt,
  };
}

// =====================================================
// HOOK PARA NOTIFICACIONES
// =====================================================

export function usePushNotifications() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const { captureError } = useErrorHandler();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setSubscription(existingSubscription);
        return existingSubscription;
      }

      // Necesitarías configurar VAPID keys aquí
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setSubscription(newSubscription);

      // Enviar la suscripción al servidor
      // await sendSubscriptionToServer(newSubscription)

      return newSubscription;
    } catch (error) {
      captureError(
        error instanceof Error ? error : new Error('Push subscription failed'),
        {
          component: 'usePushNotifications',
          action: 'subscribe',
        }
      );
      return null;
    }
  }, [captureError]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!subscription) return false;

    try {
      await subscription.unsubscribe();
      setSubscription(null);

      // Notificar al servidor
      // await removeSubscriptionFromServer(subscription)

      return true;
    } catch (error) {
      captureError(
        error instanceof Error
          ? error
          : new Error('Push unsubscription failed'),
        {
          component: 'usePushNotifications',
          action: 'unsubscribe',
        }
      );
      return false;
    }
  }, [subscription, captureError]);

  return {
    subscription,
    permission,
    subscribe,
    unsubscribe,
    isSupported: 'PushManager' in window,
  };
}

// =====================================================
// HOOK PARA CACHE MANAGEMENT
// =====================================================

export function useCacheManagement() {
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [isClearing, setIsClearing] = useState(false);
  const { captureError } = useErrorHandler();

  const getCacheSize = useCallback(async (): Promise<number> => {
    if (!('caches' in window)) return 0;

    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();

        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }

      setCacheSize(totalSize);
      return totalSize;
    } catch (error) {
      captureError(
        error instanceof Error
          ? error
          : new Error('Cache size calculation failed'),
        {
          component: 'useCacheManagement',
          action: 'getCacheSize',
        }
      );
      return 0;
    }
  }, [captureError]);

  const clearCache = useCallback(async (): Promise<boolean> => {
    if (!('caches' in window)) return false;

    setIsClearing(true);

    try {
      const cacheNames = await caches.keys();

      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));

      setCacheSize(0);
      return true;
    } catch (error) {
      captureError(
        error instanceof Error ? error : new Error('Cache clearing failed'),
        {
          component: 'useCacheManagement',
          action: 'clearCache',
        }
      );
      return false;
    } finally {
      setIsClearing(false);
    }
  }, [captureError]);

  useEffect(() => {
    getCacheSize();
  }, [getCacheSize]);

  return {
    cacheSize,
    isClearing,
    getCacheSize,
    clearCache,
    isSupported: 'caches' in window,
  };
}

// =====================================================
// UTILIDADES
// =====================================================

export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Utilidad para detectar si la app está instalada
export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

// Utilidad para detectar si está offline
export function isOffline(): boolean {
  if (typeof window === 'undefined') return false;
  return !navigator.onLine;
}
