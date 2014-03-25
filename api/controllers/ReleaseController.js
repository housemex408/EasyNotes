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

module.exports = {

    /**
     * Action blueprints:
     *    `/release/notes`
     */
    notes: function (req, res) {
        var version = req.param('version');
        var project = req.param('project');
        ReleaseNotes.getNotes(res, project, version);
    },

    /**
     * Action blueprints:
     *    `/release/projects`
     */
    projects: function (req, res) {
        ReleaseNotes.getProjects(res);
    },

    /**
     * Action blueprints:
     *    `/release/versions`
     */
    versions: function (req, res) {
        var project = req.param('project');
        ReleaseNotes.getVersions(res, project);
    },

    update: function (req, res) {
        var content = req.param('content');
        var version = req.param('version');
        var project = req.param('project');
        var contentId = req.param('contentId');
        var pageId = req.param('pageId');
        ReleaseNotes.update(res, project, version, content, contentId, pageId);
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ReleaseController)
     */
    _config: {}
};
