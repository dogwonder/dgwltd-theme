// File: export-style.js

const { exec } = require('child_process');
const path = require('path');

// Configuration
const wpCliPath = 'wp'; // Adjust if WP-CLI is not in your PATH
const outputDir = path.resolve('./src/wp');
const outputFile = path.join(outputDir, 'wp.css');

// Ensure the output directory exists
const fs = require('fs');

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