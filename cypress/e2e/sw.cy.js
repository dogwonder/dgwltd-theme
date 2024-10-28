describe('Service Worker and Cache Test', () => {
    it('should register service worker and check cache', () => {
      // Register the service worker
      cy.window().then((win) => {
        return win.navigator.serviceWorker.register('/sw.js');
      }).then(() => {
        // Wait for 1 second
        cy.wait(1000);
  
        // Open the cache and match the offline.html file
        cy.window().then((win) => {
          return win.caches.open('dgwltd-1.2.184').then((cache) => {
            return cache.match(`${THEME_PATH}/dist/offline.html`);
          });
        }).then((response) => {
          // Assert that the response is not null
          expect(response).to.not.be.null;
        });
      });
    });
  });