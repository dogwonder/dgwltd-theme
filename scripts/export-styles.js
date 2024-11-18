// File: export-styles.js

import { exec } from 'child_process';
import path from 'path';
import { promises as fs } from 'fs';

// Configuration
const wpCliPath = 'ddev wp'; // Adjust if WP-CLI is not in your PATH, note we are adding ddev as this is the environment, remove if not using ddev
const outputDir = path.resolve('./src/vendor/css');
const outputFile = 'wp-content/themes/dgwltd/src/vendor/css/wp.css';

async function ensureDirectoryExists(dir) {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}

async function exportStyles() {
    try {
        await ensureDirectoryExists(outputDir);

        // Construct the WP-CLI command
        const command = `${wpCliPath} export-global-styles ${outputFile}`;

        // Execute the WP-CLI command
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error exporting styles: ${error.message}`);
                process.exit(1);
            }
            if (stderr) {
                console.error(`WP-CLI Error: ${stderr}`);
                process.exit(1);
            }
            console.log(stdout);
            console.log(`Global styles have been successfully exported to ${outputFile}`);
        });
    } catch (error) {
        console.error(`Error ensuring directory exists: ${error.message}`);
        process.exit(1);
    }
}

exportStyles();