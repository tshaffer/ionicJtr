/**
 * Created by tedshaffer on 2/15/16.
 */
//angular.module('jtr.jtrServerService', ['$http', function($http) {
angular.module('jtr.jtrServerService', [])

  .service ('jtrServerService', ['$http', function($http){

    var self = this;
    this.recordings = [];

    var baseURL = document.baseURI.replace("?", "");
    if (baseURL.indexOf("localhost") >= 0) {
      this.baseUrl = "http://192.168.0.105:8080/";
      //this.baseUrl = "http://10.1.0.169:8080/";
    }
    else {
      this.baseUrl = document.baseURI.substr(0, document.baseURI.lastIndexOf(":")) + ":8080/";
    }

    this.browserCommand = function(commandData) {

      var url = self.baseUrl + "browserCommand";

      var promise = $http.get(url, {
        params: commandData
      });
      return promise;
    };


    this.getRecordings = function () {

      console.log("jtrServerService::getRecordings");
      var promise = $http.get('http://192.168.0.105:8080/getRecordings');
      //var promise = $http.get('http://10.1.0.169:8080/getRecordings');
      return promise;

      //  $http.get('http://192.168.0.105:8080/getRecordings').success(function(data) {
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

  }])
