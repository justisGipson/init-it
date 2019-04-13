const _ =require('lodash');
const chalk =require('chalk');
const CLI = require('clui');
const Configstore = require('configstore');
const inquirer = require('./inquirer');
const octokit = require('@octokit/rest');
const pkg = require('../package.json');
const Spinner = CLI.Spinner;

const conf = new Configstore(pkg.name);

module.exports = {
  getInstance : () => {
    return octokit;
  },

  setGithubCredentials : async () => {
    const credentials = await inquirer.askGithubCredentials();
    octokit.auth(
      _.extend(
        {
          type: 'basic',
        },
        credentials
      )
    );
  },

  registerNewToken : async () => {
    const status = new Spinner('Please wait for authentication...');
    status.start();

    try {
      const response = await octokit.oauthAuthorizations.createAuthorization({
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'Init-it, a CLI tool for initializing Github repos.'
      });
      const token = response.data.token;
      if (token) {
        conf.set('github token', token);
        return token;
      } else {
          throw new Error('No Token', 'Github token was not found.');
      }
    } catch (err) {
        throw err;
    } finally {
        status.stop();
    }
  },

  githubAuth: (token) => {
    octokit.auth({
      type: 'oauth',
      token: token
    });
  },

  getStoredGithubToken: () => {
    return conf.get('github.token');
  },

  hasAccessToken : async () => {
    const status = new Spinner('Authenticating, please wait...');
    status.start();

    try {
      const response = await octokit.authorization.getAll();
      const accessToken = _.find(response.data, (row) => {
        if(row.note) {
          return row.note.indexOf('init-it') !== -1;
        }
      });
      return accessToken;
    } catch (err) {
        throw err;
    } finally {
        status.stop();
    }
  },

  regenerateNewToken : async (id) => {
    const tokenUrl = 'https://github.com/settings/tokens/' + id;
    console.log('Please visit ' + chalk.underline.blue.bold(tokenUrl) + ' and click the ' + chalk.red.bold('Regenerate Token Button.\n'));
    const input = await inquirer.askRegeneratedToken();
    if(input) {
      conf.set('github.token', input.token);
      return input.token;
    }
  }

}