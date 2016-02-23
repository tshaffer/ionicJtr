/**
 * Created by tedshaffer on 2/15/16.
 */
angular.module('jtr.jtrServerService', [])

  .service ('jtrServerService', ['$http', function($http){

    var self = this;
    this.recordings = [];

    var baseURL = document.baseURI.replace("?", "");
    console.log("document.baseURI=" + document.baseURI);
    console.log("set baseURL from document:" + baseURL);
    if (baseURL.indexOf("localhost") >= 0) {
      this.baseUrl = "http://192.168.0.103:8080/";
      //this.baseUrl = "http://10.1.0.169:8080/";
    }
    else {
      this.baseUrl = document.baseURI.substr(0, document.baseURI.lastIndexOf(":")) + ":8080/";
    }
    this.baseUrl = "http://192.168.0.103:8080/";
    //this.baseUrl = "http://10.1.0.169:8080/";

    this.browserCommand = function(commandData) {

      console.log("jtrServerService::browserCommand");

      var url = self.baseUrl + "browserCommand";

      console.log("jtrServerService::browserCommand, url=" + url);

      var promise = $http.get(url, {
        params: commandData
      });
      return promise;
    };


    this.manualRecording = function(manualRecordingParameters) {

      var url = self.baseUrl + "manualRecording";

      var promise = $http.post(url, {
        params: manualRecordingParameters
      });
      return promise;
    };


    this.getRecordings = function () {

      console.log("jtrServerService::getRecordings");
      var promise = $http.get('http://192.168.0.103:8080/getRecordings');
      //var promise = $http.get('http://10.1.0.169:8080/getRecordings');
      return promise;

      //  $http.get('http://192.168.0.103:8080/getRecordings').success(function(data) {
      //  console.log("getRecordings success");
      //  return data.recordings;
      //});

      //var url = self.baseUrl + "getRecordings";
      //
      //var promise = $http.get(url, {});
      //return promise;
    };

    this.setRecordings = function(recordings) {
      this.recordings = recordings;
    }

    this.getRecording = function(recordingId) {
      console.log("getRecording invoked with recordingId=" + recordingId);

      for (i = 0; i < this.recordings.length; i++) {
        var recording = this.recordings[i];
        if (recording.RecordingId == recordingId) {
          return recording;
        }
      }

      return null;
    }

    this.getStations = function() {

      var url = self.baseUrl + "getStations";

      var promise = $http.get(url, {});
      return promise;
    };

    this.getEpgData = function() {

      var url = self.baseUrl + "getEpg";

      var epgStartDate = new Date().toString("yyyy-MM-dd");

      var promise = $http.get(url, {
        params: { startDate: epgStartDate }
      });
      return promise;
    };


  }])
