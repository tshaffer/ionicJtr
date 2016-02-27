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

    console.log("Pizza is here");

    var programId = $stateParams.programId;
    var programInfo = jtrCGServices.parseProgramId(programId);
  })

