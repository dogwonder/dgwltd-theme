import path from "node:path";
import fs from "graceful-fs";
import inquirer from 'inquirer';  // Correct import for Inquirer 10.x
import { exec } from 'child_process';

// Step 1: Ask the user to select a method of exporting
const methods = ['wptomd', '11ty'];

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

    if (selectedMethod === 'wptomd') {

      // Step 2: Get the post types using `wp wptomd-types` command
      // Note: `ddev` is included as part of the environment; remove it if not needed
      exec('ddev wp wptomd-types', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }

        // Assuming the command returns post types as a newline-separated list
        const postTypes = stdout.trim().split('\n');
        const fileTypes = ['markdown', 'html'];

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

            // Step 4: Prompt the user to select a file type
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

                // Step 4: Construct the wp wptomd command
                // Note: `ddev` prefix is included as part of environment; remove if not needed
                //Get the current path and add the target directory

                const currentPath = path.resolve();
                const makeDir = `${currentPath}/src/11ty/import/${selectedMethod}/${selectedPostType || 'posts'}/`;
                const targetDir = `wp-content/themes/dgwltd-theme/src/11ty/import/${selectedMethod}/${selectedPostType || 'posts'}/`;

                //Check if the directory exists
                if (!fs.existsSync(makeDir)) {
                  fs.mkdirSync(makeDir, { recursive: true });
                }

                const command = `ddev wp wptomd ${targetDir} --post_type=${selectedPostType} --file_type=${selectedFileType}`;

                // Step 5: Execute the command
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
      const fileTypes = ['markdown', 'html'];

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