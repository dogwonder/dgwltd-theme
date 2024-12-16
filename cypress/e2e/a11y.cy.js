/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

/// <reference types="cypress" />
describe('Page accessibility tests', () => {

  let urls;

  if (Cypress.env('RUN_LOCALLY')) {
    urls = [
      'http://dgw.ltd/',
    ];
  } else {
    urls = [
      'https://dgw.ltd/'
    ];
  }

  urls.forEach(url => {
    it(`Should have no accessibility violations on ${url}`, () => {
      cy.visit(url);
      cy.injectAxe();
      cy.checkA11y(null, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'] // WCAG 2.1 Level A and Level AA rules
        }
      }, (violations) => {
        if (violations.length) {
          let errorSummaries = [];
          let detailedErrors = [];
          let totalCount = 0;

          violations.forEach((violation) => {
            totalCount += violation.nodes.length;
            violation.nodes.forEach((node) => {
              const summary = `Error: ${violation.id}, Impact: ${violation.impact}`;
              const details = `
                ID: ${violation.id}
                Target: ${node.target.join(', ')}
                Impact: ${violation.impact}
                Description: ${violation.description}
                Help: ${violation.help}
                Help URL: ${violation.helpUrl}
                HTML: ${node.html}
                Failure Summary: ${node.failureSummary}\n`;

              // Log each violation with a concise summary and detailed report
              Cypress.log({
                name: 'a11y error!',
                consoleProps: () => ({ violation }),
                message: summary
              });

              errorSummaries.push(summary);
              detailedErrors.push(details);
            });
          });

          // Concatenate all errors into a single message with a total count
          const errorReport = `Total Accessibility Violations: ${totalCount}\n\nAccessibility Violations Summary:\n${errorSummaries.join('\n')}\n\nDetailed Errors:\n${detailedErrors.join('\n')}`;
          throw new Error(errorReport);
        }
      });
    });
  });
});