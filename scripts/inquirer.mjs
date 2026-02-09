import path from 'node:path';
import fs from 'graceful-fs';
import inquirer from 'inquirer';
import search from '@inquirer/search';
import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const Separator = inquirer.Separator;

// ─────────────────────────────────────────────────
// PRESETS - Common export configurations
// ─────────────────────────────────────────────────
const PRESETS = {
  'blog-markdown': {
    name: 'Blog posts to Markdown',
    postType: 'post',
    fileType: 'md',
    exportMode: 'all',
    dryRun: false
  },
  'pages-html': {
    name: 'Pages to HTML',
    postType: 'page',
    fileType: 'html',
    exportMode: 'all',
    dryRun: false
  },
  'all-json': {
    name: 'All posts to JSON',
    postType: 'post',
    fileType: 'json',
    exportMode: 'all',
    dryRun: false
  },
  'content-audit': {
    name: 'Content audit (CSV)',
    postType: 'post',
    fileType: 'csv',
    exportMode: 'all',
    csvFields: 'ID,post_title,word_count,reading_time,category,post_tag',
    dryRun: false
  }
};

const FILE_TYPES = ['md', 'html', 'json', 'jsonld', 'csv'];
const ELEVENTY_FILE_TYPES = ['md', 'html', 'json', 'jsonld'];

// ─────────────────────────────────────────────────
// ENVIRONMENT VALIDATION
// ─────────────────────────────────────────────────
async function validateEnvironment() {
  const spinner = ora('Checking environment...').start();

  try {
    await execAsync('ddev version');
    spinner.text = 'Checking WP-CLI...';
    await execAsync('ddev wp --info');
    spinner.text = 'Checking wp-to-file plugin...';
    // Check if wp-to-file command is available (works for both regular and mu-plugins)
    await execAsync('ddev wp help wptofile');
    spinner.succeed('Environment ready');
    return true;
  } catch (error) {
    spinner.fail('Environment check failed');
    console.log('\n  Requirements:');
    console.log('    - DDEV running: ddev start');
    console.log('    - wp-to-file installed: Check wp-content/mu-plugins/wp-to-file/\n');
    return false;
  }
}

// ─────────────────────────────────────────────────
// POST TYPES LOADER
// ─────────────────────────────────────────────────
async function getPostTypes() {
  const spinner = ora('Fetching post types...').start();

  try {
    const { stdout } = await execAsync('ddev wp wptofile-types');

    const postTypes = stdout.trim().split('\n')
      .filter(line => line.includes('(') && !line.includes(':') && line.includes('- public'))
      .map(line => {
        const match = line.trim().match(/^(\S+)\s+\(([^)]+)\)/);
        if (match) {
          return {
            name: `${match[2]} (${match[1]})`,
            value: match[1],
            short: match[1]
          };
        }
        return null;
      })
      .filter(type => type !== null);

    if (postTypes.length === 0) {
      spinner.fail('No post types found');
      return null;
    }

    spinner.succeed(`Found ${postTypes.length} post types`);
    return postTypes;
  } catch (error) {
    spinner.fail('Failed to fetch post types');
    console.error(`  ${error.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────
// EXPORT PROFILES LOADER
// ─────────────────────────────────────────────────
async function getProfiles() {
  const spinner = ora('Fetching export profiles...').start();

  try {
    const { stdout } = await execAsync('ddev wp wptofile-profiles');
    const lines = stdout.trim().split('\n');
    const profiles = [];
    let current = null;

    for (const line of lines) {
      // Strip ANSI escape codes
      const clean = line.replace(/\x1b\[[0-9;]*m/g, '');
      const trimmed = clean.trim();

      if (!trimmed || trimmed.startsWith('Available') || trimmed.startsWith('Usage:') || trimmed.startsWith('No profiles')) {
        continue;
      }

      const configMatch = trimmed.match(/^post_type:\s*(\S+),?\s*file_type:\s*(\S+)/);
      if (configMatch && current) {
        current.postType = configMatch[1].replace(/,$/, '');
        current.fileType = configMatch[2];
        profiles.push(current);
        current = null;
        continue;
      }

      const indent = clean.length - clean.trimStart().length;
      if (indent <= 2 && !configMatch) {
        current = { name: trimmed, description: '', postType: 'post', fileType: 'md' };
      } else if (indent >= 4 && current && !current.description) {
        current.description = trimmed;
      }
    }

    if (current) profiles.push(current);

    if (profiles.length === 0) {
      spinner.fail('No export profiles found');
      console.log('\n  Add profiles to config/export-profiles.yaml in the wp-to-file plugin\n');
      return null;
    }

    spinner.succeed(`Found ${profiles.length} export profiles`);
    return profiles;
  } catch (error) {
    spinner.fail('Failed to fetch profiles');
    console.error(`  ${error.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────
// FORMAT LISTING
// ─────────────────────────────────────────────────
async function listFormats() {
  const spinner = ora('Fetching available formats...').start();

  try {
    const { stdout } = await execAsync('ddev wp wptofile-formats');
    spinner.succeed('Available export formats');
    console.log(`\n${stdout}`);
  } catch (error) {
    spinner.fail('Failed to fetch formats');
    console.error(`  ${error.message}`);
  }
}

// ─────────────────────────────────────────────────
// PROFILE LISTING
// ─────────────────────────────────────────────────
async function listProfiles() {
  const spinner = ora('Fetching export profiles...').start();

  try {
    const { stdout } = await execAsync('ddev wp wptofile-profiles');
    spinner.succeed('Available export profiles');
    console.log(`\n${stdout}`);
  } catch (error) {
    spinner.fail('Failed to fetch profiles');
    console.error(`  ${error.message}`);
  }
}

// ─────────────────────────────────────────────────
// SUMMARY DISPLAY
// ─────────────────────────────────────────────────
function printSummary(config) {
  const exportPath = config.exportPath || config.postType;

  console.log('\n┌────────────────────────────────────────┐');
  console.log('│         Export Configuration           │');
  console.log('├────────────────────────────────────────┤');
  console.log(`│  Post Type:   ${(config.postType || '').padEnd(25)}│`);
  console.log(`│  Format:      ${(config.fileType || '').padEnd(25)}│`);
  console.log(`│  Destination: ${exportPath.padEnd(25)}│`);
  if (config.csvFields) {
    console.log(`│  CSV Fields:  ${(config.csvFields.length > 20 ? config.csvFields.slice(0, 17) + '...' : config.csvFields).padEnd(25)}│`);
  }
  if (config.filters && config.filters.length > 0) {
    console.log(`│  Filters:     ${String(config.filters.length + ' active').padEnd(25)}│`);
  }
  console.log(`│  Mode:        ${(config.dryRun ? 'Preview (dry-run)' : 'Export').padEnd(25)}│`);
  console.log('└────────────────────────────────────────┘\n');
}

// ─────────────────────────────────────────────────
// SEARCHABLE POST TYPE SELECTION
// ─────────────────────────────────────────────────
async function selectPostType(postTypes) {
  return await search({
    message: 'Select post type (type to search):',
    source: async (term) => {
      const filtered = postTypes.filter(pt =>
        pt.name.toLowerCase().includes((term || '').toLowerCase())
      );
      return filtered.map(pt => ({
        name: pt.name,
        value: pt.value,
        description: `Export ${pt.value} content`
      }));
    }
  });
}

// ─────────────────────────────────────────────────
// CSV FIELD CONFIGURATION
// ─────────────────────────────────────────────────
async function configureCSVFields() {
  const { fieldSelection } = await inquirer.prompt([{
    type: 'list',
    name: 'fieldSelection',
    message: 'CSV field selection:',
    choices: [
      { name: 'All fields (default)', value: 'all' },
      { name: 'Basic fields only', value: 'basic' },
      { name: 'Content analysis fields', value: 'analysis' },
      { name: 'Custom field list', value: 'custom' }
    ]
  }]);

  if (fieldSelection === 'basic') {
    return 'ID,post_title,post_name,post_type,post_status,post_date,author_name';
  } else if (fieldSelection === 'analysis') {
    return 'ID,post_title,word_count,reading_time,category,post_tag';
  } else if (fieldSelection === 'custom') {
    const { fields } = await inquirer.prompt([{
      type: 'input',
      name: 'fields',
      message: 'Enter comma-separated field names (e.g., "ID,post_title,meta:custom_field"):',
      validate: input => input.trim() ? true : 'Fields cannot be empty.'
    }]);
    return fields;
  }

  return null; // all fields
}

// ─────────────────────────────────────────────────
// EXPORT DIRECTORY CONFIGURATION
// ─────────────────────────────────────────────────
async function configureExportDirectory(defaultDir) {
  const { dirOption } = await inquirer.prompt([{
    type: 'list',
    name: 'dirOption',
    message: 'Export directory structure:',
    choices: [
      { name: `Use post type folder (${defaultDir})`, value: 'posttype' },
      { name: 'Custom subdirectory name', value: 'custom' }
    ]
  }]);

  if (dirOption === 'custom') {
    const { dirname } = await inquirer.prompt([{
      type: 'input',
      name: 'dirname',
      message: 'Enter subdirectory name (e.g., "archive/2024" or "migration"):',
      default: defaultDir,
      validate: input => {
        if (!input.trim()) return 'Directory name cannot be empty.';
        if (input.includes('..')) return 'Invalid directory name (no parent directory references).';
        return true;
      }
    }]);
    return dirname;
  }

  return defaultDir;
}

// ─────────────────────────────────────────────────
// FILTER CONFIGURATION
// ─────────────────────────────────────────────────
async function configureFilters() {
  const { exportMode } = await inquirer.prompt([{
    type: 'list',
    name: 'exportMode',
    message: 'How would you like to select content?',
    choices: [
      { name: 'Export all posts', value: 'all' },
      new Separator('─── Filters ───'),
      { name: 'Filter by search term', value: 'search' },
      { name: 'Filter by date range', value: 'date' },
      { name: 'Filter by category', value: 'category' },
      new Separator('─── Advanced ───'),
      { name: 'Custom filters', value: 'advanced' }
    ]
  }]);

  const filterOptions = [];

  if (exportMode === 'search') {
    const { searchTerm } = await inquirer.prompt([{
      type: 'input',
      name: 'searchTerm',
      message: 'Enter search term:',
      validate: input => input.trim() ? true : 'Search term cannot be empty.'
    }]);
    filterOptions.push(`--search="${searchTerm}"`);

  } else if (exportMode === 'date') {
    const { dateRange } = await inquirer.prompt([{
      type: 'list',
      name: 'dateRange',
      message: 'Select date range:',
      choices: [
        { name: 'Last week', value: '--date-from="1 week ago"' },
        { name: 'Last month', value: '--date-from="1 month ago"' },
        { name: 'Last 3 months', value: '--date-from="3 months ago"' },
        { name: 'Last 6 months', value: '--date-from="6 months ago"' },
        { name: 'This year', value: `--date-from="${new Date().getFullYear()}-01-01"` },
        { name: 'Custom range', value: 'custom' }
      ]
    }]);

    if (dateRange === 'custom') {
      const customDate = await inquirer.prompt([
        {
          type: 'input',
          name: 'dateFrom',
          message: 'From date (YYYY-MM-DD or relative like "6 months ago"):',
          validate: input => input.trim() ? true : 'Date cannot be empty.'
        },
        {
          type: 'input',
          name: 'dateTo',
          message: 'To date (YYYY-MM-DD or "now") [optional]:'
        }
      ]);
      filterOptions.push(`--date-from="${customDate.dateFrom}"`);
      if (customDate.dateTo.trim()) {
        filterOptions.push(`--date-to="${customDate.dateTo}"`);
      }
    } else {
      filterOptions.push(dateRange);
    }

  } else if (exportMode === 'category') {
    const { categories } = await inquirer.prompt([{
      type: 'input',
      name: 'categories',
      message: 'Enter category names (comma-separated):',
      validate: input => input.trim() ? true : 'Categories cannot be empty.'
    }]);
    filterOptions.push(`--category="${categories}"`);

  } else if (exportMode === 'advanced') {
    const advancedAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'postIds',
        message: 'Specific post IDs (comma-separated, optional):',
        validate: input => {
          if (!input.trim()) return true;
          const ids = input.split(',').map(id => id.trim());
          const invalidIds = ids.filter(id => !/^\d+$/.test(id));
          return invalidIds.length === 0 || `Invalid post IDs: ${invalidIds.join(', ')}. Use only numbers.`;
        }
      },
      {
        type: 'input',
        name: 'search',
        message: 'Search term (optional):'
      },
      {
        type: 'input',
        name: 'authors',
        message: 'Author usernames/IDs (comma-separated, optional):'
      },
      {
        type: 'input',
        name: 'categories',
        message: 'Category names/slugs (comma-separated, optional):'
      },
      {
        type: 'input',
        name: 'tags',
        message: 'Tag names/slugs (comma-separated, optional):'
      },
      {
        type: 'confirm',
        name: 'excludeEmpty',
        message: 'Exclude posts with empty content?',
        default: false
      },
      {
        type: 'confirm',
        name: 'requireFeaturedImage',
        message: 'Only include posts with featured images?',
        default: false
      }
    ]);

    if (advancedAnswers.postIds.trim()) filterOptions.push(`--post-ids="${advancedAnswers.postIds}"`);
    if (advancedAnswers.search.trim()) filterOptions.push(`--search="${advancedAnswers.search}"`);
    if (advancedAnswers.authors.trim()) filterOptions.push(`--authors="${advancedAnswers.authors}"`);
    if (advancedAnswers.categories.trim()) filterOptions.push(`--category="${advancedAnswers.categories}"`);
    if (advancedAnswers.tags.trim()) filterOptions.push(`--tag="${advancedAnswers.tags}"`);
    if (advancedAnswers.excludeEmpty) filterOptions.push('--exclude-empty');
    if (advancedAnswers.requireFeaturedImage) filterOptions.push('--require-featured');
  }

  return filterOptions;
}

// ─────────────────────────────────────────────────
// COMMAND EXECUTION
// ─────────────────────────────────────────────────
async function executeExport(command, config) {
  printSummary(config);

  const { proceed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'proceed',
    message: 'Proceed with export?',
    default: true
  }]);

  if (!proceed) {
    console.log('\nExport cancelled.');
    return;
  }

  // Ensure export directory exists
  const fullExportPath = path.resolve('../../export', config.exportPath || config.postType);
  if (!fs.existsSync(fullExportPath)) {
    fs.mkdirSync(fullExportPath, { recursive: true });
    console.log(`\n  Created: wp-content/export/${config.exportPath || config.postType}/`);
  }

  console.log(`\n  Command: ${command}\n`);

  const spinner = ora('Exporting content...').start();

  try {
    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes('Warning')) {
      spinner.warn('Export completed with warnings');
      console.log(`\n  ${stderr}`);
    } else {
      spinner.succeed('Export completed');
    }

    if (config.dryRun) {
      console.log('\n  Preview results:');
    } else {
      console.log(`\n  Files saved to: wp-content/export/${config.exportPath || config.postType}/`);
    }
    console.log(`\n${stdout}`);

  } catch (error) {
    spinner.fail('Export failed');
    console.error(`\n  ${error.message}`);

    if (error.message.includes('wp: command not found')) {
      console.log('  Tip: Make sure DDEV is running and WP-CLI is available');
    } else if (error.message.includes('wptofile')) {
      console.log('  Tip: Make sure wp-to-file plugin is installed and active');
    }
  }
}

// ─────────────────────────────────────────────────
// WP-TO-FILE EXPORT FLOW
// ─────────────────────────────────────────────────
async function runWpToFile(presetConfig = null) {
  const postTypes = await getPostTypes();
  if (!postTypes) return;

  let config;

  if (presetConfig) {
    // Using a preset
    config = { ...presetConfig };
    config.exportPath = config.postType;
  } else {
    // Custom configuration
    const postType = await selectPostType(postTypes);

    const { fileType } = await inquirer.prompt([{
      type: 'list',
      name: 'fileType',
      message: 'Select file format:',
      choices: FILE_TYPES
    }]);

    let csvFields = null;
    if (fileType === 'csv') {
      csvFields = await configureCSVFields();
    }

    const exportPath = await configureExportDirectory(postType);
    const filters = await configureFilters();

    const { dryRun } = await inquirer.prompt([{
      type: 'confirm',
      name: 'dryRun',
      message: 'Run in preview mode (no files created)?',
      default: true
    }]);

    const { withLlmstxt } = await inquirer.prompt([{
      type: 'confirm',
      name: 'withLlmstxt',
      message: 'Generate llms.txt index after export?',
      default: false
    }]);

    const { incremental } = await inquirer.prompt([{
      type: 'confirm',
      name: 'incremental',
      message: 'Incremental export (only changed documents)?',
      default: false
    }]);

    config = {
      postType,
      fileType,
      csvFields,
      exportPath,
      filters,
      dryRun,
      withLlmstxt,
      incremental
    };
  }

  // Build the command
  const filterOptions = config.filters || [];
  if (config.dryRun) {
    filterOptions.push('--dry-run');
  }
  if (config.csvFields) {
    filterOptions.push(`--fields="${config.csvFields}"`);
  }
  if (config.withLlmstxt) {
    filterOptions.push('--with-llmstxt');
  }
  if (config.incremental) {
    filterOptions.push('--incremental');
  }

  const baseCommand = `ddev wp wptofile "${config.exportPath}" --post_type="${config.postType}" --file_type="${config.fileType}"`;
  const command = filterOptions.length > 0
    ? `${baseCommand} ${filterOptions.join(' ')}`
    : baseCommand;

  await executeExport(command, config);
}

// ─────────────────────────────────────────────────
// PRESET SELECTION
// ─────────────────────────────────────────────────
async function runPreset() {
  const presetChoices = Object.entries(PRESETS).map(([key, preset]) => ({
    name: `${preset.name} (${preset.postType} → ${preset.fileType})`,
    value: key,
    short: preset.name
  }));

  const { presetKey } = await inquirer.prompt([{
    type: 'list',
    name: 'presetKey',
    message: 'Select a preset:',
    choices: presetChoices
  }]);

  const preset = PRESETS[presetKey];
  console.log(`\n  Using preset: ${preset.name}`);

  await runWpToFile(preset);
}

// ─────────────────────────────────────────────────
// PROFILE-BASED EXPORT FLOW
// ─────────────────────────────────────────────────
async function runProfile() {
  const profiles = await getProfiles();
  if (!profiles) return;

  const profileChoices = profiles.map(p => ({
    name: `${p.name} — ${p.description} (${p.postType} → ${p.fileType})`,
    value: p.name,
    short: p.name
  }));

  const { profileName } = await inquirer.prompt([{
    type: 'list',
    name: 'profileName',
    message: 'Select an export profile:',
    choices: profileChoices
  }]);

  const profile = profiles.find(p => p.name === profileName);
  const exportPath = await configureExportDirectory(profile.postType || 'export');

  const options = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'dryRun',
      message: 'Run in preview mode (no files created)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'withLlmstxt',
      message: 'Generate llms.txt index after export?',
      default: false
    },
    {
      type: 'confirm',
      name: 'incremental',
      message: 'Incremental export (only changed documents)?',
      default: false
    }
  ]);

  const flags = [];
  if (options.dryRun) flags.push('--dry-run');
  if (options.withLlmstxt) flags.push('--with-llmstxt');
  if (options.incremental) flags.push('--incremental');

  const baseCommand = `ddev wp wptofile "${exportPath}" --profile="${profileName}"`;
  const command = flags.length > 0
    ? `${baseCommand} ${flags.join(' ')}`
    : baseCommand;

  const config = {
    postType: profile.postType,
    fileType: profile.fileType,
    exportPath,
    dryRun: options.dryRun
  };

  await executeExport(command, config);
}

// ─────────────────────────────────────────────────
// 11TY IMPORT FLOW
// ─────────────────────────────────────────────────
async function run11ty() {
  const { fileType } = await inquirer.prompt([{
    type: 'list',
    name: 'fileType',
    message: 'Select file format:',
    choices: ELEVENTY_FILE_TYPES
  }]);

  const { wpUrl } = await inquirer.prompt([{
    type: 'input',
    name: 'wpUrl',
    message: 'Enter the WordPress site URL:',
    validate: input => input.trim() ? true : 'URL cannot be empty.'
  }]);

  const command = `npx @11ty/import wordpress ${wpUrl} --format=${fileType} --output=src/11ty/import/wordpress/`;

  console.log(`\n  Command: ${command}\n`);

  const spinner = ora('Importing from WordPress...').start();

  try {
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      spinner.warn('Import completed with messages');
      console.log(`\n  ${stderr}`);
    } else {
      spinner.succeed('Import completed');
    }

    console.log(`\n${stdout}`);

  } catch (error) {
    spinner.fail('Import failed');
    console.error(`\n  ${error.message}`);
  }
}

// ─────────────────────────────────────────────────
// METHOD SELECTION
// ─────────────────────────────────────────────────
async function selectMethod() {
  const { method } = await inquirer.prompt([{
    type: 'list',
    name: 'method',
    message: 'What would you like to do?',
    choices: [
      { name: 'Use saved preset (quick export)', value: 'preset' },
      { name: 'Use export profile (from YAML config)', value: 'profile' },
      new Separator('─── Export Methods ───'),
      { name: 'Custom wp-to-file export', value: 'wptofile' },
      { name: 'Import to 11ty', value: '11ty' },
      new Separator('─── Info ───'),
      { name: 'List available formats', value: 'formats' },
      { name: 'List export profiles', value: 'profiles' }
    ]
  }]);

  return method;
}

// ─────────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────────
async function main() {
  console.log('\n  WordPress Export CLI\n');

  if (!await validateEnvironment()) {
    return;
  }

  const method = await selectMethod();

  if (method === 'preset') {
    await runPreset();
  } else if (method === 'profile') {
    await runProfile();
  } else if (method === 'wptofile') {
    await runWpToFile();
  } else if (method === '11ty') {
    await run11ty();
  } else if (method === 'formats') {
    await listFormats();
  } else if (method === 'profiles') {
    await listProfiles();
  }

  console.log('\n  Done!\n');
}

// Run the CLI
main().catch(error => {
  if (error.isTtyError) {
    console.error('\n  Prompt couldn\'t be rendered in the current environment');
  } else {
    console.error('\n  Error:', error.message);
  }
  process.exit(1);
});
