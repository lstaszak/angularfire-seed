'use strict';
var app = angular.module('myApp');
app.directive('appVersion', ['version', function (version) {
  return function (scope, elm) {
    elm.text(version);
  };
}]);
