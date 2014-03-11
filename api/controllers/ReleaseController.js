/**
 * ReleaseController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var Client = require('node-rest-client').Client;

module.exports = {


    /**
     * Action blueprints:
     *    `/release/notes`
     */
    notes: function (req, res) {

        var version = "Docket_3.0.0";
        var stories = [];

        var client = new Client();

        var args ={
            parameters:{
                jql:"fixVersion='" + version + "' AND project=ETOOLS ORDER BY Key"
            }
        };

        // registering remote methods
        client.registerMethod("search", "http://jira/rest/api/2/search", "GET");

        client.methods.search(args, function (data, response) {
            var issues  = JSON.parse(data).issues;

            issues.forEach(function(issue)
            {
                if (issue.fields.issuetype.name == 'Story')
                    stories.push(issue);
            });

            //console.log(stories);

            return res.view({
                notes: stories
            })
        });
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ReleaseController)
     */
    _config: {}


};
