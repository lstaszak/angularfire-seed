(function (angular) {
  "use strict";
  var securedRoutes = [];
  var app = angular.module('myApp.security', ['ngRoute', 'firebase.auth', 'myApp.config']);
  app.config(['$routeProvider', function ($routeProvider) {
    //$routeProvider.otherwise({redirectTo: '/login'});
  }]);
  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.whenAuthenticated = function (path, route) {
      securedRoutes.push(path); // store all secured routes for use with authRequired() below
      route.resolve = route.resolve || {};
      route.resolve.user = ['Auth', function (Auth) {
        return Auth.$requireAuth();
      }];
      $routeProvider.when(path, route);
      console.log(securedRoutes);
    }
  }]);
  app.run(['$rootScope', '$location', 'Auth', 'loginRedirectPath', function ($rootScope, $location, Auth, loginRedirectPath) {
    Auth.$onAuth(check);
    $rootScope.$on("$routeChangeError", function (e, next, prev, err) {
      if (err === "AUTH_REQUIRED") {
        console.log(err);
        $location.path(loginRedirectPath);
      }
    });
    function check(user) {
      if (!user && authRequired($location.path())) {
        console.log('check failed', user, $location.path());
        $location.path(loginRedirectPath);
      }
    }

    function authRequired(path) {
      console.log('authRequired?', path, securedRoutes.indexOf(path));
      return securedRoutes.indexOf(path) !== -1;
    }
  }]);
})(angular);
