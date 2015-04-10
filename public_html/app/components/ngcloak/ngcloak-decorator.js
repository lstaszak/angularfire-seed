var app = angular.module('myApp');
app.config(['$provide', function ($provide) {
  $provide.decorator('ngCloakDirective', ['$delegate', 'Auth', function ($delegate, Auth) {
    var directive = $delegate[0];
    var _compile = directive.compile;
    directive.compile = function (element, attr) {
      Auth.$waitForAuth().then(function (a) {
        _compile.call(directive, element, attr);
      });
    };
    return $delegate;
  }]);
}]);
