/**
 * Created by jalvarado on 3/12/14.
 */
// ReleaseNotes.js - in api/services
var Client = require('node-rest-client').Client;
var client = new Client();
client.registerMethod("notes", "http://jira/rest/api/2/search", "GET");
client.registerMethod("projects", "http://jira/rest/api/2/project", "GET");
client.registerMethod("versions", "http://jira/rest/api/2/project/${project}/versions", "GET");

var LogLibrary = require('./Logger');

exports.getProjects = function (res) {
    var logger = LogLibrary.get();
    logger.info("entering ReleaseNotes.getProjects()");

    var args = {};

    client.methods.projects(args, function (data) {
        var projects = JSON.parse(data);
        var results = [];

        projects.forEach(function (project) {
            results.push({
                key: project.key,
                name: project.name
            });
        });

        return res.view({
            projects: results
        })
    });
};

exports.getVersions = function (res, project) {
    var args = {
        path: {'project': project}
    };

    client.methods.versions(args, function (data) {
        var versions = JSON.parse(data);
        var results = [];

        versions.forEach(function (version) {
            if (version.released == true) {
                results.push({
                    releaseDate: version.releaseDate,
                    name: version.name,
                    description: version.description
                });
            }
        });

        return res.view({
            versions: results,
            project: project
        })
    });
};


exports.getNotes = function (res, project, version) {
    var logger = LogLibrary.get();

    var args = {
        parameters: {
            jql: "fixVersion='" + version + "' AND project='" + project + "' ORDER BY Key",
            fields: "issuetype,summary"
        }
    };

    client.methods.notes(args, function (data) {
        var issues = JSON.parse(data).issues;
        logger.info("entering ReleaseNotes.getNotes()");
        logger.debug(issues);

        var stories = [];
        var chores = [];
        var bugs = [];

        issues.forEach(function (issue) {
            switch (issue.fields.issuetype.name) {
                case 'Story':
                    stories.push(issue);
                    break;
                case 'Chore':
                    chores.push(issue);
                    break;
                case 'Bug':
                    bugs.push(issue);
                    break;
            }
        });

        return res.view({
            stories: stories,
            chores: chores,
            bugs: bugs,
            version: version
        })
    });
};

exports.update = function (res, project, version, description) {
    var logger = LogLibrary.get();

    Release.create({
        description: description,
        project: project,
        version: version
    }).done(function (err, release) {
        if (err) {
            return logger.error(err);

        } else {
            logger.info("Release updated: ", release);
            return res.json(release);
        }
    });
};