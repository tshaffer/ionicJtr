/**
 * Created by tedshaffer on 2/27/16.
 */
angular.module('jtr.jtrCGServices', [])

  .service ('jtrCGServices', ['jtrEpgFactory', function(jtrEpgFactory) {

    var self = this;

    this.epgProgramSchedule = null;

    this.parseProgramId = function (programId) {

      var idParts = programId.split("-");

      var programInfo = {};
      programInfo.stationId = idParts[1];
      programInfo.programIndex = idParts[2];

      return programInfo;
    };

    this.getProgramList = function(stationId) {

      if (this.epgProgramSchedule == null) {
        this.epgProgramSchedule = jtrEpgFactory.getEpgProgramSchedule();
      }
      var programStationData = this.epgProgramSchedule[stationId];
      return programStationData.programList;
    };


  }])
