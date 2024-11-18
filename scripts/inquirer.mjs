import inquirer from 'inquirer';  // Correct import for Inquirer 10.x
import { exec } from 'child_process';

// Step 1: Get the post types using wp wptomd-types command, notes we are adding ddev as this is the environment, remove if not using ddev
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

      // Step 3: Construct the appropriate wp wptomd command, note we are adding ddev as this is the environment, remove if not using ddev
      const targetDir = `wp-content/themes/dgwltd/src/11ty/content/${selectedPostType || 'posts'}/`;
      const command = `ddev wp wptomd ${targetDir} --post_type=${selectedPostType}`;

      // Step 4: Execute the command
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
        console.log('Something went wrong');
      }
    });
});