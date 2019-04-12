const inquirer = require('inquirer');
const files = require('../lib/files');

module.exports = {
  askGithubCredentials : () => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter Github username or email:',
        validate: function(value){
          if (value.length) {
            return true;
          }
          else {
            return 'Enter Github username or email:';
          }
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: function(value) {
          if (value.length) {
            return true;
          }
          else {
            return 'Enter your password:';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },
};