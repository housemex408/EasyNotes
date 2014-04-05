var eazyNotes = angular.module('EazyNotes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('projects', {
                url: '/',
                templateUrl: 'spa/pages/projects.html',
                controller: 'ProjectsController'
            })
            .state('versions', {
                url: '/:project',
                templateUrl: 'spa/pages/versions.html',
                controller: 'VersionsController'
            })
            .state('notes', {
                url: '/:project/:version',
                templateUrl: 'spa/pages/notes.html',
                controller: 'NotesController'
            });

        $urlRouterProvider.otherwise('/');
    }]);



//https://github.com/angular-ui/ui-router
//https://egghead.io/lessons/angularjs-introduction-ui-router
//https://github.com/angular-ui/ui-router/wiki/URL-Routing

eazyNotes.factory('EasyNotesService', function ($http) {
    var EasyNotesService = function(data) {
        angular.extend(this, data);
    };

    EasyNotesService.getProjects = function(successCallback) {
        return $http.get('api/projects')
            .then(function(response) {
                successCallback(response.data);
                return new EasyNotesService(response.data);
            });
    };

    EasyNotesService.getVersions = function(project, successCallback) {
        return $http.get('api/' + project + '/versions')
            .then(function(response) {
                successCallback(response.data);
                return new EasyNotesService(response.data);
            });
    };

    EasyNotesService.getNotes = function(project, version, successCallback) {
        return $http.get('api/' + project + '/' + version)
            .then(function(response) {
                successCallback(response.data);
                return new EasyNotesService(response.data);
            });
    };

    return EasyNotesService;
});

eazyNotes.controller("ProjectsController", function ($scope, EasyNotesService, $location) {
    console.log("inside projects controller!");
    $scope.projects = [];
    EasyNotesService.getProjects(function(data)
    {
        console.log("retrieving projects...");
        //console.log(data);
        $scope.projects =  data.projects;
    });
});

eazyNotes.controller("VersionsController", function ($scope, EasyNotesService, $stateParams) {
    console.log("inside versions controller!");
    $scope.project = $stateParams.project;
    $scope.versions = [];
    EasyNotesService.getVersions($scope.project, function(data)
    {
        console.log("retrieving versions...");
        //console.log(data.versions);
        $scope.versions =  data.versions;
    });
});

eazyNotes.controller("NotesController", function ($scope, EasyNotesService, $stateParams, $sce) {
    console.log("inside notes controller!");
    $scope.project = $stateParams.project;
    $scope.version = $stateParams.version;
    $scope.versions = [];
    EasyNotesService.getNotes($scope.project, $scope.version, function(data)
    {
        console.log("retrieving notes...");
        //console.log(data.issues);
        $scope.issues =  data.issues;
        $scope.content = $sce.trustAsHtml(data.content);
    });
});

eazyNotes.directive("editable", function() {
    var config = {
        replace: true,
        transclude: false,
        restrict: 'A',
        link: function(scope, element, attrs) {
            Aloha.ready( function() {
                var $ = Aloha.jQuery;
                $(element).aloha();

                Aloha.require( ['aloha', 'aloha/jquery'], function( Aloha, jQuery) {

                    // save all changes after leaving an editable
                    Aloha.bind('aloha-editable-deactivated', function(){
                        var content = Aloha.activeEditable.getContents();
                        var contentId = Aloha.activeEditable.obj[0].id;
                        var pageId = window.location.pathname;
                        var project = jQuery("#project").val();
                        var version = jQuery("#version").val();

                        // textarea handling -- html id is "xy" and will be "xy-aloha" for the aloha editable
                        if ( contentId.match(/-aloha$/gi) ) {
                            contentId = contentId.replace( /-aloha/gi, '' );
                        }
                        console.log("saving aloha content");
                        console.log(content);
                        console.log(project);
                        console.log(version);
                        var request = jQuery.ajax({
                            url: "/api/" + project + "/" + version + "/update",
                            type: "POST",
                            data: {
                                content : content,
                                contentId : contentId,
                                pageId : pageId,
                                project: project,
                                version: version
                            },
                            dataType: "html"
                        });

                        request.done(function(msg) {
                            jQuery("#log").html( msg ).show().delay(800).fadeOut();
                        });

                        request.error(function(jqXHR, textStatus) {
                            alert( "Request failed: " + textStatus );
                        });
                    });
                });
            });
        }
    };

    return config;
});