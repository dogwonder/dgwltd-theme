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

        // Assuming the command returns post types as a newline-separated list
        const postTypes = stdout.trim().split('\n').filter(type => type.length > 0);

        if (postTypes.length === 0) {
          console.error('❌ No post types found. Please check your WordPress installation.');
          return;
        }
        
        const fileTypes = ['md', 'html', 'json', 'csv', 'asciidoc'];

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
              .then(fileTypeAnswers => {
                const selectedFileType = fileTypeAnswers.fileType;

                // Step 4: Ask about filtering options
                return inquirer.prompt([
                  {
                    type: 'list',
                    name: 'exportMode',
                    message: 'How would you like to select content?',
                    choices: [
                      { name: 'Export all posts', value: 'all' },
                      { name: 'Use export profile', value: 'profile' },
                      { name: 'Filter by search term', value: 'search' },
                      { name: 'Filter by date range', value: 'date' },
                      { name: 'Filter by category', value: 'category' },
                      { name: 'Advanced filters', value: 'advanced' }
                    ],
                  }
                ]).then(modeAnswers => ({ ...fileTypeAnswers, ...modeAnswers }));
              })
              .then(async (answers) => {
                const selectedFileType = answers.fileType;
                const exportMode = answers.exportMode;
                
                // Build filtering options based on selection
                let filterOptions = [];
                
                if (exportMode === 'profile') {
                  const profileAnswer = await inquirer.prompt([
                    {
                      type: 'list',
                      name: 'profile',
                      message: 'Select export profile:',
                      choices: [
                        { name: 'Blog posts (published, with featured images)', value: 'blog' },
                        { name: 'All pages', value: 'pages' },
                        { name: 'Documentation (published content)', value: 'docs' },
                        { name: 'Migration (all content)', value: 'migration' },
                        { name: 'Content audit (metadata focus)', value: 'audit' },
                        { name: 'API export (structured data)', value: 'api' }
                      ]
                    }
                  ]);
                  filterOptions.push(`--profile="${profileAnswer.profile}"`);
                } else if (exportMode === 'search') {
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
                  if (advancedAnswers.requireFeaturedImage) filterOptions.push('--require-featured-image');
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

                // Step 5: Construct the wp wptofile command
                const currentPath = path.resolve();
                const makeDir = `${currentPath}/src/11ty/import/${selectedMethod}/${selectedPostType || 'posts'}/`;
                const targetDir = `wp-content/themes/dgwltd-theme/src/11ty/import/${selectedMethod}/${selectedPostType || 'posts'}/`;

                // Check if the directory exists
                if (!fs.existsSync(makeDir)) {
                  fs.mkdirSync(makeDir, { recursive: true });
                }

                // Build the complete command
                const baseCommand = `ddev wp wptofile ${targetDir} --post_type=${selectedPostType} --file_type=${selectedFileType}`;
                const command = filterOptions.length > 0 
                  ? `${baseCommand} ${filterOptions.join(' ')}`
                  : baseCommand;

                console.log(`\n🚀 Running command: ${command}\n`);

                // Step 6: Execute the command
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
                    console.log(`📁 Files saved to: ${makeDir}`);
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
      const fileTypes = ['md', 'html', 'json'];

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