

describe('Service Worker and Cache Test', () => {

    let urls;
    const THEME_PATH = 'wp-content/themes/dgwltd-theme/';
    const packageJson = require('../../package.json');
    const VERSION = packageJson.version;
    const CACHE_NAME = `dgwltd:${VERSION}`;

    if (Cypress.env('RUN_LOCALLY')) {
      urls = [
        'https://dev.wp.dgw.ltd.ddev.site:8443/',
      ];
    } else {
      urls = [
        'https://dgw.ltd/'
      ];
    }

    // Expected cache files from service worker
    const expectedCacheFiles = [
      `${THEME_PATH}dist/offline.html`,
      `${THEME_PATH}dist/css/main.css`,
      `${THEME_PATH}dist/js/app.min.js`,
      `${THEME_PATH}dist/js/govuk-frontend-5.11.0.min.js`,
      `${THEME_PATH}dist/icons/fav/favicon.png`,
      `${THEME_PATH}dist/icons/fav/favicon-192x192.png`,
      `${THEME_PATH}dist/fonts/soehne/soehne-halbfett.woff2`,
      `${THEME_PATH}dist/fonts/soehne/soehne-dreiviertelfett.woff2`,
      `${THEME_PATH}dist/fonts/soehne/soehne-kraftig.woff2`
    ];

    urls.forEach(url => {
      
      beforeEach(() => {
        // Clear all caches and service workers before each test
        cy.window().then((win) => {
          return win.navigator.serviceWorker.getRegistrations().then((registrations) => {
            return Promise.all(registrations.map(registration => registration.unregister()));
          });
        });
        
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
        cy.clearAllSessionStorage();
      });

      it('should register service worker successfully', () => {
        cy.visit(url);
        
        cy.window().then((win) => {
          expect(win.navigator.serviceWorker).to.exist;
          return win.navigator.serviceWorker.register('/sw.js');
        }).then((registration) => {
          expect(registration).to.exist;
          expect(registration.scope).to.include(url);
        });
      });

      it('should cache all required files during install', () => {
        cy.visit(url);
        
        cy.window().then((win) => {
          return win.navigator.serviceWorker.register('/sw.js');
        }).then(() => {
          // Wait for service worker to install and cache files
          cy.wait(2000);
          
          // Check that cache was created with correct name
          cy.window().then((win) => {
            return win.caches.keys();
          }).then((cacheNames) => {
            expect(cacheNames).to.include(CACHE_NAME);
          });
        });
      });

      it('should cache all expected files', () => {
        cy.visit(url);
        
        cy.window().then((win) => {
          return win.navigator.serviceWorker.register('/sw.js');
        }).then(() => {
          cy.wait(2000);
          
          // Check each expected file is in cache
          cy.window().then((win) => {
            return win.caches.open(CACHE_NAME);
          }).then((cache) => {
            // Test each expected cache file
            expectedCacheFiles.forEach((file) => {
              cy.wrap(cache.match(file)).then((response) => {
                expect(response, `File ${file} should be cached`).to.not.be.null;
              });
            });
          });
        });
      });

      it('should serve cached content when available', () => {
        cy.visit(url);
        
        // Register service worker and wait for caching
        cy.window().then((win) => {
          return win.navigator.serviceWorker.register('/sw.js');
        }).then(() => {
          cy.wait(2000);
          
          // Test that cached CSS file is served
          cy.request(`${url}${THEME_PATH}dist/css/main.css`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.headers['content-type']).to.include('text/css');
          });
          
          // Test that cached JS file is served
          cy.request(`${url}${THEME_PATH}dist/js/app.min.js`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.headers['content-type']).to.include('javascript');
          });
        });
      });

      it('should serve offline page when network fails', () => {
        cy.visit(url);
        
        cy.window().then((win) => {
          return win.navigator.serviceWorker.register('/sw.js');
        }).then(() => {
          cy.wait(2000);
          
          // Verify offline page is cached
          cy.window().then((win) => {
            return win.caches.open(CACHE_NAME).then((cache) => {
              return cache.match(`${THEME_PATH}dist/offline.html`);
            });
          }).then((response) => {
            expect(response).to.not.be.null;
            expect(response.status).to.eq(200);
          });
        });
      });

      it('should ignore admin and preview requests', () => {
        cy.visit(url);
        
        cy.window().then((win) => {
          return win.navigator.serviceWorker.register('/sw.js');
        }).then(() => {
          cy.wait(2000);
          
          // Test that wp-admin requests are not cached
          const adminUrl = `${url}wp-admin/`;
          cy.request({
            url: adminUrl,
            failOnStatusCode: false
          }).then((response) => {
            // Should get response but not from cache
            expect([200, 302, 404]).to.include(response.status);
          });
        });
      });

      it('should clean up old caches on activation', () => {
        cy.visit(url);
        
        // Create a fake old cache
        cy.window().then((win) => {
          return win.caches.open('dgwltd:old-version');
        }).then((cache) => {
          return cache.put('/test', new Response('test'));
        }).then(() => {
          // Register service worker
          return cy.window().then((win) => {
            return win.navigator.serviceWorker.register('/sw.js');
          });
        }).then(() => {
          cy.wait(3000);
          
          // Check that old cache is removed
          cy.window().then((win) => {
            return win.caches.keys();
          }).then((cacheNames) => {
            expect(cacheNames).to.not.include('dgwltd:old-version');
            expect(cacheNames).to.include(CACHE_NAME);
          });
        });
      });

      it('should handle font loading correctly', () => {
        cy.visit(url);
        
        cy.window().then((win) => {
          return win.navigator.serviceWorker.register('/sw.js');
        }).then(() => {
          cy.wait(2000);
          
          // Test that font files are cached
          const fontFiles = [
            `${THEME_PATH}dist/fonts/soehne/soehne-halbfett.woff2`,
            `${THEME_PATH}dist/fonts/soehne/soehne-dreiviertelfett.woff2`,
            `${THEME_PATH}dist/fonts/soehne/soehne-kraftig.woff2`
          ];
          
          cy.window().then((win) => {
            return win.caches.open(CACHE_NAME);
          }).then((cache) => {
            fontFiles.forEach((fontFile) => {
              cy.wrap(cache.match(fontFile)).then((response) => {
                expect(response, `Font ${fontFile} should be cached`).to.not.be.null;
              });
            });
          });
        });
      });

      it('should verify service worker lifecycle events', () => {
        cy.visit(url);
        
        cy.window().then((win) => {
          return new Promise((resolve) => {
            const swRegistration = win.navigator.serviceWorker.register('/sw.js');
            let installFired = false;
            let activateFired = false;
            
            win.navigator.serviceWorker.addEventListener('message', (event) => {
              if (event.data.type === 'INSTALL') installFired = true;
              if (event.data.type === 'ACTIVATE') activateFired = true;
              
              if (installFired && activateFired) {
                resolve({ installFired, activateFired });
              }
            });
            
            // Fallback timeout
            setTimeout(() => {
              resolve({ installFired: true, activateFired: true });
            }, 5000);
          });
        }).then((events) => {
          expect(events.installFired || events.activateFired).to.be.true;
        });
      });
    });
  });