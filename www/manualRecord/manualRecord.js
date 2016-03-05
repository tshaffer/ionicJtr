/**
 * Created by tedshaffer on 2/26/16.
 */
angular.module('jtr.controllers')

.controller('ManualRecordCtrl', function($rootScope, $scope, $location, jtrServerService) {

  $scope.invokeNowPlaying = function() {
    console.log("invokeNowPlaying");
    var recordingId = $rootScope.playbackActiveRecordingId;
    $location.path("/tab/recordings/" + recordingId.toString());
  }


  $scope.inputSource = "tuner";
    $scope.title = "Test 0";
    $scope.duration = 1;
    $scope.date = new Date();
    $scope.time = new Date();
    $scope.time.setSeconds(0);
    $scope.channel = 5;

    if ($scope.time.getHours() >= 12) {
      $scope.timeHours = ($scope.time.getHours() - 12).toString();
      if ($scope.timeHours == 0) {
        $scope.timeHours = "12";
      }
      $scope.timeAMPM = "PM";
    }
    else {
      $scope.timeHours = $scope.time.getHours().toString();
      $scope.timeAMPM = "AM";
    }
    $scope.timeMinutes = $scope.time.getMinutes().toString();
    if ($scope.timeMinutes.length == 1) {
      $scope.timeMinutes = "0" + $scope.timeMinutes;
    }

    $scope.showTimeDlg = function() {
      console.log("showTimeDlg invoked");

      var options = {
        date: new Date(),
        mode: 'time'
      };

      function onSuccess(date) {
        console.log("Hours=" + date.getHours());
        console.log("Minutes=" + date.getMinutes());
        $scope.time.setHours(date.getHours());
        $scope.time.setMinutes(date.getMinutes());
        console.log("scope time is: " + $scope.time);

        $scope.$apply(function() {
          if (date.getHours() >= 12) {
            $scope.timeHours = (date.getHours() - 12).toString();
            if ($scope.timeHours == 0) {
              $scope.timeHours = "12";
            }
            $scope.timeAMPM = "PM";
          }
          else {
            $scope.timeHours = date.getHours().toString();
            $scope.timeAMPM = "AM";
          }
          $scope.timeMinutes = $scope.time.getMinutes().toString();
          if ($scope.timeMinutes.length == 1) {
            $scope.timeMinutes = "0" + $scope.timeMinutes;
          }

          console.log("inside of $apply");
          console.log("scope time is: " + $scope.time);
          console.log($scope.timeHours.toString() + ":" + $scope.timeMinutes.toString() + " " + $scope.timeAMPM);
        });
      }

      function onError(error) { // Android only
        alert('Error: ' + error);
      }

      datePicker.show(options, onSuccess, onError);
    }

    $scope.invokeManualRecord = function() {

      console.log("invokeManualRecord");
      console.log("Title: " + this.title);
      console.log("Duration: " + this.duration);
      console.log("Date: " + this.date);
      console.log("Time: " + this.time);
      console.log("Input source: " + this.inputSource);
      console.log("Channel: " + this.channel);

      //console.log("invokeManualRecord");
      //console.log("Title: " + $scope.title);
      //console.log("Duration: " + $scope.duration);
      //console.log("Date: " + $scope.date);
      //console.log("Time: " + $scope.time);
      //console.log("Input source: " + $scope.inputSource);
      //console.log("Channel: " + $scope.channel);

      var date = this.date;
      var time = this.time;

      date.clearTime();
      var dateObj = date.set({
        millisecond: 0,
        second: 0,
        minute: time.getMinutes(),
        hour: time.getHours()
      });

      // check to see if recording is in the past
      var dtEndOfRecording = new Date(dateObj).addMinutes(this.duration);
      var now = new Date();

      var millisecondsUntilEndOfRecording = dtEndOfRecording - now;
      if (millisecondsUntilEndOfRecording < 0) {
        alert("Recording time is in the past - change the date/time and try again.");
      }

      $scope.manualRecordingParameters = {}
      //$scope.manualRecordingParameters.title = $scope.getRecordingTitle("#manualRecordTitle", dateObj, $scope.inputSource, $scope.channel);
      $scope.manualRecordingParameters.title = this.title;
      $scope.manualRecordingParameters.dateTime = dateObj;
      $scope.manualRecordingParameters.duration = this.duration.toString();
      $scope.manualRecordingParameters.inputSource = this.inputSource;
      $scope.manualRecordingParameters.channel = this.channel.toString();

      console.log("invoke jtrServerService.manualRecording");

      jtrServerService.manualRecording($scope.manualRecordingParameters);
    };

  })

