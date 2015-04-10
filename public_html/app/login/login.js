"use strict";
var app = angular.module('myApp.login', ['firebase.utils', 'firebase.auth', 'ngRoute']);
app.controller('LoginCtrl', ['$scope', 'Auth', '$location', 'fbutil', '$firebaseObject', function ($scope, Auth, $location, fbutil, $firebaseObject) {
  $scope.email = null;
  $scope.pass = null;
  $scope.confirm = null;
  $scope.createMode = false;
  $scope.login = function (email, pass) {
    $scope.err = null;
    Auth.$authWithPassword({ email: email, password: pass }, {rememberMe: true}).then(function (user) {
      var ref = fbutil.ref('users', user.uid);
      var profile = $firebaseObject(ref);
      profile.is_online = 1;
      profile.$save().then(function (ref) {
        if (ref.key() === profile.$id) {
          $location.path('/account');
        }
        console.log('logout success');
      }, function (error) {
        console.log('logout error');
      });
    }, function (err) {
      $scope.err = errMessage(err);
    });
  };
  $scope.createAccount = function () {
    $scope.err = null;
    if (assertValidAccountProps()) {
      var email = $scope.email;
      var pass = $scope.pass;
      // create user credentials in Firebase auth system
      Auth.$createUser({email: email, password: pass}).then(function () {
        // authenticate so we have permission to write to Firebase
        return Auth.$authWithPassword({ email: email, password: pass });
      }).then(function (user) {
        // create a user profile in our data store
        var ref = fbutil.ref('users', user.uid);
        return fbutil.handler(function (cb) {
          ref.set({email: email, name: name || firstPartOfEmail(email), status: 'new', is_online: 0}, cb);
        });
      }).then(function (/* user */) {
        // redirect to the account page
        $location.path('/account');
      }, function (err) {
        $scope.err = errMessage(err);
      });
    }
  };
  function assertValidAccountProps() {
    if (!$scope.email) {
      $scope.err = 'Please enter an email address';
    } else if (!$scope.pass || !$scope.confirm) {
      $scope.err = 'Please enter a password';
    } else if ($scope.createMode && $scope.pass !== $scope.confirm) {
      $scope.err = 'Passwords do not match';
    }
    return !$scope.err;
  }

  function errMessage(err) {
    return angular.isObject(err) && err.code ? err.code : err + '';
  }

  function firstPartOfEmail(email) {
    return ucfirst(email.substr(0, email.indexOf('@')) || '');
  }

  function ucfirst(str) {
    // inspired by: http://kevin.vanzonneveld.net
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
  }
}]);
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/login', {
    controller: 'LoginCtrl',
    templateUrl: 'login/login.html'
  });
}]);
