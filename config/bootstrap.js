/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {

    // Development environment bootstrap
    if (sails.config.environment === 'development') {

        console.log('development --------');
        var app = sails.express.app;
        app.set('view options', { pretty: true });
        app.locals.pretty = true;
    }

    // Enable Nodetime App Monitoring
    require('nodetime').profile({
        accountKey: 'b9aef701f5dfc802f664aec698b30203457ceaba',
        appName: 'EZ Notes'
    });

    // Create Logging directory
    var mkdirp = require('mkdirp')
        , logDir = sails.config.app.logDir;

    mkdirp(logDir, function (err) {
        if (err) console.error(err)
        else console.log("Log directory created successfully.");
    });

    // Set logger as a global
    var fs = require('fs')
        , Log = require('log')
        , logDir = sails.config.app.logDir
        , log = new Log('debug', fs.createWriteStream(logDir + '/releaseNotes.log'));

    sails.config.app.logger = log;

    var Client = require('node-rest-client').Client;
    var auth = {user: sails.config.app.jiraUser, password: sails.config.app.jiraPwd};
    var client = new Client(auth);
    client.registerMethod("notes", "http://jira/rest/api/2/search", "GET");
    client.registerMethod("projects", "http://jira/rest/api/2/project", "GET");
    client.registerMethod("versions", "http://jira/rest/api/2/project/${project}/versions", "GET");

    sails.config.app.restClient = client;

    // It's very important to trigger this callack method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};