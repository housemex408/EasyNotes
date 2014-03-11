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
var request = require('request');
var jsonQuery = require('json-query');

module.exports = {


    /**
     * Action blueprints:
     *    `/release/notes`
     */
    notes: function (req, res) {

        var version = "Docket_3.0.0";
        var stories;

        var options = {
            url: 'http://jira/rest/api/2/search/',
//           auth: {
//                'user': 'jalvarado',
//                'pass': 'Mam80samba'
//            },*/
            //qs: "fixVersion='" + version + "' AND project=ETOOLS ORDER BY Key"
            qs: "fixVersion='Docket_3.0.0' AND project=ETOOLS ORDER BY Key"
        }

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body)
                console.log("i got in here!")

                stories = jsonQuery("fields[][description='Story']", {
                    rootContext: info
                })
            }
        }

        request(options, callback);

        return res.view({
            notes: stories
        })
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ReleaseController)
     */
    _config: {}


};
