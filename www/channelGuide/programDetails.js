/**
 * Created by tedshaffer on 2/27/16.
 */
angular.module('jtr.controllers')

  .controller('ProgramDetailsCtrl', function($scope, $stateParams, jtrCGServices) {

    //$scope.playRecordedShow = function(recording) {
    //  console.log("controller.js::Play recording: " + recording.Title);
    //
    //  var commandData;
    //
    //  var storedRecording = {
    //    recordingId: recording.RecordingId,
    //    relativeUrl: recording.relativeurl,
    //    storageLocation: recording.storagelocation,
    //    storageDevice: recording.storagedevice
    //  };
    //
    //  commandData = {"command": "playRecordedShow", "storedRecording": storedRecording };
    //
    //  var promise = jtrServerService.browserCommand(commandData);
    //  promise.then(function () {
    //    console.log("browserCommand successfully sent");
    //  })
    //};
    //
    //
    //$scope.recording = jtrServerService.getRecording($stateParams.recordingId);
    //$scope.playRecordedShow($scope.recording);

    var programId = $stateParams.programId;

    var programInfo = jtrCGServices.parseProgramId(programId);

    var stationId = programInfo.stationId;
    var programIndex = programInfo.programIndex;

    var programList = jtrCGServices.getProgramList(stationId);

    var selectedProgram = programList[programIndex];

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

  })

