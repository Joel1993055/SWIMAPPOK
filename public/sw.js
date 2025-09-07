// =====================================================
// SERVICE WORKER PARA SWIM APP PRO
// =====================================================

const CACHE_NAME = 'swim-app-pro-v1';
const STATIC_CACHE = 'swim-app-static-v1';
const DYNAMIC_CACHE = 'swim-app-dynamic-v1';

// Archivos para cachear inmediatamente
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/dashboard-light.png',
  '/dashboard-dark.png',
  // Agregar más assets estáticos según sea necesario
];

// Rutas importantes para cachear
const IMPORTANT_ROUTES = [
  '/',
  '/dashboard',
  '/entrenamientos',
  '/calendario',
  '/signin',
];

// =====================================================
// INSTALACIÓN DEL SERVICE WORKER
// =====================================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// =====================================================
// ACTIVACIÓN DEL SERVICE WORKER
// =====================================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar caches antiguos
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim(); // Controlar todas las pestañas
      })
  );
});

// =====================================================
// INTERCEPTAR REQUESTS
// =====================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar requests del mismo origen
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Estrategia Cache First para assets estáticos
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Estrategia Network First para API calls
  if (isApiRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Estrategia Stale While Revalidate para páginas
  if (isPageRequest(request)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // Default: Network First
  event.respondWith(networkFirst(request));
});

// =====================================================
// ESTRATEGIAS DE CACHE
// =====================================================

// Cache First - Para assets estáticos
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First - Para API y contenido dinámico
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para páginas
    if (isPageRequest(request)) {
      const fallbackResponse = await caches.match('/');
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    return new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stale While Revalidate - Para páginas
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Si falla la red, devolver desde cache si existe
    return cachedResponse;
  });
  
  // Devolver cache inmediatamente si existe, sino esperar la red
  return cachedResponse || fetchPromise;
}

// =====================================================
// UTILIDADES
// =====================================================

function isStaticAsset(request) {
  return request.destination === 'image' ||
         request.destination === 'script' ||
         request.destination === 'style' ||
         request.url.includes('/static/') ||
         request.url.includes('/_next/static/') ||
         request.url.endsWith('.js') ||
         request.url.endsWith('.css') ||
         request.url.endsWith('.png') ||
         request.url.endsWith('.jpg') ||
         request.url.endsWith('.jpeg') ||
         request.url.endsWith('.gif') ||
         request.url.endsWith('.svg') ||
         request.url.endsWith('.ico');
}

function isApiRequest(request) {
  return request.url.includes('/api/') ||
         request.url.includes('/auth/') ||
         request.url.includes('supabase.co');
}

function isPageRequest(request) {
  return request.method === 'GET' &&
         request.headers.get('accept').includes('text/html');
}

// =====================================================
// BACKGROUND SYNC
// =====================================================

self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-sessions') {
    event.waitUntil(syncSessions());
  }
  
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncSessions() {
  try {
    console.log('[SW] Syncing sessions...');
    // Aquí implementarías la lógica para sincronizar sesiones offline
    // Por ejemplo, enviar datos pendientes al servidor
  } catch (error) {
    console.error('[SW] Failed to sync sessions:', error);
  }
}

async function syncAnalytics() {
  try {
    console.log('[SW] Syncing analytics...');
    // Aquí implementarías la lógica para sincronizar analytics
  } catch (error) {
    console.error('[SW] Failed to sync analytics:', error);
  }
}

// =====================================================
// PUSH NOTIFICATIONS
// =====================================================

self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'You have new swimming data to review!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/dashboard'
    },
    actions: [
      {
        action: 'view',
        title: 'View Dashboard'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      options.body = payload.body || options.body;
      options.data.url = payload.url || options.data.url;
    } catch (error) {
      console.error('[SW] Failed to parse push payload:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('Swim APP PRO', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    const url = event.notification.data.url || '/dashboard';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clients) => {
        // Si ya hay una ventana abierta, enfocarla
        for (let client of clients) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Si no, abrir nueva ventana
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// =====================================================
// MENSAJES DESDE EL CLIENTE
// =====================================================

self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// =====================================================
// LIMPIEZA DE CACHE
// =====================================================

// Limpiar cache periódicamente
setInterval(() => {
  cleanupCache();
}, 24 * 60 * 60 * 1000); // Una vez al día

async function cleanupCache() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días
    
    for (const request of requests) {
      const response = await cache.match(request);
      const dateHeader = response.headers.get('date');
      
      if (dateHeader) {
        const responseDate = new Date(dateHeader).getTime();
        if (now - responseDate > maxAge) {
          await cache.delete(request);
          console.log('[SW] Deleted old cache entry:', request.url);
        }
      }
    }
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error);
  }
}

console.log('[SW] Service Worker loaded successfully');
