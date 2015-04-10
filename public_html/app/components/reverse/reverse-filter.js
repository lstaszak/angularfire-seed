'use strict';
var app = angular.module('myApp');
app.filter('reverse', function () {
  return function (items) {
    return items.slice().reverse();
  };
});
