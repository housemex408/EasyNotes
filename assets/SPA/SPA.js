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