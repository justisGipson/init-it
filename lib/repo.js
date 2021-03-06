const _ = require('lodash');
const CLI = require('clui');
const fs = require('fs');
const git = require('simple-git');
const gh = require('./github');
const inquirer = require('inquirer');
const Spinner = CLI.Spinner;
const touch = require('touch');

module.exports = {

  createRemoteRepo : async () => {
    const github = gh.getInstance();
    const answers = await inquirer.askRepoDetails();

    const data = {
      name: answers.name,
      description: answers.description,
      private: (answer.visibility === 'private')
    };

    const status = new Spinner('Creating remote repository...');
    status.start();

    try {
      const response = await github.repos.create(data);
        return response.data.ssh_url;
    } catch(err) {
        throw err;
    } finally {
        status.stop();
    }
  },

  createGitIgnore: async () =>{
    const fileList = _.without(fs.readdirSync('.'), '.git', '.gitignore');

    if (fileList.length) {
      const answers = await inquirer.askIgnoreFiles(fileList);
      if(answers.ignore.length) {
        fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
      } else {
          touch('.gitignore');
      }
    } else {
        touch('.gitignore');
    }
  },

  setupRepo: async (url) => {
    const status = new Spinner('Initializing local repository and pushing to remote...');
    status.start();

    try {
      await git
        .init()
        .add('.gitignore')
        .add('./*')
        .commit('Initial commit')
        .addRemote('origin', url)
        .push('origin', 'master');
      return true;
    } catch(err) {
        throw err;
    } finally {
        status.stop();
    }
  }

}