// service-worker.js - سرویس ورکر برای نرم‌افزار مدیریت ساختمان

const CACHE_NAME = 'building-management-' + new Date().getTime() + '-' + Math.random();

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './app.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  console.log('🛠 Service Worker در حال نصب...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 کش کردن فایل‌های ضروری...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ نصب Service Worker کامل شد');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ خطا در کش کردن:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('⚡ Service Worker فعال شد');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑 حذف کش قدیمی: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ کش‌های قدیمی پاک شدند');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('cdnjs.cloudflare.com') ||
      event.request.url.includes('cdn.jsdelivr.net')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log(`📂 از کش: ${event.request.url}`);
          return response;
        }
        
        console.log(`🌐 از شبکه: ${event.request.url}`);
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log(`💾 در کش ذخیره شد: ${event.request.url}`);
              });
            
            return networkResponse;
          })
          .catch(() => {
            console.log(`⚠️ آفلاین - فایل در کش نیست: ${event.request.url}`);
            
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            
            return new Response('شما آفلاین هستید و این محتوا در کش نیست.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain; charset=utf-8'
              })
            });
          });
      })
  );
});

console.log(`🚀 Service Worker بارگذاری شد`);