describe('Lighthouse Audits', () => {
  it('should perform a Lighthouse audit for mobile', () => {
    cy.task('lighthouseAudit', {
      url: 'https://wp.dgw.ltd/',
      opts: {
        logLevel: 'info',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
      },
      config: {
        extends: 'lighthouse:default',
        settings: {
          onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
          onlyAudits: [
            'first-contentful-paint',
            'speed-index',
            'largest-contentful-paint',
            'cumulative-layout-shift',
            'total-blocking-time',
          ],
        },
      }
    }).then(({ lhr, report }) => {
      expect(lhr).to.have.property('categories');
      expect(lhr.categories.performance.score).to.be.greaterThan(0.5);
      
      // Write the HTML report
      cy.writeFile('cypress/reports/lighthouse/lighthouse-report-mobile.html', report);

      // Save the JSON report
      cy.writeFile('cypress/reports/lighthouse/lighthouse-report-mobile.json', JSON.stringify(lhr));
    });
  });

  it('should perform a Lighthouse audit for desktop', () => {
    cy.task('lighthouseAudit', {
      url: 'https://wp.dgw.ltd/',
      opts: {
        logLevel: 'info',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'desktop', // Default is mobile, https://github.com/GoogleChrome/lighthouse/blob/main/docs/emulation.md
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        }
      },
      config: {
        extends: 'lighthouse:default',
        settings: {
          onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
          onlyAudits: [
            'first-contentful-paint',
            'speed-index',
            'largest-contentful-paint',
            'cumulative-layout-shift',
            'total-blocking-time',
          ],
        },
      }
    }).then(({ lhr, report }) => {
      
      expect(lhr).to.have.property('categories');
      expect(lhr.categories.performance.score).to.be.greaterThan(0.5);
      
      // Write the HTML report
      cy.writeFile('cypress/reports/lighthouse/lighthouse-report-desktop.html', report);

      // Save the JSON report
      cy.writeFile('cypress/reports/lighthouse/lighthouse-report-desktop.json', JSON.stringify(lhr));
      
    });
  });
});