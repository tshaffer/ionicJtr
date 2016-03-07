angular.module('jtr.controllers', [])

.controller('RecordNowCtrl', function($scope) {
})

.controller('SettingsCtrl', function($scope) {
})

.controller('ChatsCtrl', function($scope, Chats, jtrServerService) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  console.log("get all chats");

  //var getJtrRecordingsPromise = jtrServerService.getRecordings();
  //getJtrRecordingsPromise.then(function (result) {
  //  console.log("getRecordings success");
  //  $scope.recordings = result.data.recordings;
  //}, function(reason) {
  //  console.log(reason);
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
