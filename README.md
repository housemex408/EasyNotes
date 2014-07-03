EasyNotes - An app that pulls release note information from JIRA

This application was built using the Sails.js framework.  To learn more, go to http://sailsjs.org/

Welcome to EasyNotes.  To get this project up and running, do the following

/* The following commands are all done on the terminal window */

1) git clone git@github.com:housemex408/SailsProject.git
2) cd EasyNotes
3) npm install
4) touch config/local.js | echo "module.exports = { app : { jiraUser: '<enter user name here>', jiraPwd: '<enter password here>' } }"
5) ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
6) brew update
7) brew install mongo
8) mongod
9) sails app.js

Now open up a browser and type "http://localhost:1337/".  You should see the EasyNotes application!