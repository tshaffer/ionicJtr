/**
 * Created by tedshaffer on 2/26/16.
 */
angular.module('jtr.controllers')

.controller('RecordingDetailCtrl', function($location, $rootScope, $scope, $stateParams, jtrServerService) {

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
    };
  
    $scope.recording = jtrServerService.getRecording($stateParams.recordingId);

    if (!($rootScope.playbackActive && $rootScope.playbackActiveRecordingId == $stateParams.recordingId)) {
      $scope.playRecordedShow($scope.recording);
    }
  })

