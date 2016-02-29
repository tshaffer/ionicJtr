/**
 * Created by tedshaffer on 2/26/16.
 */
angular.module('jtr.controllers')

.controller('RecordingsCtrl', function($scope, jtrServerService, jtrStationsService, jtrSettingsService) {

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

  var getStationsPromise = jtrStationsService.getStations();
  var getSettingsPromise = jtrSettingsService.getSettings();

  Promise.all([getStationsPromise, getSettingsPromise]).then(function () {
    $scope.show();
  });
})

