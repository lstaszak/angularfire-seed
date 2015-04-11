'use strict';
var app = angular.module('myApp', ['myApp.config', 'myApp.security', 'myApp.home', 'myApp.account', 'myApp.chat', 'myApp.login', 'ui.router']);
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'app/home/home.html',
    controller: 'HomeCtrl',
    resolve: {
      user: ['Auth', function (Auth) {
        return Auth.$waitForAuth();
      }]
    }
  });
}]);
app.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('home', {
    url: 'home',
    views: {
      '': {
        template: 'Look I am a empty column!'
      },
      'home': {
        templateUrl: 'app/home/homex.html',
        controller:function($scope) {
          $scope.test = 2;
        }
      },
      'contact': {
        template: 'Look I am a home 2 column!'
      }
    }
  });
  $stateProvider.state('contact', {
    url: 'home',
    views: {
      '': {
        template: 'Look I am a empty column!'
      },
      'home': {
        template: 'Look I am a contact 1 column!'
      },
      'contact': {
        template: 'Look I am a contact 2 column!'
      }
    }
  });
}]);
app.run(['$rootScope', 'Auth', function ($rootScope, Auth) {
  Auth.$onAuth(function (user) {
    $rootScope.loggedIn = !!user;
  });
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    console.log(fromState);
    console.log(toState);
  });
}]);
