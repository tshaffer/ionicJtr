/**
 * Created by tedshaffer on 2/27/16.
 */
angular.module('jtr.controllers')

  .controller('ProgramDetailsCtrl', function($scope, $stateParams, jtrSettingsService, jtrServerService, jtrCGServices, jtrStationsService, jtrSettingsService) {

    $scope.startTimeOffsets = [-15, -10, -5, 0, 5, 10, 15];
    $scope.stopTimeOffsets = [-30, -15, -10, -5, 0, 5, 10, 15, 30, 60, 90, 120, 180];

    $scope.startTimeOptions = ["15 minutes early", "10 minutes early", "5 minutes early", "On time", "5 minutes late", "10 minutes late", "15 minutes late"];
    $scope.stopTimeOptions = ["30 minutes early", "15 minutes early", "10 minutes early", "5 minutes early", "On time", "5 minutes late", "10 minutes late", "15 minutes late", "30 minute late", "1 hour late", "1 1/2 hours late", "2 hours late", "3 hours late"];

    $scope.startTimeOnTimeIndex = 3;
    $scope.stopTimeOnTimeIndex = 4;

    $scope.startTimeIndex = $scope.startTimeOnTimeIndex;
    $scope.stopTimeIndex = $scope.stopTimeOnTimeIndex;

    $scope.startTime = $scope.startTimeOptions[$scope.startTimeIndex];
    $scope.stopTime = $scope.stopTimeOptions[$scope.stopTimeIndex];

    $scope.addRecordToDB = true;

    $scope.invokeCancelRecording = function() {

      var promise = jtrServerService.deleteScheduledRecording($scope.cgSelectedProgram.scheduledRecordingId);
      promise.then(function() {
        $scope.retrieveScheduledRecordings();
      })
    }

    $scope.invokeCancelSeries = function () {

      var promise = jtrServerService.deleteScheduledSeries($scope.cgSelectedProgram.scheduledSeriesRecordingId);
      promise.then(function() {
        $scope.retrieveScheduledRecordings();
      })
    }

    $scope.invokeRecordEpisode = function() {

      $scope.cgSelectedProgram.startTimeOffset = $scope.startTimeOffsets[$scope.startTimeIndex];
      $scope.cgSelectedProgram.stopTimeOffset = $scope.stopTimeOffsets[$scope.stopTimeIndex];

      if ($scope.addRecordToDB) {
        var stationName = jtrStationsService.getStationFromId($scope.cgSelectedStationId);
        stationName = stationName.replace(".", "-");

        var commandData = {
          "command": "addRecord",
          "dateTime": $scope.cgSelectedProgram.date,
          "title": $scope.cgSelectedProgram.title,
          "duration": $scope.cgSelectedProgram.duration,
          "inputSource": "tuner",
          "channel": stationName,
          "recordingBitRate": jtrSettingsService.getSettingsResult().RecordingBitRate,
          "segmentRecording": jtrSettingsService.getSettingsResult().SegmentRecordings,
          "scheduledSeriesRecordingId": $scope.cgSelectedProgram.scheduledSeriesRecordingId,
          "startTimeOffset": $scope.cgSelectedProgram.startTimeOffset,
          "stopTimeOffset": $scope.cgSelectedProgram.stopTimeOffset
        };
      }
      else {
        var commandData = {
          "command": "updateScheduledRecording",
          "id": $scope.cgSelectedProgram.scheduledRecordingId,
          "startTimeOffset": $scope.cgSelectedProgram.startTimeOffset,
          "stopTimeOffset": $scope.cgSelectedProgram.stopTimeOffset
        };
      }

      var promise = jtrServerService.browserCommand(commandData);
      promise.then(function() {
        $scope.retrieveScheduledRecordings();
      })
    }

    $scope.invokeRecordSeries = function() {

      var stationName = jtrStationsService.getStationFromId($scope.cgSelectedStationId);
      stationName = stationName.replace(".", "-");

      var commandData = {
        "command": "addSeries",
        "title": $scope.cgSelectedProgram.title,
        "inputSource": "tuner",
        "channel": stationName,
        //"recordingBitRate": $scope.getRecordingBitRate(),
        //"segmentRecording": $scope.getSegmentRecordings()
        "recordingBitRate": 6,
        "segmentRecording": 0
      };

      var promise = jtrServerService.browserCommand(commandData);
      promise.then(function() {
        $scope.retrieveScheduledRecordings();
      })
    }

    $scope.invokeViewUpcomingEpisodes = function() {
    }

    $scope.invokeTune = function() {

      var stationName = jtrStationsService.getStationFromId($scope.cgSelectedStationId);
      stationName = stationName.replace(".", "-");

      var commandData = { "command": "tuneLiveVideoChannel", "enteredChannel": stationName };

      jtrServerService.browserCommand(commandData);
    }

    $scope.retrieveScheduledRecordings = function() {

      var currentDateTimeIso = new Date().toISOString();
      var currentDateTime = {"currentDateTime": currentDateTimeIso};
      var promise = jtrServerService.getScheduledRecordings(currentDateTime);
      promise.then(function(scheduledRecordings) {
        $scope.scheduledRecordings = [];
        $.each(scheduledRecordings, function (index, scheduledRecording) {
          $scope.scheduledRecordings.push(scheduledRecording);
        });
      });
    }

    $scope.cgRecordOptionsNextEarlyStartTime = function() {
      console.log("recordOptionsNextEarlyStartTime invoked");
      if ($scope.startTimeIndex > 0) {
        $scope.startTimeIndex--;
        $scope.displayStartTimeSetting();
      }
    }

    $scope.cgRecordOptionsNextLateStartTime = function() {
      console.log("cgRecordOptionsNextLateStartTime invoked");
      if ($scope.startTimeIndex < ($scope.startTimeOptions.length-1)) {
        $scope.startTimeIndex++;
        $scope.displayStartTimeSetting();
      }
    }

    $scope.cgRecordOptionsNextEarlyStopTime = function() {
      console.log("cgRecordOptionsNextEarlyStopTime invoked");
      if ($scope.stopTimeIndex > 0) {
        $scope.stopTimeIndex--;
        $scope.displayStopTimeSetting();
      }
    }

    $scope.cgRecordOptionsNextLateStopTime = function() {
      console.log("cgRecordOptionsNextLateStopTime invoked");
      if ($scope.stopTimeIndex < ($scope.stopTimeOptions.length-1)) {
        $scope.stopTimeIndex++;
        $scope.displayStopTimeSetting();
      }
    }

    $scope.displayStartTimeSetting = function () {
      $scope.startTime = $scope.startTimeOptions[$scope.startTimeIndex];
    }

    $scope.displayStopTimeSetting = function () {
      $scope.stopTime = $scope.stopTimeOptions[$scope.stopTimeIndex];
    }

    $scope.programsMatch = function (scheduledRecording, cgProgram, cgStationId) {

      // JTRTODO - what other criteria should be used?
      var channel = jtrStationsService.getChannelFromStationIndex(cgStationId);
      if (channel != scheduledRecording.Channel) return false;

      if (scheduledRecording.Title != $scope.cgSelectedProgram.title) return false;

      if (new Date(scheduledRecording.DateTime).getTime() != $scope.cgSelectedProgram.date.getTime()) return false;

      return true;
    }

    $scope.setVisibility = function(displayCancelRecording, displayCancelSeries, displayRecord, displayRecordEpisode, displayRecordSeries, displayViewUpcomingEpisodes, displayTune) {
      $scope.displayCancelRecording = displayCancelRecording;
      $scope.displayCancelSeries = displayCancelSeries;
      $scope.displayRecord = displayRecord;
      $scope.displayRecordEpisode = displayRecordEpisode;
      $scope.displayRecordSeries = displayRecordSeries;
      $scope.displayViewUpcomingEpisodes = displayViewUpcomingEpisodes;
      $scope.displayTune = displayTune;
    }

    var programId = $stateParams.programId;

    var programInfo = jtrCGServices.parseProgramId(programId);

    var stationId = programInfo.stationId;
    var programIndex = programInfo.programIndex;

    var programList = jtrCGServices.getProgramList(stationId);

    var selectedProgram = programList[programIndex];
    var programTime = programList[programIndex].date;

    $scope.program = {};
    $scope.program.Title = selectedProgram.title;

    // display title (prominently)
    $("#cgProgramName").text(selectedProgram.title);

    // display day/date of selected program in upper left of channel guide
    var programDayDate = dayDate(selectedProgram.date);
    $("#cgDayDate").text(programDayDate);

    $("#programInfo").empty();

    // day, date, and time
    var startTime = timeOfDay(selectedProgram.date);

    var endDate = new Date(selectedProgram.date.getTime()).addMinutes(selectedProgram.duration);
    var endTime = timeOfDay(endDate);

    var dateTimeInfo = programDayDate + " " + startTime + " - " + endTime;

    var episodeInfo = "";
    if (selectedProgram.showType == "Series" && selectedProgram.newShow == 0) {
      episodeInfo = "Rerun";
      if (selectedProgram.originalAirDate != "") {
        episodeInfo += ": original air date was " + selectedProgram.originalAirDate;
        if (selectedProgram.seasonEpisode != "") {
          episodeInfo += ", " + selectedProgram.seasonEpisode;
        }
      }
    }

    $("#cgDateTimeInfo").html(dateTimeInfo)

    var episodeTitle = selectedProgram.episodeTitle;
    if (episodeTitle == "") {
      episodeTitle = "<br/>";
    }
    $("#cgEpisodeTitle").html(episodeTitle)

    var programDescription = selectedProgram.longDescription;
    if (programDescription == "") {
      programDescription = selectedProgram.shortDescription;
    }
    if (programDescription == "") {
      programDescription = "<br/>";
    }
    $("#cgDescription").html(programDescription)

    var castMembers = selectedProgram.castMembers;
    if (castMembers == "") {
      castMembers = "<br/>";
    }
    $("#cgCastMembers").html(castMembers)

    if (episodeInfo == "") {
      episodeInfo = "<br/>";
    }
    $("#episodeInfo").html(episodeInfo)

    var stationIndex = jtrStationsService.getStationIndex(stationId);
    if (stationIndex >= 0) {
      //$scope._currentStationIndex = stationIndex;
      //$scope.selectProgram($scope._currentSelectedProgramButton, event.target);
      //var programData = $scope.getSelectedStationAndProgram();
      //
      //$jtrBroadcastService.broadcastMsg("cgRecordings", programData);

      var programData = {};
      programData.stationId = stationId;
      programData.program = selectedProgram;

      // from cgRecordingsMgr
      var self = this;

      var currentDateTimeIso = new Date().toISOString();
      var currentDateTime = {"currentDateTime": currentDateTimeIso};

      var scheduledRecordings = [];

      var getScheduledRecordingsPromise = jtrServerService.getScheduledRecordings(currentDateTime);
      getScheduledRecordingsPromise.then(function(results) {

        var scheduledRecordings =  results.data;

        $scope.cgSelectedProgram = programData.program;
        $scope.cgSelectedStationId = programData.stationId;

        $scope.stopTimeIndex = $scope.stopTimeOnTimeIndex;
        $scope.startTimeIndex = $scope.startTimeOnTimeIndex;

        // check the program that the user has clicked
        // display different pop ups based on
        //      single vs. series
        //      already scheduled to record or not
        var cgSelectedProgramScheduledToRecord = false;
        $scope.cgSelectedProgram.scheduledRecordingId = -1;
        $scope.cgSelectedProgram.scheduledSeriesRecordingId = -1;
        $scope.cgSelectedProgram.startTimeOffset = 0;
        $scope.cgSelectedProgram.stopTimeOffset = 0;

        $.each(scheduledRecordings, function (index, scheduledRecording) {
          cgSelectedProgramScheduledToRecord = $scope.programsMatch(scheduledRecording, $scope.cgSelectedProgram, $scope.cgSelectedStationId);
          if (cgSelectedProgramScheduledToRecord) {
            $scope.cgSelectedProgram.scheduledRecordingId = scheduledRecording.Id;
            $scope.cgSelectedProgram.scheduledSeriesRecordingId = scheduledRecording.ScheduledSeriesRecordingId;
            $scope.cgSelectedProgram.startTimeOffset = scheduledRecording.StartTimeOffset;
            $scope.cgSelectedProgram.stopTimeOffset = scheduledRecording.StopTimeOffset;
            return false;
          }
        });

        //$scope.modalTitle = $scope.cgSelectedProgram.title;
        //
        if ($scope.cgSelectedProgram.showType == "Series") {
          if ($scope.cgSelectedProgram.scheduledRecordingId == -1) {
            // not yet scheduled to record
            //$scope.items = $scope.recordSeriesItems;
            $scope.setVisibility(false, false, false, true, true, true, true);
          }
          //displayCancelRecording, displayCancelSeries, displayRecord, displayRecordEpisode, displayRecordSeries, displayViewUpcomingEpisodes
          else {
            // previously scheduled to record
            if ($scope.cgSelectedProgram.scheduledSeriesRecordingId > 0) {
              //$scope.items = $scope.scheduledSeriesItems;
              $scope.setVisibility(true, true, false, false, false, true, true);
            }
            else {
              //$scope.items = $scope.scheduledRecordingItems;
              $scope.setVisibility(true, false, false, false, false, true, true);
            }
          }
        }
        else        // single program recordings (not series)
        {
          if ($scope.cgSelectedProgram.scheduledRecordingId == -1) {         // no recording set
            //$scope.items = $scope.recordEpisodeItems;
            $scope.setVisibility(false, false, true, false, false, true, true);
          }
          else {                                                          // recording already setup
            //$scope.items = $scope.scheduledRecordingItems;
            $scope.setVisibility(true, false, false, false, false, true, true);
          }
        }
      });

    }

  })

