/**
 * Created by tedshaffer on 2/27/16.
 */
angular.module('jtr.jtrCGServices', [])

  .service ('jtrCGServices', function() {

    this.parseProgramId = function (programId) {

      var idParts = programId.split("-");

      var programInfo = {};
      programInfo.stationId = idParts[1];
      programInfo.programIndex = idParts[2];

      return programInfo;
    };

  })
