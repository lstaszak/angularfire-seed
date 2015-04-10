'use strict';
var app = angular.module('myApp.config', []);
app.constant('version', '1.0.0');
app.constant('loginRedirectPath', '/login');
app.constant('FBURL', 'https://beelab.firebaseio.com');
app.run(['FBURL', '$timeout', function (FBURL, $timeout) {
  if (FBURL.match('//INSTANCE.firebaseio.com')) {
    angular.element(document.body).html('<h1>Please configure app/config.js before running!</h1>');
    $timeout(function () {
      angular.element(document.body).removeClass('hide');
    }, 250);
  }
}]);

