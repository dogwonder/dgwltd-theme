// File: export-style.js

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// Configuration
const wpCliPath = 'wp'; // Adjust if WP-CLI is not in your PATH
const outputDir = path.resolve('./src/vendor/css');
const outputFile = path.join(outputDir, 'wp.css');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

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