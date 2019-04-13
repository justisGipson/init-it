#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const github = require('./lib/github');
const repo = require('./lib/repo');

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

const getGithubToken = async () => {
  let token = github.getStoredGithubToken();
  if (token) {
    return token;
  }

  await github.setGithubCredentials();

  token = await github.registerNewToken();
  return token;
}

const run = async() => {
  try {
    const token = await getGithubToken();
    github.githubAuth(token);

    const url = await repo.createRemoteRepo();

    await repo.createGitIgnore();

    const done = await repo.setupRepo(url);

    if (done) {
      console.log(chalk.green('All Done!'));
    }
  } catch(err) {
    if (err) {
      switch (err.code){
        case 401:
          console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
          break;
        case 422:
          console.log(chalk.red('Remote repository already exists with same name.'));
          break;
        default: 
          console.log(err);
      }
    }
  }
}

run();