/*
This angular.js app is using angular ui.router module.  You can find documentation here:

 https://github.com/angular-ui/ui-router
 https://egghead.io/lessons/angularjs-introduction-ui-router
 https://github.com/angular-ui/ui-router/wiki/URL-Routing
 */
'use strict'
var eazyNotes = angular.module('EazyNotes', ['ui.router.state','ncy-angular-breadcrumb'])
    .config(function($breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
          template: 'bootstrap3'
        });
    })
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('projects', {
                url: '/',
                templateUrl: 'spa/pages/projects.html',
                controller: 'ProjectsController',
                data: {
                    ncyBreadcrumbLabel: 'Home'
                }
            })
            .state('versions', {
                url: '/:project',
                templateUrl: 'spa/pages/versions.html',
                controller: 'VersionsController',
                data: {
                    ncyBreadcrumbLabel: '{{project}}'
                }
            })
            .state('notes', {
                url: '/:project/:version',
                templateUrl: 'spa/pages/notes.html',
                controller: 'NotesController',
                data: {
                    ncyBreadcrumbLabel: '{{version}}'
                }
            });

        $urlRouterProvider.otherwise('/');
    }]);

eazyNotes.factory('EasyNotesService', function ($http) {
    var EasyNotesService = function (data) {
        angular.extend(this, data);
    };

    EasyNotesService.getProjects = function (successCallback) {
        return $http.get('api/projects')
            .then(function (response) {
                successCallback(response.data);
                return new EasyNotesService(response.data);
            });
    };

    EasyNotesService.getVersions = function (project, successCallback) {
        return $http.get('api/' + project + '/versions')
            .then(function (response) {
                successCallback(response.data);
                return new EasyNotesService(response.data);
            });
    };

    EasyNotesService.getNotes = function (project, version, successCallback) {
        return $http.get('api/' + project + '/' + version)
            .then(function (response) {
                successCallback(response.data);
                return new EasyNotesService(response.data);
            });
    };

    EasyNotesService.update = function (data, successCallback) {
        var url = "api/" + data.project + "/" + data.version + "/update";
        var data = {
            content: data.content,
            contentId: data.contentId,
            pageId: data.pageId,
            project: data.project,
            version: data.version
        };
        $http.post(url, data)
            .success(function (data, status, headers, config) {
                successCallback(data, status, headers, config);
            });
    };

    return EasyNotesService;
});

eazyNotes.controller("ProjectsController", function ($scope, EasyNotesService, $location) {
    console.log("inside projects controller!");
    $scope.projects = [];
    EasyNotesService.getProjects(function (data) {
        console.log("retrieving projects...");
        //console.log(data);
        $scope.projects = data.projects;
    });
});

eazyNotes.controller("VersionsController", function ($scope, EasyNotesService, $stateParams) {
    console.log("inside versions controller!");
    $scope.project = $stateParams.project;
    $scope.versions = [];
    EasyNotesService.getVersions($scope.project, function (data) {
        console.log("retrieving versions...");
        //console.log(data.versions);
        $scope.versions = data.versions;
    });
});

eazyNotes.controller("NotesController", function ($scope, EasyNotesService, $stateParams, $sce) {
    console.log("inside notes controller!");
    $scope.project = $stateParams.project;
    $scope.version = $stateParams.version;
    $scope.versions = [];
    EasyNotesService.getNotes($scope.project, $scope.version, function (data) {
        console.log("retrieving notes...");
        //console.log(data.issues);
        $scope.issues = data.issues;
        $scope.content = $sce.trustAsHtml(data.content);
    });

    $scope.update = function (notes) {
        EasyNotesService.update(notes, function (data, status, headers, config) {
            console.log("notes updated successfully.");
        });
    };
});

eazyNotes.directive("editable", function () {
    var config = {
        replace: true,
        transclude: false,
        restrict: 'A',
        link: function (scope, element, attrs) {
            Aloha.ready(function () {
                var $ = Aloha.jQuery;
                $(element).aloha();
                Aloha.require(['aloha', 'aloha/jquery'], function (Aloha, jQuery) {
                    Aloha.bind('aloha-editable-deactivated', function () {
                        var $ = jQuery;
                        var content = Aloha.activeEditable.getContents();
                        var contentId = Aloha.activeEditable.obj[0].id;
                        var pageId = window.location.pathname;
                        var project = $("#project").val();
                        var version = $("#version").val();

                        // textarea handling -- html id is "xy" and
                        // will be "xy-aloha" for the aloha editable
                        if (contentId.match(/-aloha$/gi)) {
                            contentId = contentId.replace(/-aloha/gi, '');
                        }

                        scope.update({
                            content: content,
                            contentId: contentId,
                            pageId: pageId,
                            project: project,
                            version: version
                        });
                    });
                });
            });
        }
    };

    return config;
});

eazyNotes.directive("navbuttons", function () {
    var config = {
        replace: true,
        transclude: false,
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).children().click(function (){
                var curSelected = $(element).find(".active");
                $(curSelected).removeClass("active");
                $(this).addClass("active");
            });
        }
    };

    return config;
});