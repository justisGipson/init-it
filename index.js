const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files');
const inquirer = require('./lib/inquirer');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Init-It', { horizontalLayout: 'full' })
  )
);

if (files.directoryExists('.git')) {
  console.log(chalk.red('Git repository already exists!'));
  process.exit();
};


const run = async() => {
  let token = github.getStoredGithubToken();
  if (!token) {
    await github.setGithubCredentials();
    token = await github.registerNewToken();
  }
  console.log(token);
}

run();