(function (angular) {
  "use strict";
  var app = angular.module('myApp.chat', ['ngRoute', 'firebase.utils', 'firebase']);
  app.controller('ChatCtrl', ['$scope', 'messageList', 'fbutil', 'user', '$firebaseObject', function ($scope, messageList, fbutil, user, $firebaseObject) {
    var unbindUsers;
    var unbindProfile;
    var profile = $firebaseObject(fbutil.ref('users', user.uid));
    var users = $firebaseObject(fbutil.ref('users'));
    users.$loaded().then(function () {
      console.log("loaded record:", users.$id);
      // To iterate the key/value pairs of the object, use angular.forEach()
      angular.forEach(users, function (value, key) {
        console.log(key, value);
      });
    });
    users.$bindTo($scope, 'users').then(function (ub) {
      unbindUsers = ub;
    });
    profile.$bindTo($scope, 'profile').then(function (ub) {
      unbindProfile = ub;
    });
    $scope.messages = messageList;
    $scope.addMessage = addMessage;
    $("#new-message").on('keypress', function (event) {
      var code = event.keyCode || event.which;
      if (code === 13) {
        addMessage();
      }
    });
    function addMessage() {
      var newMessage = $scope.newMessage;
      if (newMessage) {
        $scope.messages.$add({user_id: profile.$id, name: profile.name, status: profile.status, text: newMessage});
        $scope.newMessage = '';
      }
    };
  }]);
  app.factory('messageList', ['fbutil', '$firebaseArray', function (fbutil, $firebaseArray) {
    var ref = fbutil.ref('messages').limitToLast(10);
    return $firebaseArray(ref);
  }]);
  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.whenAuthenticated('/chat', {
      templateUrl: 'chat/chat.html',
      controller: 'ChatCtrl'
    });
  }]);
})(angular);
