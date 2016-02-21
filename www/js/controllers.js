angular.module('jtr.controllers', [])

.controller('footer', function($scope, jtrServerService) {

  console.log("footer controller initialization");

  $scope.trickModes = [

    { command: "record", font: "ion-record" },
    { command: "stop", font: "ion-ios-stop" },
    { command: "rewind", font: "ion-ios-rewind" },
    { command: "instantReplay", font: "ion-ios-skipbackward" },
    { command: "pause", font: "ion-ios-pause" },
    { command: "play", font: "ion-ios-play" },
    { command: "quickSkip", font: "ion-ios-skipforward" },
    { command: "fastForward", font: "ion-ios-fastforward" }
  ];

  $scope.invokeTrickMode = function(trickMode) {
    console.log("trickMode invoked: " + trickMode);

    var commandData = {
      "command": trickMode
    };

    var commandData = {"command": "remoteCommand", "value": trickMode};
    var promise = jtrServerService.browserCommand(commandData);
    promise.then(function () {
      console.log("browserCommand successfully sent");
    })
  };

})

.controller('RecordingsCtrl', function($scope, jtrServerService) {

  $scope.doRefresh = function() {
    console.log("start refresh");
    $scope.show();
  };

  $scope.playRecordedShow = function(recording) {
    console.log("controller.js::Play recording: " + recording.Title);

    var commandData;

    var storedRecording = {
      recordingId: recording.RecordingId,
      relativeUrl: recording.relativeurl,
      storageLocation: recording.storagelocation,
      storageDevice: recording.storagedevice
    };

    commandData = {"command": "playRecordedShow", "storedRecording": storedRecording };

    var promise = jtrServerService.browserCommand(commandData);
    promise.then(function () {
      console.log("browserCommand successfully sent");
    })
  };

  $scope.show = function() {
    console.log("invoke getRecordings");
    var getJtrRecordingsPromise = jtrServerService.getRecordings();
    getJtrRecordingsPromise.then(function (result) {
      console.log("getRecordings success");
      $scope.recordings = result.data.recordings;
      jtrServerService.setRecordings($scope.recordings);
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.show();
})

.controller('RecordingDetailCtrl', function($scope, $stateParams, jtrServerService) {

  $scope.recording = jtrServerService.getRecording($stateParams.recordingId);
})


.controller('ChannelGuideCtrl', function($scope) {
})

.controller('ScheduledRecordingsCtrl', function($scope) {
})

.controller('ManualRecordCtrl', function($scope) {

  $scope.inputSource = "tuner";
  $scope.title = "Test 0";
  $scope.duration = 1;
  $scope.date = new Date();
  $scope.time = new Date();
  $scope.time.setSeconds(0);
  $scope.channel = 5;

  $scope.timeHours = $scope.time.getHours().toString();
  $scope.timeMinutes = $scope.time.getMinutes().toString();
  if ($scope.timeMinutes.length == 1) {
    $scope.timeMinutes = "0" + $scope.timeMinutes;
  }
  $scope.timeAMPM = "AM";

  $scope.showTimeDlg = function() {
    console.log("showTimeDlg invoked");

    var options = {
      date: new Date(),
      mode: 'time'
    };

    function onSuccess(date) {
      //alert('Selected date: ' + date);
      console.log("Hours=" + date.getHours());
      console.log("Minutes=" + date.getMinutes());
      $scope.time.setHours(date.getHours());
      $scope.time.setMinutes(date.getMinutes());

      $scope.$apply(function() {
        if (date.getHours() >= 12) {
          $scope.timeHours = (date.getHours() - 12).toString();
          if ($scope.timeHours == 0) {
            $scope.timeHours = "12";
          }
          $scope.timeAMPM = "PM";
        }
        else {
          $scope.timeAMPM = "AM";
        }
        $scope.timeMinutes = $scope.time.getMinutes().toString();
        if ($scope.timeMinutes.length == 1) {
          $scope.timeMinutes = "0" + $scope.timeMinutes;
        }
      });

      console.log("scope time is: " + $scope.time);
      console.log($scope.timeHours.toString() + ":" + $scope.timeMinutes.toString() + " " + $scope.timeAMPM);
    }

    function onError(error) { // Android only
      alert('Error: ' + error);
    }

    datePicker.show(options, onSuccess, onError);
  }
})

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
