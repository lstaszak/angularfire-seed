'use strict';
var app = angular.module('myApp', ['myApp.config', 'myApp.security', 'myApp.home', 'myApp.account', 'myApp.chat', 'myApp.login']);
app.run(['$rootScope', 'Auth', function ($rootScope, Auth) {
  Auth.$onAuth(function (user) {
    $rootScope.loggedIn = !!user;
  });
}]);
