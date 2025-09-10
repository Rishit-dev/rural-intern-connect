const CACHE_NAME = 'internconnect-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Mock internship data for offline access
const OFFLINE_INTERNSHIPS = [
  {
    id: '1',
    title: 'Digital India Web Development Intern',
    organization: 'Ministry of Electronics & IT',
    location: 'New Delhi',
    sector: 'Technology',
    stipend: '₹15,000/month',
    duration: '3 months',
    description: 'Work on government digital transformation projects and web applications.',
    requirements: ['HTML/CSS', 'JavaScript', 'React', 'Basic programming'],
    applicationDeadline: '2024-01-15',
    type: 'hybrid',
    skills: ['HTML', 'CSS', 'JavaScript', 'React']
  },
  {
    id: '2',
    title: 'Rural Development Research Intern',
    organization: 'Ministry of Rural Development',
    location: 'Mumbai',
    sector: 'Agriculture',
    stipend: '₹12,000/month',
    duration: '4 months',
    description: 'Conduct field research on rural development programs and policy implementation.',
    requirements: ['Research skills', 'Data analysis', 'Field work', 'Hindi/Local language'],
    applicationDeadline: '2024-01-20',
    type: 'onsite',
    skills: ['Research', 'Data Analysis', 'Hindi']
  },
  {
    id: '3',
    title: 'Public Health Data Analyst',
    organization: 'Ministry of Health',
    location: 'Bangalore',
    sector: 'Healthcare',
    stipend: '₹18,000/month',
    duration: '6 months',
    description: 'Analyze public health data and create reports for policy makers.',
    requirements: ['Data analysis', 'Excel/Sheets', 'Statistics', 'Report writing'],
    applicationDeadline: '2024-01-25',
    type: 'remote',
    skills: ['Data Analysis', 'Excel', 'Statistics']
  }
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Event - Serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Handle internships API requests
  if (event.request.url.includes('/api/internships')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If online, cache the response and return it
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // If offline, return cached data or mock data
          return caches.match(event.request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Return mock data as fallback
              return new Response(JSON.stringify(OFFLINE_INTERNSHIPS), {
                headers: { 'Content-Type': 'application/json' }
              });
            });
        })
    );
    return;
  }

  // Handle other requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // Return offline fallback for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});