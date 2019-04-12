const _ =require('lodash');
const chalk =require('chalk');
const CLI = require('clui');
const Configstore = require('configstore');
const inquirer = require('./inquirer');
const octokit = require('@octokit/rest')();
const pkg = require('../package.json');
const spinner = CLI.spinner;

const conf = new Configstore(pkg.name);

module.exports = {
  getInstance : () => {
    return octokit;
  },

  getStoredGithubToken : () => {
    return conf.get('github.token');
  },

  setGithubCredentials : async () => {
    const credentials = await inquirer.askGithubCredentials();
    octokit.authenticate(
      _.extend(
        {
          type: 'basic',
        },
        credentials
      )
    );
  },

  registerNewToken : async () => {
    const status = new spinner('Please wait for authentication...');
    status.start();

    try {
      const response = await octokit.authorization.create({
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'Init-it, a CLI tool for initializing Github repos.'
      });
      const token = response.data.token;
      if (token) {
        conf.set('github token', token);
        return token;
      }
      else {
        throw new Error('No Token', 'Github token was not found.');
      }
    }
    catch (err) {
      throw err;
    }
    finally {
    status.stop();
    }
  }
}