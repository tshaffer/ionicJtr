/**
 * Created by tedshaffer on 2/26/16.
 */
angular.module('jtr.controllers')

.controller('RecordingDetailCtrl', function($location, $rootScope, $scope, $stateParams, jtrServerService) {

  $scope.trickModes = [

    //{ command: "record", font: "ion-record" },
    { command: "stop", font: "ion-ios-stop" },
    { command: "rewind", font: "ion-ios-rewind" },
    { command: "instantReplay", font: "ion-ios-skipbackward" },
    { command: "pause", font: "ion-ios-pause" },
    { command: "play", font: "ion-ios-play" },
    { command: "quickSkip", font: "ion-ios-skipforward" },
    { command: "fastForward", font: "ion-ios-fastforward" },
    { command: "progress_bar", font: "ion-ios-help" }
  ];

  $scope.invokeTrickMode = function(trickMode) {
    console.log("trickMode invoked: " + trickMode);

    if (trickMode == "play" && !playbackCommenced) {
      $scope.playRecordedShow($scope.recording);
    }
    else {
      var commandData = {
        "command": trickMode
      };

      var commandData = {"command": "remoteCommand", "value": trickMode};
      var promise = jtrServerService.browserCommand(commandData);
      promise.then(function () {
        console.log("browserCommand successfully sent");
      })
    }

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
        $rootScope.playbackActive = true;
        $rootScope.playbackActiveRecordingId = recording.RecordingId;
      })

      playbackCommenced = true;

    };

    var playbackCommenced = false;

    $scope.recording = jtrServerService.getRecording($stateParams.recordingId);

    if (!($rootScope.playbackActive && $rootScope.playbackActiveRecordingId == $stateParams.recordingId) && $rootScope.playRecordedShow) {
      $scope.playRecordedShow($scope.recording);
    }
  })

