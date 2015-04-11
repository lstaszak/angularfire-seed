(function (angular) {
  "use strict";
  var app = angular.module('myApp.account', ['firebase', 'firebase.utils', 'firebase.auth', 'ngRoute', 'geoLocation']);
  app.controller('AccountCtrl', ['$scope', 'Auth', 'fbutil', 'user', '$location', '$firebaseObject', '$firebaseUtils', 'geoPosition', '$q', function ($scope, Auth, fbutil, user, $location, $firebaseObject, $firebaseUtils, geoPosition, $q) {
    geoPosition.init();
    var infowindow = new google.maps.InfoWindow();
    var unbind;
    var unbind_gh;
    var geo_history;
    var profile;
    fbutil.ref('geo_history', user.uid).orderByChild("timestamp").limitToLast(2).on('value', function (snapshot) {
      //console.log(snapshot.val());
      angular.forEach(snapshot.val(), function (value, key) {
        //console.log(value);
      });
      //console.log(Firebase.ServerValue.TIMESTAMP);
    });
    geo_history = $firebaseObject(fbutil.ref('geo_history', user.uid));
    geo_history.$bindTo($scope, 'geo_history').then(function (ub) {
      unbind_gh = ub;
    });
    geo_history.$loaded().then(function () {
      angular.forEach(geo_history, function (value, key) {
        //console.log(value.latitude);
        //console.log(value.longitude);
      });
    });
    var profile = $firebaseObject(fbutil.ref('users', user.uid));
    profile.$bindTo($scope, 'profile').then(function (ub) {
      unbind = ub;
    });
    function asyncGreet() {
      var deferred = $q.defer();
      if (geoPosition.init()) {
        geoPosition.getCurrentPosition(function (p) {
          var ref = fbutil.ref('geo_history', user.uid);
          ref.push({ 'latitude': p.coords.latitude, 'longitude': p.coords.longitude, 'timestamp': Firebase.ServerValue.TIMESTAMP }, function () {
          });
          $scope.$apply(function () {
            $scope.latitude = p.coords.latitude;
            $scope.longitude = p.coords.longitude;
          });
          geoPosition.showPosition(p);
          deferred.resolve(p);
        }, function () {
          deferred.reject('');
        }, {enableHighAccuracy: true});
      }
      return deferred.promise;
    }

    function asyncCodeLatLng(p) {
      var deferred = $q.defer();
      var city = ''
      if (city = geoPosition.codeLatLng(p)) {
        deferred.resolve(city);
      } else {
        deferred.reject('');
      }
      return deferred.promise;
    }

    profile.$loaded().then(function () {
      var promise = asyncGreet();
      promise.then(function (a) {
        console.log('Success');
      }, function (a) {
        console.log('Failed');
      }, function (a) {
        console.log('Got notification');
      });
      geo_history.$loaded().then(function () {
        angular.forEach(geo_history, function (value, key) {
          var pos = {};
          pos.coords = {};
          pos.coords.latitude = value.latitude;
          pos.coords.longitude = value.longitude;
        });
      });
    });
    $scope.logout = function () {
      var promise = asyncGreet();
      promise.then(function (a) {
        console.log('Success');
      }, function (a) {
        console.log('Failed');
      }, function (a) {
        console.log('Got notification');
      });
      //      var ref = fbutil.ref('users', user.uid);
      //      ref.update({ is_online: 0});
      //      if (unbind) {
      //        unbind();
      //      }
      //      profile.$destroy();
      //      Auth.$unauth();
      //      $location.path('/login');
    };
    $scope.changePassword = function (password, confirmPassword, newPassword) {
      resetMessages();
      if (!password || !confirmPassword || !newPassword) {
        $scope.changePasswordError = 'Please fill in all password fields';
      } else if (newPassword !== confirmPassword) {
        $scope.changePasswordError = 'New pass and confirm do not match';
      } else {
        Auth.$changePassword({email: profile.email, oldPassword: password, newPassword: newPassword}).then(function () {
          $scope.changePasswordMsg = 'Password changed';
        }, function (err) {
          $scope.changePasswordError = err;
        })
      }
    };
    $scope.clear = resetMessages;
    $scope.changeEmailAddress = function (newEmailAddress, password) {
      resetMessages();
      var oldEmailAddress = profile.email;
      if (!newEmailAddress || !password) {
        $scope.changeEmailAddressError = 'Please fill in all password fields';
      } else {
        Auth.$changeEmail({oldEmail: oldEmailAddress, newEmail: newEmailAddress, password: password}).then(function () {
          return fbutil.handler(function (done) {
            fbutil.ref('users', user.uid, 'email').set(newEmailAddress, done);
          });
        }).then(function () {
          $scope.changeEmailAddressMsg = 'e-mail address changed';
        }, function (err) {
          $scope.changeEmailAddressError = err;
        });
      }
    };
    function resetMessages() {
      $scope.changePasswordMsg = null;
      $scope.changePasswordError = null;
      $scope.changeEmailAddressMsg = null;
      $scope.changeEmailAddressError = null;
    }
  }
  ]);
  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.whenAuthenticated('/account', {
      templateUrl: 'app/account/account.html',
      controller: 'AccountCtrl'
    })
  }]);
})(angular);
