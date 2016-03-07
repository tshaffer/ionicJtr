/**
 * Created by tedshaffer on 2/26/16.
 */
angular.module('jtr.controllers')

.controller('RecordingsCtrl', function($rootScope, $scope, $location, jtrServerService, jtrStationsService, jtrSettingsService) {

  $scope.invokeNowPlaying = function() {
    console.log("invokeNowPlaying");
    var recordingId = $rootScope.playbackActiveRecordingId;
    $rootScope.playRecordedShow = true;
    $location.path("/tab/recordings/" + recordingId.toString());
  }

  $scope.playRecordedShow = function(recording) {
    console.log("playRecordedShow invoked");
    $rootScope.playRecordedShow = true;
    $location.path("/tab/recordings/" + recording.RecordingId.toString());
  }

  $scope.showRecordedShow = function(recording) {
    console.log("showRecordedShow invoked");
    $rootScope.playRecordedShow = false;
    $location.path("/tab/recordings/" + recording.RecordingId.toString());
  };

  $scope.deleteRecordedShow = function(recording) {

    var recordingId = recording.RecordingId;

    console.log("deleteRecordedShow: " + recordingId);
    var commandData = {"command": "deleteRecordedShow", "recordingId": recordingId};
    var promise = jtrServerService.browserCommand(commandData);
    promise.then(function () {
      console.log("browserCommand successfully sent");
      $scope.show();
    })
  }

  $scope.doRefresh = function() {
    console.log("start refresh");
    $scope.show();
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

  $rootScope.playbackActive = false;

  var getStationsPromise = jtrStationsService.getStations();
  var getSettingsPromise = jtrSettingsService.getSettings();

  Promise.all([getStationsPromise, getSettingsPromise]).then(function () {
    $scope.show();
  });
})

