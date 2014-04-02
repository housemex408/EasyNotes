var eazyNotes = angular.module('EazyNotes', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/notes', {
                templateUrl: 'spa/pages/notes.html',
                controller: 'NotesController'
            }).
            when('/versions', {
                templateUrl: 'spa/pages/projectVersions.html',
                controller: 'VersionsController'
            }).
            when('/', {
                templateUrl: 'spa/pages/projects.html',
                controller: 'ProjectsController'
            }).
            otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    }]);

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

eazyNotes.controller("HomeController", function ($scope, $location) {
    console.log("inside home controller!");

    $scope.title = "Welcome!"

    $scope.ViewProjects = function () {

        $location.path("/projects");
    }
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

eazyNotes.controller("VersionsController", function ($scope, EasyNotesService, $location, $routeParams) {
    console.log("inside versions controller!");
    $scope.project = $routeParams.project;
    $scope.versions = [];
    EasyNotesService.getVersions($scope.project, function(data)
    {
        console.log("retrieving versions...");
        //console.log(data.versions);
        $scope.versions =  data.versions;
    });
});

eazyNotes.controller("NotesController", function ($scope, EasyNotesService, $location, $routeParams, $sce) {
    console.log("inside notes controller!");
    $scope.project = $routeParams.project;
    $scope.version = $routeParams.version;
    $scope.versions = [];
    EasyNotesService.getNotes($scope.project, $scope.version, function(data)
    {
        console.log("retrieving notes...");
        console.log(data.issues);
        $scope.issues =  data.issues;
        $scope.content = $sce.trustAsHtml(data.content);
    });
});