const inquirer = require('inquirer');
const files = require('../lib/files');

module.exports = {

  askGithubCredentials : () => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter Github username or email: ',
        validate: function(value){
          if (value.length) {
            return true;
          } else {
              return 'Enter Github username or email: ';
          }
        }
      },

      {
        name: 'password',
        type: 'password',
        message: 'Enter your password: ',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
              return 'Enter your password: ';
          }
        }
      }
    ];

    return inquirer.prompt(questions);

  },

  askRepoDetails : () => {
    const argv = require('minimist')(process.argv.slice(2));

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter repository name: ',
        default: argv._[0] || files.getCurrentDirectoryBase(),
        validate: function(value) {
          if (value.length) {
            return true;
          }
          else {
            return 'Enter a name for the repository: ';
          }
        }
      },
      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: 'Enter a description for the repository (optional): '
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public or Private: ',
        choices: ['public', 'private'],
        default: 'public'
      }
    ];

    return inquirer.prompt(questions);
  },

  askIgnoreFiles: (fileList) => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you want to ignore: ',
        choices: fileList,
        default: ['node_modules', 'bower_components']
      }
    ];

    return inquirer.prompt(questions);
  }

};