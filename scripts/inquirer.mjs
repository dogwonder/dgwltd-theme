import inquirer from 'inquirer';  // Correct import for Inquirer 10.x
import { exec } from 'child_process';

// Step 1: Get the post types using `wp wptomd-types` command
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
  const fileTypes = ['md', 'html'];

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
      const selectedPostType = answers.postType;

      // Step 3: Prompt the user to select a file type
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'fileType',
            message: 'Select a file type:',
            choices: fileTypes,
          },
        ])
        .then(fileTypeAnswers => {
          const selectedFileType = fileTypeAnswers.fileType;

          // Step 4: Construct the wp wptomd command
          // Note: `ddev` prefix is included as part of environment; remove if not needed
          const targetDir = `wp-content/themes/dgwltd-theme/src/11ty/content/${selectedPostType || 'posts'}/`;
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
            console.log(`Command executed successfully:\n${stdout}`);
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