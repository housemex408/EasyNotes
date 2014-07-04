##EasyNotes - Making Release Notes Easy

#####This application was built using the Sails.js framework.  To learn more, go to http://sailsjs.org/
#####Welcome to EasyNotes.  To get this project up and running, do the following

*The following commands are all done on the terminal window*

1. git clone git@github.com:housemex408/EasyNotes.git (or git clone https://github.com/housemex408/EasyNotes.git)
2. cd EasyNotes
4. touch config/local.js | echo "module.exports = { app : { jiraUser: '*jira user name*', jiraPwd: '*jira password*', logDir: '/Users/{your user name here}/Documents/apps/easynotes/logs', } }"
5. ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
6. brew update
7. brew install npm
8. npm install -g grunt-cli
9. brew install mongo
10. npm install
11. mongod
12. sails lift app.js
13. grunt copy:dev

**Now open up a browser and type "http://localhost:1337/".  You should see the EasyNotes application!**

*Note: if you make a change to any file under /assets directory, please run command "grunt copy:dev" in terminal window to deploy changes to public folder
