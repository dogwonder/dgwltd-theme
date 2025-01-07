

describe('Service Worker and Cache Test', () => {

    let urls;
    const THEME_PATH = 'wp-content/themes/dgwltd-theme/';
    const packageJson = require('../../package.json');
    const VERSION = packageJson.version;

    // urls = [
    //   'https://dev.wp.dgw.ltd.ddev.site:8443/',
    // ];

    if (Cypress.env('RUN_LOCALLY')) {
      urls = [
        'https://dev.wp.dgw.ltd.ddev.site:8443/',
      ];
    } else {
      urls = [
        'https://dgw.ltd/'
      ];
    }

    urls.forEach(url => {
      it('should register service worker and check cache', () => {
        cy.visit(url);
        // Register the service worker
        cy.window().then((win) => {
          return win.navigator.serviceWorker.register('/sw.js');
        }).then(() => {
          // Wait for 1 second
          cy.wait(1000);
    
          // Open the cache and match the offline.html file
          cy.window().then((win) => {
            return win.caches.open(`dgwltd-${VERSION}`).then((cache) => {
              return cache.match(`${THEME_PATH}dist/offline.html`);
            });
          }).then((response) => {
            // Assert that the response is not null
            expect(response).to.not.be.null;
          });
        });
      });
    });

    
  });