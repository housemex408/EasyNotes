// State example:
//
// $stateProvider     
//   .state('state', {
//     url: 'state/:id',
//     template: stateTemplate,
//     controller: stateController,
//     // Expose parameters in display names using {:param} syntax
//     displayName: 'State ({:id})'
//   });
 
// Create Breadcrumb module
angular.module('Breadcrumb', [])
  // Controller for module
  .controller('BreadcrumbsCtrl', function($scope, $state, $stateParams) {
    $scope.$on('$stateChangeSuccess', function(){
      // Add the current state and params to the scope
      $scope.current = $state.$current;
      $scope.params = $stateParams;
    });
  })
  // Create view
  .directive('breadcrumbs', function(){
    return {
      // NOTE - you probably shouldn't have templates in your JS
      // This is just to simplify this example
      template: [
        '<ul class="breadcrumbs">',
          '<li ng-repeat="state in current.path">',
            '<a href="{{ state.url.format(params) }}" ui-sref="{{ state.name }}" crumb></a>',
          '</li>',
        '</ul>'
      ].join('')
    };
  })
  .directive('crumb', function(){
    return {
      // Inherit parent scope
      scope: true,
      template: '{{ name }}',
      // Use the link function to do any special voodoo
      link: function (scope, element, attrs) {
        var getDisplayName = function(){
          // Use displayName if provided else use default name property
          var displayName = scope.state.displayName || scope.state.name;
 
          // Loop through ownParams and replace any expressions with the matching value
          angular.forEach(scope.state.ownParams, function(param, index){
            displayName = displayName.replace('{:' + param + '}', scope.params[param]);
          });
 
          return displayName;
        };
 
        scope.name = getDisplayName();
      }
    };
  });