// بوابة الصعيدي للتنسيق 2026 - Service Worker

const CACHE_NAME = 'tansik-saidi-v1.0'; // الكاش الأساسي للمشروع الجديد

const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './header_bg.jpg',
  './icon-192.jpg',
  './icon-512.jpg',
  './elmy_data.js',
  './adaby_data.js',
  './manifest.json'
];

// رابط مكتبة الطباعة الخارجية
const PDF_LIBRARY_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';

// 1. تثبيت وتخزين الملفات لأول مرة
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('تم حفظ ملفات بوابة الصعيدي بنجاح ✅');
      
      // حفظ الملفات المحلية
      cache.addAll(assets);
      
      // حفظ ملف الطباعة الخارجي بشكل آمن
      return cache.add(new Request(PDF_LIBRARY_URL, { mode: 'no-cors' }));
    })
  );
  self.skipWaiting();
});

// 2. إدارة وتنشيط الكاش
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. استراتيجية الاستجابة والتشغيل بدون إنترنت (Stale-While-Revalidate)
self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith('http')) return;
  
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // إذا كان الملف موجوداً في الكاش، اعرضه فوراً
      if (cachedResponse) {
        fetch(e.request).then(res => {
          if (res.status === 200 || res.type === 'opaque') {
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, res));
          }
        }).catch(() => console.log("يعمل في وضع الأوفلاين حالياً 📴"));
        
        return cachedResponse;
      }
      
      // إذا لم يكن موجوداً، جبه من الشبكة واحفظه
      return fetch(e.request).then(res => {
        if (res.status === 200 || res.type === 'opaque') {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});