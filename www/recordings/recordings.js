/**
 * Created by tedshaffer on 2/26/16.
 */
angular.module('jtr.controllers')

.controller('RecordingsCtrl', function($rootScope, $scope, $location, jtrServerService, jtrStationsService, jtrSettingsService) {

  $scope.invokeNowPlaying = function() {
    console.log("invokeNowPlaying");
    var recordingId = $rootScope.playbackActiveRecordingId;
    $location.path("/tab/recordings/" + recordingId.toString());
  }

  $scope.playRecordedShow = function(recording) {
    console.log("playRecordedShow invoked");
    console.log(recording);
  }

  $scope.deleteRecordedShow = function(recording) {
    console.log("deleteRecordedShow");
    console.log(recording);
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

