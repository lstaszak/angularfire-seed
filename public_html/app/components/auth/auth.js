var app = angular.module('firebase.auth', ['firebase', 'firebase.utils']);
app.factory('Auth', ['$firebaseAuth', 'fbutil', function ($firebaseAuth, fbutil) {
  return $firebaseAuth(fbutil.ref());
}]);
