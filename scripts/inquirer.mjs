import path from "node:path";
import fs from "graceful-fs";
import inquirer from 'inquirer';  // Correct import for Inquirer 10.x
import { exec } from 'child_process';

//Base on https://www.npmjs.com/package/inquirer

// Step 1: Ask the user to select a method of exporting
const methods = ['wptofile', '11ty'];

inquirer
  .prompt([
    {
      type: 'list',
      name: 'method',
      message: 'Export method:',
      choices: methods,
    },
  ])
  .then(methodAnswers => {
    const selectedMethod = methodAnswers.method;

    if (selectedMethod === 'wptofile') {

      // Step 2: Get the post types using `wp wptofile-types` command
      // Note: `ddev` is included as part of the environment; remove it if not needed
      exec('ddev wp wptofile-types', (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Failed to get post types: ${error.message}`);
          console.error('💡 Make sure DDEV is running and wp-to-file plugin is active');
          return;
        }
        if (stderr) {
          console.error(`⚠️  Warning getting post types: ${stderr}`);
          return;
        }

        // Parse post types from output - extract slug before the parentheses
        // Input format: "  post (Posts)" or "post (Posts) - public"
        // Filter to public post types only for better UX
        const postTypes = stdout.trim().split('\n')
          .filter(line => line.includes('(') && !line.includes(':') && line.includes('- public')) // Only public types
          .map(line => {
            // Extract slug and label for better display
            const match = line.trim().match(/^(\S+)\s+\(([^)]+)\)/);
            if (match) {
              return {
                name: `${match[2]} (${match[1]})`, // Display as "Posts (post)"
                value: match[1], // Use slug as value
                short: match[1]
              };
            }
            return null;
          })
          .filter(type => type !== null);

        if (postTypes.length === 0) {
          console.error('❌ No post types found. Please check your WordPress installation.');
          return;
        }
        
        const fileTypes = ['md', 'html', 'json', 'jsonld', 'csv', 'asciidoc'];

        // Step 2: Use Inquirer to let the user select a post type
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'postType',
              message: 'Select a post type:',
              choices: postTypes,
            },
          ])
          .then(answers => {

            // Get the selected post type
            const selectedPostType = answers.postType;

            // Step 3: Prompt the user to select a file type
            inquirer
              .prompt([
                {
                  type: 'list',
                  name: 'fileType',
                  message: 'Select a file format:',
                  choices: fileTypes,
                },
              ])
              .then(async (fileTypeAnswers) => {
                const selectedFileType = fileTypeAnswers.fileType;

                // Step 3.5: If CSV is selected, ask about field selection
                let csvFields = null;
                if (selectedFileType === 'csv') {
                  const csvFieldAnswer = await inquirer.prompt([
                    {
                      type: 'list',
                      name: 'fieldSelection',
                      message: 'CSV field selection:',
                      choices: [
                        { name: 'All fields (default)', value: 'all' },
                        { name: 'Basic fields only', value: 'basic' },
                        { name: 'Content analysis fields', value: 'analysis' },
                        { name: 'Custom field list', value: 'custom' }
                      ]
                    }
                  ]);

                  if (csvFieldAnswer.fieldSelection === 'basic') {
                    csvFields = 'ID,post_title,post_name,post_type,post_status,post_date,author_name';
                  } else if (csvFieldAnswer.fieldSelection === 'analysis') {
                    csvFields = 'ID,post_title,word_count,reading_time,category,post_tag';
                  } else if (csvFieldAnswer.fieldSelection === 'custom') {
                    const customFieldAnswer = await inquirer.prompt([
                      {
                        type: 'input',
                        name: 'fields',
                        message: 'Enter comma-separated field names (e.g., "ID,post_title,meta:custom_field"):',
                        validate: input => input.trim() ? true : 'Fields cannot be empty.'
                      }
                    ]);
                    csvFields = customFieldAnswer.fields;
                  }
                }

                // Step 4: Ask about export directory
                const dirAnswer = await inquirer.prompt([
                  {
                    type: 'list',
                    name: 'dirOption',
                    message: 'Export directory structure:',
                    choices: [
                      { name: `Use post type folder (${selectedPostType})`, value: 'posttype' },
                      { name: 'Custom subdirectory name', value: 'custom' }
                    ]
                  }
                ]);

                let exportSubdirName = selectedPostType;
                if (dirAnswer.dirOption === 'custom') {
                  const customDirAnswer = await inquirer.prompt([
                    {
                      type: 'input',
                      name: 'dirname',
                      message: 'Enter subdirectory name (e.g., "archive/2024" or "migration"):',
                      default: selectedPostType,
                      validate: input => {
                        if (!input.trim()) return 'Directory name cannot be empty.';
                        if (input.includes('..')) return 'Invalid directory name (no parent directory references).';
                        return true;
                      }
                    }
                  ]);
                  exportSubdirName = customDirAnswer.dirname;
                }

                // Step 5: Ask about filtering options
                return inquirer.prompt([
                  {
                    type: 'list',
                    name: 'exportMode',
                    message: 'How would you like to select content?',
                    choices: [
                      { name: 'Export all posts', value: 'all' },
                      { name: 'Filter by search term', value: 'search' },
                      { name: 'Filter by date range', value: 'date' },
                      { name: 'Filter by category', value: 'category' },
                      { name: 'Advanced filters', value: 'advanced' }
                    ],
                  }
                ]).then(modeAnswers => ({
                  ...fileTypeAnswers,
                  ...modeAnswers,
                  csvFields,
                  exportSubdirName
                }));
              })
              .then(async (answers) => {
                const selectedFileType = answers.fileType;
                const exportMode = answers.exportMode;
                const csvFields = answers.csvFields;
                const exportSubdirName = answers.exportSubdirName;
                
                // Build filtering options based on selection
                let filterOptions = [];
                
                if (exportMode === 'search') {
                  const searchAnswer = await inquirer.prompt([
                    {
                      type: 'input',
                      name: 'searchTerm',
                      message: 'Enter search term:',
                      validate: input => input.trim() ? true : 'Search term cannot be empty.'
                    }
                  ]);
                  filterOptions.push(`--search="${searchAnswer.searchTerm}"`);
                } else if (exportMode === 'date') {
                  const dateAnswer = await inquirer.prompt([
                    {
                      type: 'list',
                      name: 'dateRange',
                      message: 'Select date range:',
                      choices: [
                        { name: 'Last week', value: '--date-from="1 week ago"' },
                        { name: 'Last month', value: '--date-from="1 month ago"' },
                        { name: 'Last 3 months', value: '--date-from="3 months ago"' },
                        { name: 'Last 6 months', value: '--date-from="6 months ago"' },
                        { name: 'This year', value: '--date-from="' + new Date().getFullYear() + '-01-01"' },
                        { name: 'Custom range', value: 'custom' }
                      ]
                    }
                  ]);
                  
                  if (dateAnswer.dateRange === 'custom') {
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
                        message: 'To date (YYYY-MM-DD or "now") [optional]:',
                      }
                    ]);
                    filterOptions.push(`--date-from="${customDate.dateFrom}"`);
                    if (customDate.dateTo.trim()) {
                      filterOptions.push(`--date-to="${customDate.dateTo}"`);
                    }
                  } else {
                    filterOptions.push(dateAnswer.dateRange);
                  }
                } else if (exportMode === 'category') {
                  const categoryAnswer = await inquirer.prompt([
                    {
                      type: 'input',
                      name: 'categories',
                      message: 'Enter category names (comma-separated):',
                      validate: input => input.trim() ? true : 'Categories cannot be empty.'
                    }
                  ]);
                  filterOptions.push(`--category="${categoryAnswer.categories}"`);
                } else if (exportMode === 'advanced') {
                  const advancedAnswers = await inquirer.prompt([
                    {
                      type: 'input',
                      name: 'postIds',
                      message: 'Specific post IDs (comma-separated, optional):',
                      validate: input => {
                        if (!input.trim()) return true; // Optional field
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

                // Ask about dry run
                const dryRunAnswer = await inquirer.prompt([
                  {
                    type: 'confirm',
                    name: 'dryRun',
                    message: 'Run in preview mode (no files created)?',
                    default: true
                  }
                ]);
                
                if (dryRunAnswer.dryRun) {
                  filterOptions.push('--dry-run');
                }

                // Add CSV fields if specified
                if (csvFields) {
                  filterOptions.push(`--fields="${csvFields}"`);
                }

                // Step 6: Construct the wp wptofile command
                // wp-to-file exports to wp-content/export/ by default
                // Use custom subdirectory name or post type
                const exportSubdir = exportSubdirName;
                // From theme directory, go up to wp-content, then into export
                const fullExportPath = path.resolve('../../export', exportSubdir);

                // Ensure the export directory exists
                if (!fs.existsSync(fullExportPath)) {
                  fs.mkdirSync(fullExportPath, { recursive: true });
                  console.log(`📁 Created export directory: wp-content/export/${exportSubdir}/`);
                }

                // Build the complete command with properly quoted arguments
                // Pass just the subdirectory - wp-to-file will prepend wp-content/export/
                const baseCommand = `ddev wp wptofile "${exportSubdir}" --post_type="${selectedPostType}" --file_type="${selectedFileType}"`;
                const command = filterOptions.length > 0
                  ? `${baseCommand} ${filterOptions.join(' ')}`
                  : baseCommand;

                console.log(`\n🚀 Running command: ${command}\n`);
                console.log(`📁 Exporting to: wp-content/export/${exportSubdir}/\n`);
                if (csvFields) {
                  console.log(`📊 CSV fields: ${csvFields}\n`);
                }

                // Step 7: Execute the command
                exec(command, (error, stdout, stderr) => {
                  if (error) {
                    console.error(`❌ Export failed: ${error.message}`);
                    if (error.message.includes('wp: command not found')) {
                      console.error('💡 Make sure DDEV is running and WP-CLI is available');
                    } else if (error.message.includes('wptofile')) {
                      console.error('💡 Make sure wp-to-file plugin is installed and active');
                    }
                    return;
                  }
                  if (stderr && !stderr.includes('Warning')) {
                    console.error(`⚠️  Export warning: ${stderr}`);
                  }
                  
                  if (dryRunAnswer.dryRun) {
                    console.log(`🔍 Preview completed:\n${stdout}`);
                  } else {
                    console.log(`💫 Export completed successfully:\n${stdout}`);
                    console.log(`📁 Files saved to: wp-content/export/${exportSubdir}/`);
                  }
                });
              })
              .catch(error => {
                if (error.isTtyError) {
                  console.log('Prompt couldn’t be rendered in the current environment');
                } else {
                  console.log('Something went wrong', error);
                }
              });
          })
          .catch(error => {
            if (error.isTtyError) {
              console.log('Prompt couldn’t be rendered in the current environment');
            } else {
              console.log('Something went wrong', error);
            }
          });
      });

     } else if (selectedMethod === '11ty') {

      // Step 2: Select file format
      const fileTypes = ['md', 'html', 'json', 'jsonld'];

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'fileType',
            message: 'Select a file format:',
            choices: fileTypes,
          },
        ])
        .then(fileTypeAnswers => {
          const selectedFileType = fileTypeAnswers.fileType;

          // Step 3: Ask for the WordPress URL
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'wpUrl',
                message: 'Enter the WordPress site URL:',
                validate: input => input ? true : 'URL cannot be empty.',
              },
            ])
            .then(urlAnswers => {
              const wpUrl = urlAnswers.wpUrl;

              // Step 4: Construct and execute the 11ty import command
              const command = `npx @11ty/import wordpress ${wpUrl} --format=${selectedFileType} --output=src/11ty/import/${selectedMethod}/`;

              exec(command, (error, stdout, stderr) => {
                if (error) {
                  console.error(`Error: ${error.message}`);
                  return;
                }
                if (stderr) {
                  console.error(`stderr: ${stderr}`);
                  return;
                }
                console.log(`💫 All exported:\n${stdout}`);
              });
            })
            .catch(error => console.error('Something went wrong:', error));
        })
        .catch(error => console.error('Something went wrong:', error));
    }
  })
  .catch(error => console.error('Something went wrong:', error));