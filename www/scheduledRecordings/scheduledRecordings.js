/**
 * Created by tedshaffer on 3/1/16.
 */
angular.module('jtr.controllers')

.controller('ScheduledRecordingsCtrl', function($rootScope, $scope, $location, jtrServerService, jtrStationsService) {

  $scope.invokeNowPlaying = function() {
    console.log("invokeNowPlaying");
    var recordingId = $rootScope.playbackActiveRecordingId;
    $location.path("/tab/recordings/" + recordingId.toString());
  }

  $scope.invokeScheduledRecordingAction = function(action, recordingId) {

    var promise;

    if (action == "stop") {
      promise = jtrServerService.stopActiveRecording(recordingId);
    }
    else if (action == "delete") {
      promise = jtrServerService.deleteScheduledRecording(recordingId);
    }

    promise.then(function() {
      $scope.show();
    });
  }

  $scope.show = function() {

    var currentDateTimeIso = new Date().toISOString();
    var currentDateTime = {"currentDateTime": currentDateTimeIso};

    promise = jtrServerService.getScheduledRecordings(currentDateTime);
    promise.then(function (result) {
      console.log("getScheduledRecordings success");

      // scheduledRecordings are in result.data?
      console.log("number of scheduled recordings is: " + result.data.length);

      $scope.scheduledRecordings = [];

      for (var i = 0; i < result.data.length; i++) {

        var jtrScheduledRecording = result.data[i];

        scheduledRecording = {};
        scheduledRecording.dateTime = jtrScheduledRecording.DateTime;
        scheduledRecording.duration = jtrScheduledRecording.Duration;
        scheduledRecording.endDateTime = jtrScheduledRecording.EndDateTime;
        scheduledRecording.recordingId = jtrScheduledRecording.Id;
        scheduledRecording.inputSource = jtrScheduledRecording.InputSource;
        scheduledRecording.recordingBitRate = jtrScheduledRecording.RecordingBitRate;
        scheduledRecording.scheduledSeriesRecordingId = jtrScheduledRecording.ScheduledSeriesRecordingId;
        scheduledRecording.segmentRecording = jtrScheduledRecording.SegmentRecording;
        scheduledRecording.startTimeOffset = jtrScheduledRecording.StartTimeOffset;
        scheduledRecording.startTimeOffset = jtrScheduledRecording.StopTimeOffset;
        scheduledRecording.title = jtrScheduledRecording.Title;
        scheduledRecording.channel = jtrScheduledRecording.Channel;

        // unable to create a filter for this due to failure to properly interpolate - weird issue - try again later.
        var currentDateTime = new Date();
        var date = new Date(scheduledRecording.dateTime);
        var endDateTime = new Date(scheduledRecording.endDateTime);
        var clickAction = "delete";
        if (date <= currentDateTime && currentDateTime < endDateTime) {
          clickAction = "stop";
        }
        scheduledRecording.action = clickAction;

        // unable to create a filter due to jtrStationsService - try again later.
        var channelParts = scheduledRecording.channel.split('-');
        var station = jtrStationsService.getStationFromAtsc(channelParts[0], channelParts[1]);
        var stationName = "TBD";
        if (station != null) {
          stationName = station.CommonName;
        }
        scheduledRecording.stationName = stationName;

        $scope.scheduledRecordings.push(scheduledRecording);
      }

      return;
    }, function (reason) {
      console.log("getRecordings failure");
    });
  };

  $scope.name = 'Scheduled Recordings';
  console.log($scope.name + " screen displayed");

  $scope.show();
})
