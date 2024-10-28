import { defineConfig } from 'cypress';
import { prepareAudit } from 'cypress-audit';
import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import { ReportGenerator } from 'lighthouse/report/generator/report-generator.js';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {

      on('before:browser:launch', (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

       on('task', {
        lighthouseAudit: async ({ url, opts, config }) => {
          const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'], 
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          });
          const page = await browser.newPage();
          await page.goto(url);

          // Config and options for Lighthouse
          const { lhr } = await lighthouse(url, {
            port: new URL(browser.wsEndpoint()).port,
            ...opts, 
          }, config);
          await browser.close();

          // Generate the report
          const report = ReportGenerator.generateReport(lhr, 'html');

          return { lhr, report };
        }
      });
    },
  },
  reporter: 'mochawesome', // specify the reporter
  reporterOptions: {
    reportDir: 'cypress/reports/mocha', // specify the output directory
    reportFilename: 'results', // specify the base name of the report files
    quiet: true, // suppress the output to the console
    overwrite: false, // control whether existing report files should be overwritten
    html: true, // control whether an HTML report should be generated
    json: true // control whether a JSON report should be generated
  }
});