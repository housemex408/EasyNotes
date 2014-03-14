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

    // Development environment
    if (sails.config.environment === 'development') {

        console.log('development --------');
        var app = sails.express.app;
        app.set('view options', { pretty: true });
        app.locals.pretty = true;

    }

    require('nodetime').profile({
        accountKey: 'b9aef701f5dfc802f664aec698b30203457ceaba',
        appName: 'EZ Notes'
    });

    var mkdirp = require('mkdirp')
        , logDir = sails.config.app.logDir;

    mkdirp(logDir, function (err) {
        if (err) console.error(err)
        else console.log("Log directory created successfully.");
    });

    // It's very important to trigger this callack method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};